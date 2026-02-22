import { createHash } from "crypto";

export interface StoredUser {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

/** Generate a deterministic UUID from email so user_id is stable across restarts */
function emailToUUID(email: string): string {
  const hash = createHash("sha256").update(email.toLowerCase()).digest("hex");
  // Format as UUID v4: 8-4-4-4-12
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    "4" + hash.slice(13, 16),   // version 4
    "8" + hash.slice(17, 20),   // variant
    hash.slice(20, 32),
  ].join("-");
}

class MockAuthStore {
  private users = new Map<string, StoredUser>();

  constructor() {
    const defaultEmail = "demo@chatsnp.local";
    const normalized = defaultEmail.toLowerCase();
    if (!this.users.has(normalized)) {
      const user: StoredUser = {
        id: emailToUUID(normalized),
        email: defaultEmail,
        password: "password123",
        createdAt: new Date().toISOString(),
      };
      this.users.set(normalized, user);
    }
  }

  login(email: string, password: string): StoredUser {
    const normalizedEmail = email.toLowerCase();
    let user = this.users.get(normalizedEmail);
    if (!user) {
      // Dev mode: auto-register on first login (deterministic ID)
      user = {
        id: emailToUUID(normalizedEmail),
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
      };
      this.users.set(normalizedEmail, user);
    }
    return user;
  }

  signup(email: string, password: string): StoredUser {
    const normalizedEmail = email.toLowerCase();
    if (this.users.has(normalizedEmail)) {
      throw new Error("User already exists");
    }
    const user: StoredUser = {
      id: emailToUUID(normalizedEmail),
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    };
    this.users.set(normalizedEmail, user);
    return user;
  }

  requestPasswordReset(email: string): void {
    const normalizedEmail = email.toLowerCase();
    if (!this.users.has(normalizedEmail)) {
      throw new Error("Account not found");
    }
  }
}

export const mockAuthStore = new MockAuthStore();
