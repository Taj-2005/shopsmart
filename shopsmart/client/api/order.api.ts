"use client";

import { apiClient } from "./axios";

export type ApiOrderItem = {
  id: string;
  productId: string;
  product?: { id: string; name: string; image?: string };
  quantity: number;
  price: number;
};

export type ApiOrder = {
  id: string;
  userId: string;
  status: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  addressId?: string;
  items: ApiOrderItem[];
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = { success: boolean; data: T };

export const orderApi = {
  create: (data: { addressId?: string; items: { productId: string; quantity: number }[] }) =>
    apiClient.post<ApiResponse<ApiOrder>>("/api/orders", data).then((r) => r.data),

  list: () =>
    apiClient.get<ApiResponse<ApiOrder[]>>("/api/orders").then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<ApiOrder>>(`/api/orders/${id}`).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch<ApiResponse<ApiOrder>>(`/api/orders/${id}/status`, { status }).then((r) => r.data),
};
