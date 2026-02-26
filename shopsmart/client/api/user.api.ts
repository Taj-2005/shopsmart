"use client";

import { apiClient } from "./axios";

export type ApiUser = {
  id: string;
  email: string;
  fullName: string;
  role: { name: string } | string;
  avatarUrl?: string;
  active?: boolean;
  createdAt: string;
};

export type ApiResponse<T> = { success: boolean; data: T };

export const userApi = {
  list: () =>
    apiClient.get<ApiResponse<ApiUser[]>>("/api/users").then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<ApiUser>>(`/api/users/${id}`).then((r) => r.data),

  update: (id: string, data: { fullName?: string; avatarUrl?: string }) =>
    apiClient.patch<ApiResponse<ApiUser>>(`/api/users/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<{ message: string }>>(`/api/users/${id}`).then((r) => r.data),

  getOrders: (id: string) =>
    apiClient.get<ApiResponse<unknown[]>>(`/api/users/${id}/orders`).then((r) => r.data),

  getCart: (id: string) =>
    apiClient.get<ApiResponse<unknown>>(`/api/users/${id}/cart`).then((r) => r.data),

  updateRole: (id: string, role: "ADMIN" | "CUSTOMER") =>
    apiClient.patch<ApiResponse<ApiUser>>(`/api/super-admin/users/${id}/role`, { role }).then((r) => r.data),
};
