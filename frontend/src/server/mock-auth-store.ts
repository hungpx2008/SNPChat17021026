import { randomUUID } from "crypto";

export interface StoredUser {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

class MockAuthStore {
  private users = new Map<string, StoredUser>();

  constructor() {
    const defaultEmail = "demo@chatsnp.local";
    const normalized = defaultEmail.toLowerCase();
    if (!this.users.has(normalized)) {
      const user: StoredUser = {
        id: randomUUID(),
        email: defaultEmail,
        password: "password123",
        createdAt: new Date().toISOString(),
      };
      this.users.set(normalized, user);
    }
  }

  login(email: string, password: string): StoredUser {
    const normalizedEmail = email.toLowerCase();
    const user = this.users.get(normalizedEmail);
    if (!user || user.password !== password) {
      throw new Error("Invalid credentials");
    }
    return user;
  }

  signup(email: string, password: string): StoredUser {
    const normalizedEmail = email.toLowerCase();
    if (this.users.has(normalizedEmail)) {
      throw new Error("User already exists");
    }
    const user: StoredUser = {
      id: randomUUID(),
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
