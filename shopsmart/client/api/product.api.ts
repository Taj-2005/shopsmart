"use client";

import { apiClient } from "./axios";

export type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  images?: unknown;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
  inStock: boolean;
  stockQty: number;
  active: boolean;
  isNew: boolean;
  isDeal: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiResponse<T> = { success: boolean; data: T };

export const productApi = {
  list: () => apiClient.get<ApiResponse<ApiProduct[]>>("/api/products").then((r) => r.data),
  getById: (id: string) => apiClient.get<ApiResponse<ApiProduct>>(`/api/products/${id}`).then((r) => r.data),
  getReviews: (id: string) =>
    apiClient.get<ApiResponse<Array<{ id: string; rating: number; body?: string; user: { fullName: string }; createdAt: string }>>>(`/api/products/${id}/reviews`).then((r) => r.data),
  create: (data: Partial<ApiProduct> & { name: string; price: number; categoryId: string }) =>
    apiClient.post<ApiResponse<ApiProduct>>("/api/products", data).then((r) => r.data),
  update: (id: string, data: Partial<ApiProduct>) =>
    apiClient.patch<ApiResponse<ApiProduct>>(`/api/products/${id}`, data).then((r) => r.data),
  delete: (id: string) =>
    apiClient.delete<ApiResponse<{ message: string }>>(`/api/products/${id}`).then((r) => r.data),
  getAnalytics: (id: string) =>
    apiClient.get<ApiResponse<{ unitsSold: number; orderCount: number; avgRating: number | null; reviewCount: number }>>(`/api/products/${id}/analytics`).then((r) => r.data),
};
