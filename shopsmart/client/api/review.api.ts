"use client";

import { apiClient } from "./axios";

export type ApiResponse<T> = { success: boolean; data: T };

export const reviewApi = {
  updateStatus: (id: string, status: "pending" | "approved" | "rejected" | "flagged") =>
    apiClient.patch<ApiResponse<unknown>>(`/api/reviews/${id}/status`, { status }).then((r) => r.data),
};
