"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types/auth";
import * as storage from "@/lib/auth-storage";
import { api, type ApiError } from "@/lib/api";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
};

type AuthContextValue = AuthState & {
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (fullName: string, email: string, password: string, role?: "customer" | "admin_request") => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  error: string | null;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function storedUserToUser(s: storage.StoredUser | null): User | null {
  if (!s) return null;
  return {
    id: s.id,
    email: s.email,
    fullName: s.fullName,
    role: s.role as User["role"],
    avatarUrl: s.avatarUrl,
    createdAt: s.createdAt,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
  }, []);

  const refreshUser = useCallback(async () => {
    const stored = storage.getStoredUser();
    setUserState(storedUserToUser(stored));
    if (!stored?.id) return;
    if (storage.isTokenExpired()) {
      const refreshToken = storage.getRefreshToken();
      if (!refreshToken) {
        storage.clearAuth();
        setUserState(null);
        return;
      }
      try {
        const data = await api.post<{ accessToken: string; expiresIn: number; user: storage.StoredUser }>(
          "/api/auth/refresh",
          { refreshToken },
          true
        );
        storage.setTokens(data.accessToken, refreshToken, data.expiresIn, data.user);
        setUserState(storedUserToUser(data.user));
      } catch {
        storage.clearAuth();
        setUserState(null);
      }
    }
  }, []);

  useEffect(() => {
    const stored = storage.getStoredUser();
    setUserState(storedUserToUser(stored));
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    const stored = storage.getStoredUser();
    if (!stored?.id) return;
    if (!storage.isTokenExpired()) return;
    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) {
      storage.clearAuth();
      setUserState(null);
      return;
    }
    api
      .post<{ accessToken: string; expiresIn: number; user: storage.StoredUser }>(
        "/api/auth/refresh",
        { refreshToken },
        true
      )
      .then((data) => {
        storage.setTokens(data.accessToken, refreshToken, data.expiresIn, data.user);
        setUserState(storedUserToUser(data.user));
      })
      .catch(() => {
        storage.clearAuth();
        setUserState(null);
      });
  }, [isInitialized]);

  const login = useCallback(
    async (email: string, password: string, remember?: boolean) => {
      setError(null);
      setIsLoading(true);
      try {
        const data = await api.post<{
          accessToken: string;
          refreshToken: string;
          expiresIn: number;
          user: storage.StoredUser;
        }>("/api/auth/login", { email, password, remember }, true);
        storage.setTokens(data.accessToken, data.refreshToken, data.expiresIn, data.user);
        setUserState(storedUserToUser(data.user));
      } catch (e) {
        const err = e as ApiError;
        setError(err.message ?? "Login failed");
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      role?: "customer" | "admin_request"
    ) => {
      setError(null);
      setIsLoading(true);
      try {
        const data = await api.post<{
          accessToken: string;
          refreshToken: string;
          expiresIn: number;
          user: storage.StoredUser;
        }>("/api/auth/register", { fullName, email, password, role }, true);
        storage.setTokens(data.accessToken, data.refreshToken, data.expiresIn, data.user);
        setUserState(storedUserToUser(data.user));
      } catch (e) {
        const err = e as ApiError;
        setError(err.message ?? "Registration failed");
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    storage.clearAuth();
    setUserState(null);
    setError(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email }, true);
    } catch (e) {
      const err = e as ApiError;
      setError(err.message ?? "Request failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await api.post("/api/auth/reset-password", { token, newPassword }, true);
    } catch (e) {
      const err = e as ApiError;
      setError(err.message ?? "Reset failed");
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      isInitialized,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      refreshUser,
      setUser,
      error,
      clearError,
    }),
    [
      user,
      isLoading,
      isInitialized,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      refreshUser,
      setUser,
      error,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useIsAdmin(): boolean {
  const { user } = useAuth();
  return user?.role === "admin" || user?.role === "super_admin";
}

export function useIsSuperAdmin(): boolean {
  const { user } = useAuth();
  return user?.role === "super_admin";
}
