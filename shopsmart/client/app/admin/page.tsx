"use client";

import { useMemo, useState, useEffect } from "react";
import { adminApi } from "@/api/admin.api";

function StatCard({
  title,
  value,
  subtitle,
  format = (v: number) => String(v),
}: {
  title: string;
  value: number;
  subtitle?: string;
  format?: (v: number) => string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-1 font-heading text-2xl font-bold text-primary">{format(value)}</p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<{ users: number; products: number; orders: number; revenue: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then((res) => res.success && res.data && setData(res.data))
      .catch(() => setError("Failed to load dashboard"))
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
        <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your store performance.
        </p>
      </div>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Key metrics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={data.revenue}
            format={(v) => `₹${v.toLocaleString("en-IN")}`}
          />
          <StatCard title="Total Orders" value={data.orders} />
          <StatCard title="Active Users" value={data.users} />
          <StatCard title="Products" value={data.products} />
        </div>
      </section>
    </div>
  );
}
