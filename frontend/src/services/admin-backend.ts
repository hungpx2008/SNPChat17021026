import { backendRequest } from "./chat-backend";

type RequestInitLite = RequestInit & {
  query?: Record<string, string | number | undefined>;
};

async function request<T>(path: string, options: RequestInitLite = {}): Promise<T> {
  const { query, ...rest } = options;
  return backendRequest<T>(path, rest, query);
}

export interface AdminSessionSummary {
  id: string;
  user_id: string | null;
  department: string | null;
  title: string | null;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface AdminRedisEntry {
  key: string;
  session_id: string;
  ttl_seconds: number | null;
  message_count: number;
  size_bytes: number;
}

export interface AdminRedisResponse {
  entries: AdminRedisEntry[];
}

export interface AdminQdrantCollection {
  name: string;
  vectors_count: number;
  status: string;
}

export interface AdminQdrantPoint {
  id: string;
  payload?: Record<string, unknown> | null;
}

export const adminBackend = {
  async listSessions(limit = 100, userId?: string | null): Promise<AdminSessionSummary[]> {
    return request<AdminSessionSummary[]>("/admin/sessions", {
      query: { limit, user_id: userId ?? undefined },
    });
  },

  async getSessionMessages(sessionId: string) {
    return request(`/admin/sessions/${sessionId}/messages`);
  },

  async listRedisCache(sessionId?: string | null): Promise<AdminRedisResponse> {
    return request<AdminRedisResponse>("/admin/redis/cache", {
      query: { session_id: sessionId ?? undefined },
    });
  },

  async deleteRedisCache(sessionId: string) {
    return request<{ deleted: boolean }>(`/admin/redis/cache/${sessionId}`, {
      method: "DELETE",
    });
  },

  async listCollections(): Promise<AdminQdrantCollection[]> {
    return request<AdminQdrantCollection[]>("/admin/qdrant/collections");
  },

  async listCollectionPoints(collection: string, limit = 10): Promise<AdminQdrantPoint[]> {
    return request<AdminQdrantPoint[]>(`/admin/qdrant/collections/${collection}/points`, {
      query: { limit },
    });
  },
};
