type MemorySearchResult = {
  id?: string;
  text?: string;
  content?: string;
  metadata?: Record<string, unknown>;
  score?: number;
};

type MemoryClient = {
  search: (query: string, options?: { user_id?: string; limit?: number }) => Promise<MemorySearchResult[]>;
  add: (payload: { user_id?: string; text: string; metadata?: Record<string, unknown> }) => Promise<unknown>;
};

const DEFAULT_MEM0_URL = process.env.MEM0_URL || "http://localhost:8888";

async function httpPost<T>(path: string, body: unknown): Promise<T> {
  const url = `${DEFAULT_MEM0_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Mem0 service error ${resp.status}: ${text}`);
  }
  return (await resp.json()) as T;
}

const memoryClient: MemoryClient = {
  async search(query, options) {
    try {
      const result = await httpPost<MemorySearchResult[]>("/search", {
        query,
        user_id: options?.user_id,
        limit: options?.limit ?? 5,
      });
      return result;
    } catch (error) {
      console.warn("[memory] search failed", error);
      return [];
    }
  },
  async add(payload) {
    try {
      await httpPost("/memories", {
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
