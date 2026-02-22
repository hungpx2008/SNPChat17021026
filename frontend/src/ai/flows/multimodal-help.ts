'use server';

import { z } from 'zod';
import { localOpenAI, LOCAL_LLM_MODEL } from '@/ai/localClient';
import { extractTextFromFile } from '@/services/file-parser';

const dataUriRegex =
  /^data:([a-zA-Z0-9!#$&^_.+-]+\/[a-zA-Z0-9!#$&^_.+-]+);base64,[A-Za-z0-9+/=]+$/;

const ContextBlockSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

const MultimodalHelpInputSchema = z.object({
  question: z.string().min(1).describe('The user’s question.'),
  department: z.string().min(1).describe('The department selected by the user.'),
  photoDataUri: z
    .string()
    .regex(dataUriRegex, 'photoDataUri must be a valid base64 data URI')
    .optional()
    .describe(
      "Optional photo/audio/document as data URI: 'data:<mimetype>;base64,<encoded>'"
    ),
  context: z.array(ContextBlockSchema).optional(),
});
export type MultimodalHelpInput = z.infer<typeof MultimodalHelpInputSchema>;

const MultimodalHelpOutputSchema = z.object({
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
export type MultimodalHelpOutput = z.infer<typeof MultimodalHelpOutputSchema>;

const MAX_FILECONTENT_CHARS = 16_000; // Reduced from 100_000
function clamp(s?: string, max = MAX_FILECONTENT_CHARS) {
  if (!s) return s;
  return s.length > max ? s.slice(0, max) + '\n\n[...truncated…]' : s;
}

export async function getMultimodalHelp(
  rawInput: MultimodalHelpInput
): Promise<MultimodalHelpOutput> {
  const input = MultimodalHelpInputSchema.parse(rawInput);

  let mode: 'document' | 'image' | 'audio' | 'none' | 'unknown' = 'none';
  let fileContent: string | undefined;
  let dataUri = input.photoDataUri;

  if (dataUri) {
    try {
      const parsed = await extractTextFromFile(dataUri);
      if (parsed?.type === 'document') {
        mode = 'document';
        fileContent = clamp(parsed.content || undefined);
        dataUri = undefined;
      } else if (parsed?.type === 'image') {
        mode = 'image';
      } else if (parsed?.type === 'audio') {
        mode = 'audio';
      } else {
        mode = 'unknown';
      }
    } catch (e) {
      console.error('Could not parse file; fallback to raw media if possible.', e);
      mode = 'unknown';
    }
  }

  const contextSections = input.context?.length
    ? input.context
      .map((block) => `### ${block.title}\n${block.content}`)
      .join('\n\n')
    : 'No prior context provided. Answer using general knowledge and the department rules.';

  const systemPrompt =
    "You are a helpful assistant for the " + input.department + " department.\n" +
    "You are a PORT OPERATIONS ASSISTANT. Your goal is to answer user questions accurately and naturally. Always incorporate the available context when forming your answer.\n\n" +
    "**CONTEXT**\n" +
    contextSections +
    "\n\n" +
    "**RULES:**\n" +
    "1.  **Language:** You MUST detect the user's language and reply ONLY in that same language.\n" +
    "2.  **Tone:** Be friendly and natural. Do not say you are an AI.\n" +
    "3.  **Formatting:**\n" +
    "    -   Use clear and simple language.\n" +
    "    -   Use Markdown for basic styling like bold text, italics, and bulleted lists (`*` or `-`).\n" +
    "    -   **CRITICAL**: Do NOT use Markdown tables. For example, do NOT use | Header | or |---|. \n" +
    "    -   **If a table is required, you MUST format it using valid HTML table syntax** (with <table>, <thead>, <tbody>, <tr>, <th>, and <td> tags). Ensure the HTML is well-formed and complete.\n" +
    "4.  **Conversation memory:** Carefully read the context above and reference relevant details explicitly when responding.\n" +
    "5.  **NO CODE EVER:** TUYỆT ĐỐI KHÔNG BAO GIỜ hiển thị mã code (Python, SQL, HTML, v.v.), câu lệnh kỹ thuật, hoặc hướng dẫn lập trình. Chỉ trả lời bằng ngôn ngữ tự nhiên, tập trung vào kết quả nghiệp vụ. NEVER suggest generating scripts, running code, or programming solutions.\n\n" +
    "Use your knowledge, the department context, the provided context, and any provided document/media to answer the user's question.";

  const baseMessages: { role: 'system' | 'user' | 'assistant'; content: any }[] = [
    { role: 'system', content: systemPrompt },
  ];

  if (mode === 'document' || !dataUri) {
    const userText =
      `Based on the context above (treat it as authoritative and override any prior knowledge), answer the question below as precisely as possible.\n\nQuestion:\n${input.question}\n` +
      (fileContent
        ? `\nThe user provided a document. Treat it as the PRIMARY source of truth:\n---\n${fileContent}\n---\n`
        : '');

    console.log('[multimodal-help] document payload', {
      mode,
      fileContentLength: fileContent?.length,
      userTextPreview: userText.slice(0, 500),
    });

    const resp = await localOpenAI.chat.completions.create({
      model: LOCAL_LLM_MODEL,
      messages: [...baseMessages, { role: 'user', content: userText }],
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
    return MultimodalHelpOutputSchema.parse({ response: text, usage });
  }

  const contentParts: any[] = [{
    type: 'text',
    text:
      "Based on the context above (treat it as the authoritative context and override any prior knowledge), answer the following question as precisely as possible:\n" +
      input.question,
  }];

  if (mode === 'image') {
    contentParts.push({
      type: 'image_url',
      image_url: { url: dataUri! },
    });
  } else if (mode === 'audio') {
    contentParts.push({
      type: 'text',
      text:
        'Attached audio as data URI (this model may not process audio directly in chat). ' +
        `Preview (base64 prefix): ${dataUri!.slice(0, 64)}...`,
    });
  } else {
    contentParts.push({
      type: 'text',
      text: `Attached media (unknown type). Prefix: ${dataUri!.slice(0, 64)}...`,
    });
  }

  console.log('[multimodal-help] media payload', {
    mode,
    contentPartsPreview: JSON.stringify(contentParts).slice(0, 500),
  });

  const resp = await localOpenAI.chat.completions.create({
    model: LOCAL_LLM_MODEL,
    messages: [...baseMessages, { role: 'user', content: contentParts as any }],
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
  return MultimodalHelpOutputSchema.parse({ response: text, usage });
}
