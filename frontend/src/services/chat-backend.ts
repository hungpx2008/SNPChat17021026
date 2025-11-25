const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000';

async function request<T>(
  path: string,
  options: RequestInit = {},
  query?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
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

export interface SearchResult {
  text: string;
  score: number;
  metadata: Record<string, any>;
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

  async fetchSession(sessionId: string): Promise<BackendSessionWithMessages> {
    return request<BackendSessionWithMessages>(`/sessions/${sessionId}`);
  },

  async appendMessage(
    sessionId: string,
    payload: { role: 'user' | 'assistant' | 'system'; content: string; metadata?: any },
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
};

export { request as backendRequest };
