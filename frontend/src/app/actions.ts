"use server";

import { createHash } from "crypto";
import { getContextualHelp } from "@/ai/flows/contextual-help";
import { getMultimodalHelp } from "@/ai/flows/multimodal-help";

type HelpResult = Awaited<ReturnType<typeof getContextualHelp>>;

const inFlightRequests = new Map<string, Promise<HelpResult>>();
const completedRequests = new Map<string, { value: HelpResult; expiresAt: number }>();
const REQUEST_CACHE_TTL_MS = 5_000;

type ConversationTurn = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function getHelp(
  question: string,
  department: string,
  photoDataUri?: string,
  history?: ConversationTurn[],
): Promise<HelpResult> {
  const cacheKey = JSON.stringify({
    question,
    department,
    photoHash: photoDataUri
      ? createHash("sha256").update(photoDataUri).digest("hex")
      : undefined,
    historyHash: history && history.length
      ? createHash("sha256")
          .update(history.map((turn) => `${turn.role}:${turn.content}`).join("\n"))
          .digest("hex")
      : undefined,
  });
  const cached = completedRequests.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }
  const existing = inFlightRequests.get(cacheKey);
  if (existing) {
    return existing;
  }

  if (!question || !department) {
    return { response: "I can't help without a question and a department." };
  }

  const requestPromise = (async () => {
    try {
      let llmResult: HelpResult;
      if (photoDataUri) {
        llmResult = await getMultimodalHelp({
          question,
          department,
          photoDataUri,
          history,
        });
      } else {
        llmResult = await getContextualHelp({ question, department, history });
      }
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
