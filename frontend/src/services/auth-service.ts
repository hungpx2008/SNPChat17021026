export interface AuthUser {
  id: string;
  email: string;
}

interface AuthResponse {
  user: AuthUser;
  message?: string;
}

const AUTH_API_BASE = "/api/auth";

async function postJson<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${AUTH_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = (data && data.message) || "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export function login(payload: { email: string; password: string }) {
  return postJson<AuthResponse>("/login", payload);
}

export function signup(payload: { email: string; password: string }) {
  return postJson<AuthResponse>("/signup", payload);
}

export function forgotPassword(payload: { email: string }) {
  return postJson<{ message: string }>("/reset", payload);
}
