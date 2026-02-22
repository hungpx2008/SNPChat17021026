"use server";

import { createHash } from "crypto";
import { getContextualHelp } from "@/ai/flows/contextual-help";
import { getMultimodalHelp } from "@/ai/flows/multimodal-help";
import { getMemory } from "@/lib/memory";
import { chatBackend, type BackendMessage } from "@/services/chat-backend";
import { localOpenAI, LOCAL_LLM_MODEL } from "@/ai/localClient";

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
      let mem0Memories: any[] = [];

      // Run semantic search + direct Mem0 memory fetch in parallel
      const [searchResult, memoryResult] = await Promise.allSettled([
        chatBackend.semanticSearch({
          user_id: memoryUserId,
          department,
          query: question,
          limit: 5,
        }),
        (async () => {
          // Direct Mem0 get_all — guaranteed to return ALL user memories
          const mem = await getMemory();
          return mem.search(question, { user_id: memoryUserId, limit: 10 });
        })(),
      ]);

      if (searchResult.status === 'fulfilled') {
        contextResults = searchResult.value;
      } else {
        console.error("[getHelp] Semantic search failed", searchResult.reason);
      }
      if (memoryResult.status === 'fulfilled') {
        mem0Memories = memoryResult.value;
      } else {
        console.error("[getHelp] Mem0 memory fetch failed", memoryResult.reason);
      }

      // ===== HYBRID CONTEXT WINDOW (3+3+summary) =====
      // Tier 1: 3 most recent messages (raw, for immediate context)
      let recentMessages: BackendMessage[] = [];
      // Tier 3: Session summary (async-generated every 10 messages)
      let sessionSummary: string | null = null;

      try {
        const session = await chatBackend.fetchSession(sessionId, { limit: 3 });
        recentMessages = session.messages || [];
        // Extract summary from session metadata (set by summarize_session_history task)
        const meta = session.metadata || (session as any).meta;
        if (meta && typeof meta === 'object' && typeof (meta as any).summary === 'string') {
          sessionSummary = (meta as any).summary;
        }
      } catch (error) {
        console.error("[getHelp] Could not fetch session", error);
      }

      // Tier 2: 3 semantically relevant old conversation chunks
      let relevantOldChunks: any[] = [];
      try {
        const searchResults = await chatBackend.semanticSearch({
          user_id: memoryUserId,
          department,
          query: question,
          limit: 3,
        });
        // Only use short_term (chat_chunks) results, not long_term
        relevantOldChunks = (searchResults || []).filter((r: any) => r.source === 'short_term');
      } catch {
        // Search failure is non-critical
      }

      const contextBlocks: ContextBlock[] = [];

      // Inject Tier 3: Session summary (if exists)
      if (sessionSummary) {
        contextBlocks.push({
          title: "Tóm tắt hội thoại trước đó",
          content: sessionSummary,
        });
      }

      // Inject dedicated Mem0 memories (guaranteed personalization)
      if (mem0Memories.length > 0) {
        contextBlocks.push({
          title: "Thông tin cần nhớ về người dùng (Long-term Memory)",
          content: mem0Memories
            .map((item) => {
              const text = truncate(item?.text ?? item?.memory ?? "", 500);
              return `- ${text}`;
            })
            .join("\n"),
        });
      }

      // Inject Tier 2: Relevant old conversation chunks
      if (relevantOldChunks.length > 0) {
        contextBlocks.push({
          title: "Đoạn hội thoại cũ liên quan",
          content: relevantOldChunks
            .map((item, i) => {
              const text = truncate(item?.text ?? "", 400);
              const score = typeof item?.score === "number" ? ` (relevance: ${item.score.toFixed(2)})` : "";
              return `#${i + 1}${score}\n${text}`;
            })
            .join("\n\n"),
        });
      }

      if (Array.isArray(contextResults) && contextResults.length) {
        const longTermMemories = contextResults.filter(r => r.source === 'long_term');

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
      } else if (memoryUserId && mem0Memories.length === 0) {
        contextBlocks.push({
          title: `Memory status`,
          content: "No prior memories or relevant documents found.",
        });
      }

      // Inject Tier 1: Recent conversation (3 messages, raw)
      const shortTermText = formatHistory(recentMessages);
      if (shortTermText.trim()) {
        contextBlocks.push({
          title: "Cuộc trò chuyện gần nhất (3 tin nhắn)",
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
        response: "Xin lỗi Đại ca, hệ thống gặp sự cố. Vui lòng thử lại sau ạ.",
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

/**
 * Generate 3 contextual follow-up suggestions based on the last user question
 * and the bot's response. Returns an empty array on any failure.
 */
export async function getSuggestions(
  userQuestion: string,
  botResponse: string,
): Promise<string[]> {
  try {
    const completion = await localOpenAI.chat.completions.create({
      model: LOCAL_LLM_MODEL,
      temperature: 0.5,
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content:
            "Bạn là trợ lý cảng biển. Dựa vào câu hỏi và câu trả lời dưới đây, hãy đề xuất đúng 3 câu hỏi tiếp theo ngắn gọn (tối đa 10 từ mỗi câu) mà người dùng có thể hỏi. Trả về JSON array thuần túy, không giải thích, ví dụ: [\"Câu 1\",\"Câu 2\",\"Câu 3\"]",
        },
        {
          role: "user",
          content: `Câu hỏi: ${userQuestion.slice(0, 300)}\nCâu trả lời: ${botResponse.slice(0, 500)}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    // Extract JSON array from response (LLM may wrap it in markdown)
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) return [];
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
      .slice(0, 3);
  } catch {
    return [];
  }
}
