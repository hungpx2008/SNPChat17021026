'use server';

import { z } from 'zod';
import { localOpenAI, LOCAL_LLM_MODEL } from '@/ai/localClient';

const ContextBlockSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const ContextualHelpInputSchema = z.object({
  question: z.string().min(1).describe('The user’s question.'),
  department: z.string().min(1).describe('The department selected by the user.'),
  context: z.array(ContextBlockSchema).optional(),
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

  const contextSections = input.context?.length
    ? input.context
        .map((block) => `### ${block.title}\n${block.content}`)
        .join('\n\n')
    : 'No prior context provided. Answer using general knowledge and the department rules.';

  const systemPrompt =
    "You are a helpful assistant for the " + input.department + " department.\n" +
    "Your goal is to answer user questions accurately and naturally. Always incorporate the available context when forming your answer.\n\n" +
    "**CONTEXT**\n" +
    contextSections +
    "\n\n" +
    "**RULES:**\n" +
    "1.  **Language:** You MUST detect the user's language and reply ONLY in that same language.\n" +
    "2.  **Tone:** Be friendly and natural. Do not say you are an AI.\n" +
    "3.  **Formatting:** When presenting information, use clear and simple language. Use Markdown for basic styling like bold text, italics, and bulleted lists (`*` or `-`).\n" +
    "    **IMPORTANT**: Do NOT use Markdown tables. For example, do NOT use | Header | or |--|.\n" +
    "    **If a table is required, you MUST format it using valid HTML table syntax** (with <table>, <thead>, <tbody>, <tr>, <th>, and <td> tags). Ensure the HTML is well-formed and complete.\n" +
    "4.  **Conversation memory:** Reference relevant context explicitly (names, preferences, previous answers) when responding.\n\n" +
    "Use your knowledge, the provided context, and any additional information to answer the user's question.";

  const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content:
        "Based on the context above (treat it as authoritative and override any prior knowledge), answer the following question as precisely as possible:\n" +
        input.question,
    },
  ];

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
