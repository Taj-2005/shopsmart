"use client";

/**
 * Cookie-based auth: tokens are in httpOnly cookies set by the backend.
 * No token storage in frontend. This module only provides 401 callback for redirect.
 */

type OnUnauthorized = () => void;
let onUnauthorized: OnUnauthorized | null = null;

export function setOnUnauthorized(cb: OnUnauthorized | null): void {
  onUnauthorized = cb;
}

export function triggerUnauthorized(): void {
  onUnauthorized?.();
}
