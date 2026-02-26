"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/api/axios";

type SalesRow = { status: string; count: number; total: number };
type RevenueData = { revenue: number; refunded: number };

export default function AdminReportsPage() {
  const [sales, setSales] = useState<SalesRow[]>([]);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiClient.get<{ success: boolean; data: SalesRow[] }>("/api/admin/reports/sales"),
      apiClient.get<{ success: boolean; data: RevenueData }>("/api/admin/reports/revenue"),
    ])
      .then(([sRes, rRes]) => {
        if (sRes.data.success && sRes.data.data) setSales(sRes.data.data);
        if (rRes.data.success && rRes.data.data) setRevenue(rRes.data.data);
      })
      .catch(() => setError("Failed to load reports"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
      </div>
    );
  }

  if (error) {
    return <p className="text-[var(--color-error)]">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">Reports</h1>
      <p className="text-muted-foreground">Sales and revenue overview.</p>

      {revenue && (
        <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
          <h2 className="font-heading text-lg font-semibold text-primary">Revenue</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Delivered orders total</p>
              <p className="font-heading text-xl font-bold text-primary">₹{revenue.revenue.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Refunded</p>
              <p className="font-heading text-xl font-bold text-primary">₹{revenue.refunded.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
        <h2 className="font-heading text-lg font-semibold text-primary">Sales by status</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 font-semibold text-primary">Status</th>
                <th className="pb-2 font-semibold text-primary">Count</th>
                <th className="pb-2 font-semibold text-primary">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((row) => (
                <tr key={row.status} className="border-b border-border last:border-0">
                  <td className="py-2 capitalize text-primary">{row.status.toLowerCase()}</td>
                  <td className="py-2 text-muted-foreground">{row.count}</td>
                  <td className="py-2 text-primary">₹{row.total.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
