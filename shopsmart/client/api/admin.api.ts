"use client";

import { apiClient } from "./axios";

export type DashboardData = {
  users: number;
  products: number;
  orders: number;
  revenue: number;
};

export type ApiResponse<T> = { success: boolean; data: T };

export const adminApi = {
  getDashboard: () =>
    apiClient.get<ApiResponse<DashboardData>>("/api/admin/dashboard").then((r) => r.data),

  getRevenue: () =>
    apiClient.get<ApiResponse<{ total: number }>>("/api/admin/revenue").then((r) => r.data),

  getUsersStats: () =>
    apiClient.get<ApiResponse<{ total: number; byRole: { roleId: string; roleName: string; count: number }[] }>>("/api/admin/users/stats").then((r) => r.data),

  getProductsStats: () =>
    apiClient.get<ApiResponse<{ total: number; active: number }>>("/api/admin/products/stats").then((r) => r.data),

  getOrdersStats: () =>
    apiClient.get<ApiResponse<{ status: string; _count: number }[]>>("/api/admin/orders/stats").then((r) => r.data),

  createAdmin: (data: { email: string; password: string; fullName?: string }) =>
    apiClient.post<ApiResponse<{ id: string; email: string; fullName: string; role: unknown }>>("/api/admin/create-admin", data).then((r) => r.data),

  getLogs: (limit?: number) =>
    apiClient.get<ApiResponse<unknown[]>>("/api/admin/logs", { params: { limit } }).then((r) => r.data),
};
