"use client";

import { useState, useEffect } from "react";
import { superAdminApi } from "@/api/super-admin.api";

function StatCard({ title, value, format = (v: number) => String(v) }: { title: string; value: number; format?: (v: number) => string }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-1 font-heading text-2xl font-bold text-primary">{format(value)}</p>
    </div>
  );
}

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState<{
    users: number;
    products: number;
    orders: number;
    revenue: number;
    byStatus: { status: string; _count: number }[];
    recentOrders: unknown[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    superAdminApi
      .getAnalytics()
      .then((res) => res.success && res.data && setData(res.data))
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-error)] bg-[var(--color-error)]/10 p-6 text-[var(--color-error)]">
        {error ?? "No data"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">Full analytics</h1>
        <p className="mt-1 text-muted-foreground">System-wide data. Super Admin only.</p>
      </div>
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Key metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total revenue" value={data.revenue} format={(v) => `₹${v.toLocaleString("en-IN")}`} />
          <StatCard title="Orders" value={data.orders} />
          <StatCard title="Users" value={data.users} />
          <StatCard title="Products" value={data.products} />
        </div>
      </section>
      {data.byStatus && data.byStatus.length > 0 && (
        <section>
          <h2 className="font-heading text-lg font-semibold text-primary">Orders by status</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {data.byStatus.map((s) => (
              <li key={s.status}>{s.status}: {s._count}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
