"use client";

/**
 * Token storage: access token in memory is ideal; for persistence we use
 * localStorage with clear-on-logout. Refresh token in localStorage for
 * "remember me" flow. Keys prefixed to avoid collisions.
 */

const PREFIX = "shopsmart";
const ACCESS_KEY = `${PREFIX}_access_token`;
const REFRESH_KEY = `${PREFIX}_refresh_token`;
const USER_KEY = `${PREFIX}_user`;
const EXPIRES_AT_KEY = `${PREFIX}_expires_at`;

export type StoredUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  createdAt: string;
};

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function getExpiresAt(): number | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(EXPIRES_AT_KEY);
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

export function setTokens(
  accessToken: string,
  refreshToken: string,
  expiresInSeconds: number,
  user: StoredUser
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  const expiresAt = Date.now() + expiresInSeconds * 1000;
  localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}

export function isTokenExpired(): boolean {
  const at = getExpiresAt();
  if (!at) return true;
  return Date.now() >= at - 60 * 1000; // 1 min buffer
}
