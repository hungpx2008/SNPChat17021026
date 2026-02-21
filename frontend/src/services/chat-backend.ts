const API_BASE_URL = (
  (typeof window === 'undefined' ? process.env.BACKEND_INTERNAL_URL : undefined) ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  ''
).replace(/\/$/, '');

const isAbsoluteBackendUrl = /^https?:\/\//i.test(API_BASE_URL);

function buildRequestUrl(
  path: string,
  query?: Record<string, string | number | undefined>,
): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const queryParams = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.set(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString();

  if (isAbsoluteBackendUrl) {
    const url = new URL(`${API_BASE_URL || ''}${normalizedPath}`);
    if (queryString) {
      url.search = queryString;
    }
    return url.toString();
  }

  const base = API_BASE_URL || '';
  const url = `${base}${normalizedPath}${queryString ? `?${queryString}` : ''}`;
  return url || normalizedPath;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  query?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = buildRequestUrl(path, query);
  const hasBody = typeof options?.body !== 'undefined';
  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    let errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      // Handle nested error structure from backend (e.g. { status: { error: "..." } })
      if (errorJson.status?.error) {
        errorText = errorJson.status.error;
      } else if (errorJson.detail) {
        errorText = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
      }
    } catch {
      // ignore JSON parse error, use raw text
    }
    throw new Error(
      `Backend request failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }
  if (response.status === 204) {
    return null as T;
  }
  return (await response.json()) as T;
}

export interface BackendSession {
  id: string;
  user_id: string | null;
  department: string | null;
  title: string | null;
  metadata?: Record<string, unknown>;  // includes summary, message_count_at_summary
  created_at: string;
  updated_at: string;
}

export interface BackendMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface BackendSessionWithMessages extends BackendSession {
  messages: BackendMessage[];
}

type FetchSessionOptions = {
  limit?: number;
};

export interface SearchResult {
  text: string;
  score: number;
  source: string;
  metadata: Record<string, any>;
}

export interface DocumentInfo {
  id: string;
  filename: string;
  status: 'processing' | 'awaiting_choice' | 'ready' | 'error';
  chunk_count: number;
  extractor_used: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  type: 'chart' | 'audio' | 'document';
  url: string;
  filename?: string;
}

export const chatBackend = {
  async listSessions(userId: string): Promise<BackendSession[]> {
    return request<BackendSession[]>('/sessions', undefined, { user_id: userId });
  },

  async createSession(payload: {
    user_id: string | null;
    department: string | null;
    title?: string | null;
    external_id?: string | null;
  }): Promise<BackendSession> {
    return request<BackendSession>('/sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async fetchSession(
    sessionId: string,
    options?: FetchSessionOptions,
  ): Promise<BackendSessionWithMessages> {
    const query = options?.limit !== undefined ? { limit: options.limit } : undefined;
    return request<BackendSessionWithMessages>(`/sessions/${sessionId}`, undefined, query);
  },

  async appendMessage(
    sessionId: string,
    payload: { role: 'user' | 'assistant' | 'system'; content: string; metadata?: any; mode?: 'chat' | 'sql' | 'rag' },
  ): Promise<BackendMessage> {
    return request<BackendMessage>(`/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async semanticSearch(payload: {
    user_id?: string | null;
    department?: string | null;
    query: string;
    limit?: number;
  }): Promise<SearchResult[]> {
    return request<SearchResult[]>('/sessions/search', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ----- Document Upload APIs -----

  async uploadDocument(
    file: File,
    userId: string,
    forceDeepScan: boolean = false,
    overwrite: boolean = false,
  ): Promise<{ document_id: string; filename: string; status: string; message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    formData.append('force_deep_scan', String(forceDeepScan));
    if (overwrite) {
      formData.append('overwrite', 'true');
    }

    const url = buildRequestUrl('/upload');
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }
    return response.json();
  },

  async listDocuments(userId: string): Promise<DocumentInfo[]> {
    return request<DocumentInfo[]>('/upload', undefined, { user_id: userId });
  },

  async getDocumentStatus(documentId: string): Promise<DocumentInfo> {
    return request<DocumentInfo>(`/upload/${documentId}/status`);
  },

  async cancelDocument(documentId: string): Promise<{ status: string; message: string }> {
    return request<{ status: string; message: string }>(`/upload/${documentId}/cancel`, {
      method: 'DELETE',
    });
  },

  async chooseDocumentEngine(
    documentId: string,
    engine: 'kreuzberg' | 'docling',
  ): Promise<{ status: string; engine: string; document_id: string; message: string }> {
    return request<{ status: string; engine: string; document_id: string; message: string }>(
      `/upload/${documentId}/process`,
      { method: 'POST' },
      { engine },
    );
  },

  // ----- Feedback API -----

  async submitFeedback(
    messageId: string,
    isLiked: boolean,
    reason?: string,
  ): Promise<{ id: string; message: string }> {
    return request<{ id: string; message: string }>('/feedback', {
      method: 'POST',
      body: JSON.stringify({
        message_id: messageId,
        is_liked: isLiked,
        reason: reason || undefined,
      }),
    });
  },
};

export { request as backendRequest };
