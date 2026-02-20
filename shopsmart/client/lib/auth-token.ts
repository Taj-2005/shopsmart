"use client";

/**
 * In-memory access token store. Used by axios interceptor.
 * No localStorage — refresh token is HttpOnly cookie only.
 */

let accessToken: string | null = null;
let expiresAt: number | null = null;

export function setAccessToken(token: string, expiresInSeconds: number): void {
  accessToken = token;
  expiresAt = Date.now() + expiresInSeconds * 1000;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function getExpiresAt(): number | null {
  return expiresAt;
}

export function isAccessTokenExpired(): boolean {
  if (!expiresAt) return true;
  return Date.now() >= expiresAt - 60 * 1000; // 1 min buffer
}

export function clearAccessToken(): void {
  accessToken = null;
  expiresAt = null;
}

type OnUnauthorized = () => void;
let onUnauthorized: OnUnauthorized | null = null;

export function setOnUnauthorized(cb: OnUnauthorized | null): void {
  onUnauthorized = cb;
}

export function triggerUnauthorized(): void {
  onUnauthorized?.();
}
