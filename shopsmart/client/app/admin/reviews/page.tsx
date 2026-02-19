"use client";

import { useState } from "react";

const MOCK_REVIEWS = [
  { id: "1", productName: "Wireless Headphones", author: "Priya M.", rating: 5, text: "Great sound quality.", status: "approved" },
  { id: "2", productName: "Running Shoes", author: "Rahul K.", rating: 4, text: "Comfortable but sizing runs small.", status: "pending" },
  { id: "3", productName: "Table Lamp", author: "Anita S.", rating: 5, text: "Looks premium.", status: "approved" },
  { id: "4", productName: "Smart Watch", author: "User X", rating: 2, text: "Not as described.", status: "flagged" },
];

export default function AdminReviewsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? MOCK_REVIEWS
      : MOCK_REVIEWS.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">
          Ratings & Reviews
        </h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm text-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="flagged">Flagged</option>
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="rounded-[var(--radius-lg)] border border-border bg-surface p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-primary">{r.productName}</p>
                <p className="text-sm text-muted-foreground">
                  {r.author} · {r.rating} ★
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                  r.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : r.status === "flagged"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                }`}
              >
                {r.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-primary">{r.text}</p>
            <div className="mt-3 flex gap-2">
              {r.status === "pending" && (
                <>
                  <button
                    type="button"
                    className="rounded-[var(--radius-sm)] bg-accent px-3 py-1.5 text-xs font-medium text-on-accent hover:bg-accent/90"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="rounded-[var(--radius-sm)] border border-border px-3 py-1.5 text-xs font-medium text-primary hover:bg-muted"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
