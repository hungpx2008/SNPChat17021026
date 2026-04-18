export interface ChatRuntimeLlmSettings {
  fallbackEnabled: boolean;
  fallbackBaseUrl: string;
  fallbackApiKey: string;
  fallbackModel: string;
}

export const DEFAULT_CHAT_RUNTIME_LLM_SETTINGS: ChatRuntimeLlmSettings = {
  fallbackEnabled: false,
  fallbackBaseUrl: "",
  fallbackApiKey: "",
  fallbackModel: "",
};

export function normalizeChatRuntimeLlmSettings(
  value?: Partial<ChatRuntimeLlmSettings> | null,
): ChatRuntimeLlmSettings {
  return {
    fallbackEnabled: Boolean(value?.fallbackEnabled),
    fallbackBaseUrl: value?.fallbackBaseUrl?.trim() ?? "",
    fallbackApiKey: value?.fallbackApiKey?.trim() ?? "",
    fallbackModel: value?.fallbackModel?.trim() ?? "",
  };
}

export function buildRuntimeLlmSettingsPayload(
  value?: Partial<ChatRuntimeLlmSettings> | null,
): ChatRuntimeLlmSettings | undefined {
  const normalized = normalizeChatRuntimeLlmSettings(value);
  if (!normalized.fallbackEnabled) {
    return undefined;
  }
  if (!normalized.fallbackBaseUrl || !normalized.fallbackModel) {
    return undefined;
  }
  return normalized;
}
