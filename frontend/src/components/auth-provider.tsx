"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LoaderCircle } from "lucide-react";
import * as authService from "@/services/auth-service";
import type { AuthUser as ServiceAuthUser } from "@/services/auth-service";

export interface AuthUser extends ServiceAuthUser {
  department?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (payload: { email: string; password: string; department?: string }) => Promise<AuthUser>;
  signup: (payload: { email: string; password: string }) => Promise<AuthUser>;
  logout: () => void;
  sendPasswordReset: (email: string) => Promise<void>;
}

const STORAGE_KEY = "chatsnp-auth-user";

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => Promise.reject(),
  signup: async () => Promise.reject(),
  logout: () => undefined,
  sendPasswordReset: async () => Promise.reject(),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persistUser = useCallback((value: AuthUser | null) => {
    if (typeof window === "undefined") {
      return;
    }
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = useCallback<AuthContextValue["login"]>(
    async ({ email, password, department }) => {
      const response = await authService.login({ email, password });
      const nextUser = { ...response.user, department };
      setUser(nextUser);
      persistUser(nextUser);
      return nextUser;
    },
    [persistUser],
  );

  const signup = useCallback<AuthContextValue["signup"]>(
    async ({ email, password }) => {
      const response = await authService.signup({ email, password });
      setUser(response.user);
      persistUser(response.user);
      return response.user;
    },
    [persistUser],
  );

  const logout = useCallback(() => {
    setUser(null);
    persistUser(null);
  }, [persistUser]);

  const sendPasswordReset = useCallback<AuthContextValue["sendPasswordReset"]>(
    async (email: string) => {
      await authService.forgotPassword({ email });
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      sendPasswordReset,
    }),
    [login, logout, sendPasswordReset, signup, user, loading],
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
