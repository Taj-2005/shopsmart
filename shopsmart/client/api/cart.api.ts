"use client";

import { apiClient } from "./axios";

export type ApiCartItem = {
  id: string;
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    inStock: boolean;
    stockQty: number;
  };
};

export type ApiCart = {
  id: string | null;
  items: ApiCartItem[];
};

export type ApiResponse<T> = { success: boolean; data: T };

export const cartApi = {
  get: () =>
    apiClient.get<ApiResponse<ApiCart>>("/api/cart").then((r) => r.data),

  add: (productId: string, quantity = 1) =>
    apiClient.post<ApiResponse<ApiCart>>("/api/cart", { productId, quantity }).then((r) => r.data),

  updateItem: (itemId: string, quantity: number) =>
    apiClient.patch<ApiResponse<unknown>>(`/api/cart/item/${itemId}`, { quantity }).then((r) => r.data),

  removeItem: (itemId: string) =>
    apiClient.delete<ApiResponse<{ message: string }>>(`/api/cart/item/${itemId}`).then((r) => r.data),
};
