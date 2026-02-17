import OpenAI from 'openai';

const LOCAL_LLM_BASE_URL =
  process.env.OPENAI_BASE_URL ||
  process.env.OPENROUTER_API_BASE ||
  'https://openrouter.ai/api/v1';

export const LOCAL_LLM_MODEL =
  process.env.LOCAL_LLM_MODEL ||
  process.env.NEXT_PUBLIC_LOCAL_LLM_MODEL ||
  'gpt-oss-120b';

export const localOpenAI = new OpenAI({
  apiKey:
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENAI_API_KEY ||
    'not-needed',
  baseURL: LOCAL_LLM_BASE_URL,
});
