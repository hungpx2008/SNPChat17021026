'use server';

import { z } from 'zod';
import { localOpenAI, LOCAL_LLM_MODEL } from '@/ai/localClient';

const ConversationTurnSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

const ContextualHelpInputSchema = z.object({
  question: z.string().min(1).describe('The user’s question.'),
  department: z.string().min(1).describe('The department selected by the user.'),
  history: z.array(ConversationTurnSchema).max(50).optional(),
});
export type ContextualHelpInput = z.infer<typeof ContextualHelpInputSchema>;

const ContextualHelpOutputSchema = z.object({
  response: z.string().describe('The chatbot’s contextually relevant response.'),
  usage: z
    .object({
      promptTokens: z.number().nonnegative().optional(),
      completionTokens: z.number().nonnegative().optional(),
      totalTokens: z.number().nonnegative().optional(),
      systemFingerprint: z.string().optional(),
    })
    .optional(),
});
export type ContextualHelpOutput = z.infer<typeof ContextualHelpOutputSchema>;

export async function getContextualHelp(
  rawInput: ContextualHelpInput
): Promise<ContextualHelpOutput> {
  const input = ContextualHelpInputSchema.parse(rawInput);

  const systemPrompt =
    "You are a helpful assistant for the " + input.department + " department.\n" +
    "Your goal is to answer user questions accurately and naturally. Always incorporate the preceding conversation history when forming your answer.\n\n" +
    "**RULES:**\n" +
    "1.  **Language:** You MUST detect the user's language and reply ONLY in that same language.\n" +
    "2.  **Tone:** Be friendly and natural. Do not say you are an AI.\n" +
    "3.  **Formatting:** When presenting information, use clear and simple language. Use Markdown for basic styling like bold text, italics, and bulleted lists (`*` or `-`).\n" +
    "    **IMPORTANT**: Do NOT use Markdown tables. For example, do NOT use | Header | or |--|. \n" +
    "    **If a table is required, you MUST format it using valid HTML table syntax** (with <table>, <thead>, <tbody>, <tr>, <th>, and <td> tags). Ensure the HTML is well-formed and complete.\n" +
    "4.  **Conversation memory:** Carefully read the conversation history above and reference relevant details explicitly (names, preferences, previous answers) when responding.\n\n" +
    "Use your knowledge, the provided conversation history, and any additional context to answer the user's question.";

  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
  ];

  if (input.history && input.history.length) {
    for (const turn of input.history) {
      messages.push({ role: turn.role, content: turn.content });
    }
  }

  messages.push({
    role: 'user',
    content:
      "Based on the conversation history above (treat it as the ground truth and override any prior knowledge), answer the following question as precisely as possible:\n" +
      input.question,
  });

  console.log('[contextual-help] messages payload', messages);

  const resp = await localOpenAI.chat.completions.create({
    model: LOCAL_LLM_MODEL,
    messages,
  });

  const text =
    resp.choices?.[0]?.message?.content?.toString() ??
    '[No content returned from local model]';

  const usage = resp.usage
    ? {
        promptTokens: resp.usage.prompt_tokens ?? undefined,
        completionTokens: resp.usage.completion_tokens ?? undefined,
        totalTokens: resp.usage.total_tokens ?? undefined,
        systemFingerprint: resp.system_fingerprint ?? undefined,
      }
    : undefined;

  return ContextualHelpOutputSchema.parse({ response: text, usage });
}
