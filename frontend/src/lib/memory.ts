/**
 * Memory client — proxies Mem0 search/add through the backend API.
 *
 * Previously called the standalone Mem0 service directly over HTTP.
 * Now routes through the backend which uses mem0 SDK locally.
 */

type MemorySearchResult = {
  id?: string;
  text?: string;
  content?: string;
  memory?: string;
  metadata?: Record<string, unknown>;
  score?: number;
};

type MemoryClient = {
  search: (query: string, options?: { user_id?: string; limit?: number }) => Promise<MemorySearchResult[]>;
  add: (payload: { user_id?: string; text: string; metadata?: Record<string, unknown> }) => Promise<unknown>;
};

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

async function backendPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Backend memory API error ${resp.status}: ${text}`);
  }
  return (await resp.json()) as T;
}

const memoryClient: MemoryClient = {
  async search(query, options) {
    try {
      const result = await backendPost<{ results?: MemorySearchResult[] } | MemorySearchResult[]>(
        "/memories/search",
        {
          query,
          user_id: options?.user_id,
          limit: options?.limit ?? 5,
        },
      );
      const rawList = Array.isArray(result) ? result : result?.results ?? [];
      return rawList.map((item) => ({
        ...item,
        text: item.text ?? item.memory ?? item.content,
      }));
    } catch (error) {
      console.warn("[memory] search failed", error);
      return [];
    }
  },
  async add(payload) {
    try {
      await backendPost("/memories/add", {
        user_id: payload.user_id,
        metadata: payload.metadata,
        messages: [
          {
            role: "user",
            content: payload.text,
          },
        ],
      });
    } catch (error) {
      console.warn("[memory] add failed", error);
    }
  },
};

export async function getMemory(): Promise<MemoryClient> {
  return memoryClient;
}

export type { MemoryClient, MemorySearchResult };
