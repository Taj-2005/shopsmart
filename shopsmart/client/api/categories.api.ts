"use client";

import { apiClient } from "./axios";

export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = { success: boolean; data: T };

export const categoriesApi = {
  list: () =>
    apiClient.get<ApiResponse<ApiCategory[]>>("/api/categories").then((r) => r.data),
};
