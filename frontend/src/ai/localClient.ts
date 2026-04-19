import OpenAI from 'openai';

import {
  buildRuntimeLlmSettingsPayload,
  type ChatRuntimeLlmSettings,
} from '@/lib/llm-settings';

const LOCAL_LLM_BASE_URL =
  process.env.OPENAI_BASE_URL ||
  process.env.OPENROUTER_API_BASE ||
  'https://ezaiapi.com';

export const LOCAL_LLM_MODEL =
  process.env.LOCAL_LLM_MODEL ||
  process.env.NEXT_PUBLIC_LOCAL_LLM_MODEL ||
  'gpt-5.3-codex';

const PRIMARY_LLM_API_KEY =
  process.env.OPENROUTER_API_KEY ||
  process.env.OPENAI_API_KEY ||
  'not-needed';

const DEFAULT_FALLBACK_BASE_URL =
  process.env.LLM_FALLBACK_BASE_URL ||
  LOCAL_LLM_BASE_URL;

const DEFAULT_FALLBACK_MODELS = (
  process.env.LLM_FALLBACK_MODELS ||
  process.env.LLM_FALLBACK_MODEL ||
  process.env.LLM_MODEL_LIGHT ||
  'gpt-5.3-codex'
);

const DEFAULT_FALLBACK_API_KEY =
  process.env.LLM_FALLBACK_API_KEY ||
  PRIMARY_LLM_API_KEY;

const LLM_REQUEST_TIMEOUT_MS = Number.parseInt(
  process.env.LLM_REQUEST_TIMEOUT_MS || "12000",
  10,
);

const ENV_FALLBACK_ENABLED =
  process.env.LLM_FALLBACK_ENABLED === 'true' ||
  Boolean(process.env.LLM_FALLBACK_MODELS) ||
  Boolean(process.env.LLM_FALLBACK_MODEL);

function buildClient(baseURL: string, apiKey: string) {
  return new OpenAI({
    apiKey: apiKey || 'not-needed',
    baseURL,
    maxRetries: 0,
    timeout: Number.isFinite(LLM_REQUEST_TIMEOUT_MS) ? LLM_REQUEST_TIMEOUT_MS : 12000,
  });
}

export const localOpenAI = buildClient(LOCAL_LLM_BASE_URL, PRIMARY_LLM_API_KEY);

type ChatCompletionParams = Parameters<typeof localOpenAI.chat.completions.create>[0];

function isRetryableQuotaError(error: unknown): boolean {
  const maybeError = error as {
    status?: number;
    code?: string;
    message?: string;
    error?: { message?: string; code?: string };
  };
  const status = maybeError?.status;
  const code = `${maybeError?.code ?? maybeError?.error?.code ?? ''}`.toLowerCase();
  const message = `${maybeError?.message ?? maybeError?.error?.message ?? ''}`.toLowerCase();

  return (
    status === 429 ||
    code.includes('rate_limit') ||
    code.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('quota') ||
    message.includes('too many requests') ||
    message.includes('credits') ||
    message.includes('exhausted')
  );
}

function isRetryableProviderError(error: unknown): boolean {
  const maybeError = error as {
    status?: number;
    code?: string;
    message?: string;
    error?: { message?: string; code?: string };
  };
  const status = maybeError?.status;
  const code = `${maybeError?.code ?? maybeError?.error?.code ?? ''}`.toLowerCase();
  const message = `${maybeError?.message ?? maybeError?.error?.message ?? ''}`.toLowerCase();

  return (
    isRetryableQuotaError(error) ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    code.includes('connection') ||
    code.includes('timeout') ||
    code.includes('overloaded') ||
    message.includes('fetch failed') ||
    message.includes('connection error') ||
    message.includes('connection refused') ||
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('timed out') ||
    message.includes('temporarily unavailable') ||
    message.includes('overloaded') ||
    message.includes('server error')
  );
}

function splitModelList(rawModels: string): string[] {
  return rawModels
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean);
}

function getFallbackConfig(runtimeSettings?: ChatRuntimeLlmSettings) {
  if (!ENV_FALLBACK_ENABLED || !DEFAULT_FALLBACK_BASE_URL || !DEFAULT_FALLBACK_MODELS) {
    const runtimeFallback = buildRuntimeLlmSettingsPayload(runtimeSettings);
    if (runtimeFallback) {
      return {
        baseURL: runtimeFallback.fallbackBaseUrl,
        apiKey: runtimeFallback.fallbackApiKey || DEFAULT_FALLBACK_API_KEY,
        models: splitModelList(runtimeFallback.fallbackModel),
        source: 'runtime',
      };
    }
    return null;
  }

  return {
    baseURL: DEFAULT_FALLBACK_BASE_URL,
    apiKey: DEFAULT_FALLBACK_API_KEY,
    models: splitModelList(DEFAULT_FALLBACK_MODELS),
    source: 'env',
  };
}

export async function createChatCompletionWithFallback(
  params: ChatCompletionParams,
  runtimeSettings?: ChatRuntimeLlmSettings,
) {
  try {
    return await localOpenAI.chat.completions.create({
      ...params,
      model: params.model || LOCAL_LLM_MODEL,
    });
  } catch (error) {
    const fallback = getFallbackConfig(runtimeSettings);
    if (!fallback || fallback.models.length === 0 || !isRetryableProviderError(error)) {
      throw error;
    }

    const fallbackClient = buildClient(fallback.baseURL, fallback.apiKey);
    let lastError = error;

    for (const model of fallback.models) {
      try {
        console.warn(
          `[llm] Primary model hit quota/rate limit. Retrying with ${fallback.source} fallback model ${model}.`,
        );
        return await fallbackClient.chat.completions.create({
          ...params,
          model,
        });
      } catch (fallbackError) {
        lastError = fallbackError;
        if (!isRetryableProviderError(fallbackError)) {
          throw fallbackError;
        }
      }
    }

    throw lastError;
  }
}
