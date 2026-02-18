"use server";

import { createHash } from "crypto";
import { getContextualHelp } from "@/ai/flows/contextual-help";
import { getMultimodalHelp } from "@/ai/flows/multimodal-help";
import { getMemory } from "@/lib/memory";
import { chatBackend, type BackendMessage } from "@/services/chat-backend";

type HelpResult = Awaited<ReturnType<typeof getContextualHelp>>;

const inFlightRequests = new Map<string, Promise<HelpResult>>();
const completedRequests = new Map<string, { value: HelpResult; expiresAt: number }>();
const REQUEST_CACHE_TTL_MS = 5_000;

type ContextBlock = {
  title: string;
  content: string;
};

type GetHelpParams = {
  question: string;
  department: string;
  sessionId: string;
  userId: string;
  photoDataUri?: string;
};

function formatHistory(messages: BackendMessage[]): string {
  if (!messages.length) return "";
  return messages
    .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join("\n");
}

export async function getHelp({
  question,
  department,
  sessionId,
  userId,
  photoDataUri,
}: GetHelpParams): Promise<HelpResult> {
  const memoryUserId = userId || "test-user";
  const truncate = (text: string, limit = 400) =>
    text.length > limit ? `${text.slice(0, limit)}...` : text;

  const cacheKey = JSON.stringify({
    question,
    department,
    sessionId,
    userId: memoryUserId,
    photoHash: photoDataUri ? createHash("sha256").update(photoDataUri).digest("hex") : undefined,
  });
  const cached = completedRequests.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }
  const existing = inFlightRequests.get(cacheKey);
  if (existing) {
    return existing;
  }

  if (!question || !department || !sessionId) {
    return { response: "I can't help without a question, session, and department." };
  }

  const requestPromise = (async () => {
    try {
      let contextResults: any[] = [];
      try {
        // Now calling backend semantic search which combines both Qdrant chunks and Mem0 memories
        contextResults = await chatBackend.semanticSearch({
          user_id: memoryUserId,
          department,
          query: question,
          limit: 5,
        });
      } catch (error) {
        console.error("[getHelp] Semantic search failed", error);
      }

      let shortTermHistory: BackendMessage[] = [];
      try {
        const session = await chatBackend.fetchSession(sessionId, { limit: 10 });
        shortTermHistory = session.messages || [];
      } catch (error) {
        console.error("[getHelp] Could not fetch session for short-term history", error);
      }

      const contextBlocks: ContextBlock[] = [];
      if (Array.isArray(contextResults) && contextResults.length) {
        const longTermMemories = contextResults.filter(r => r.source === 'long_term');
        const shortTermChunks = contextResults.filter(r => r.source === 'short_term');

        if (longTermMemories.length) {
          contextBlocks.push({
            title: `Long-term memory (from Mem0)`,
            content: longTermMemories
              .map((item, index) => {
                const text = truncate(item?.text ?? "", 500);
                const score = typeof item?.score === "number" ? ` (score: ${item.score.toFixed(3)})` : "";
                return `#${index + 1}${score}\n${text}`;
              })
              .join("\n\n")
          });
        }

        if (shortTermChunks.length) {
          contextBlocks.push({
            title: `Relevant local data (from Qdrant)`,
            content: shortTermChunks
              .map((item, index) => {
                const text = truncate(item?.text ?? "", 500);
                const score = typeof item?.score === "number" ? ` (score: ${item.score.toFixed(3)})` : "";
                return `#${index + 1}${score}\n${text}`;
              })
              .join("\n\n")
          });
        }
      } else if (memoryUserId) {
        contextBlocks.push({
          title: `Memory status`,
          content: "No prior memories or relevant documents found.",
        });
      }

      const shortTermText = formatHistory(shortTermHistory);
      if (shortTermText.trim()) {
        contextBlocks.push({
          title: "Recent conversation (last 10 messages)",
          content: shortTermText,
        });
      }

      const llmResult = photoDataUri
        ? await getMultimodalHelp({
          question,
          department,
          photoDataUri,
          context: contextBlocks,
        })
        : await getContextualHelp({ question, department, context: contextBlocks, user_id: memoryUserId });

      // NOTE: We no longer call memory.add here. 
      // The backend 'appendMessage' service already handles persisting to Mem0.

      return llmResult;
    } catch (error) {
      console.error("Error getting contextual help:", error);
      return {
        response: "Sorry, I encountered an error while trying to help. Please try again.",
      };
    } finally {
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, requestPromise);
  requestPromise
    .then((value) => {
      completedRequests.set(cacheKey, {
        value,
        expiresAt: Date.now() + REQUEST_CACHE_TTL_MS,
      });
      return value;
    })
    .catch(() => {
      completedRequests.delete(cacheKey);
    });

  return requestPromise;
}
