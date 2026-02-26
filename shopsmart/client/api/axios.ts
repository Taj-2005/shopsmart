"use client";

import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { triggerUnauthorized } from "@/lib/auth-token";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

type RefreshResponse = { success: boolean; user?: { id: string; email: string; fullName: string; role: string; avatarUrl?: string; createdAt: string } };

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = apiClient
    .post<RefreshResponse>("/api/auth/refresh", {}, { withCredentials: true })
    .then((res) => res.data?.success === true)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (err.response?.status !== 401 || original._retry) {
      if (err.response?.status === 401) triggerUnauthorized();
      return Promise.reject(err);
    }
    original._retry = true;
    const refreshed = await tryRefresh();
    if (refreshed) return apiClient(original);
    triggerUnauthorized();
    return Promise.reject(err);
  }
);

export type ApiError = {
  status: number;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
};

export function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; code?: string; errors?: Record<string, string[]> } | undefined;
    return {
      status: err.response?.status ?? 500,
      message: data?.message ?? err.message ?? "Request failed",
      code: data?.code,
      errors: data?.errors,
    };
  }
  return { status: 500, message: "Request failed" };
}
