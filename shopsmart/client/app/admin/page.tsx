"use client";

import { useMemo } from "react";
import {
  DASHBOARD_STATS,
  REVENUE_DATA,
  ORDERS_BY_DAY,
  CATEGORY_DISTRIBUTION,
  TOP_PRODUCTS,
  FUNNEL_DATA,
} from "@/data/admin-mock";

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
  const maxOrders = useMemo(() => Math.max(...ORDERS_BY_DAY.map((d) => d.orders)), []);
  const maxRev = useMemo(() => Math.max(...REVENUE_DATA.map((d) => d.value)), []);

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="Total Revenue"
            value={DASHBOARD_STATS.totalRevenue}
            format={(v) => `₹${(v / 100000).toFixed(1)}L`}
          />
          <StatCard title="Total Orders" value={DASHBOARD_STATS.totalOrders} />
          <StatCard title="Active Users" value={DASHBOARD_STATS.activeUsers} />
          <StatCard
            title="Conversion Rate"
            value={DASHBOARD_STATS.conversionRate}
            subtitle="%"
            format={(v) => `${v}%`}
          />
          <StatCard
            title="Avg Order Value"
            value={DASHBOARD_STATS.avgOrderValue}
            format={(v) => `₹${v}`}
          />
          <StatCard
            title="Returning %"
            value={DASHBOARD_STATS.returningCustomerRate}
            format={(v) => `${v}%`}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section
          className="rounded-[var(--radius-lg)] border border-border bg-surface p-5"
          aria-labelledby="revenue-heading"
        >
          <h2 id="revenue-heading" className="font-heading text-lg font-semibold text-primary">
            Revenue over time
          </h2>
          <div className="mt-4 flex h-48 items-end gap-2">
            {REVENUE_DATA.map((d) => (
              <div
                key={d.month}
                className="flex-1 rounded-t bg-accent/20 transition-colors hover:bg-accent/30"
                style={{ height: `${(d.value / maxRev) * 100}%`, minHeight: "4px" }}
                title={`${d.month}: ${d.value}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            {REVENUE_DATA.map((d) => (
              <span key={d.month}>{d.month}</span>
            ))}
          </div>
        </section>

        <section
          className="rounded-[var(--radius-lg)] border border-border bg-surface p-5"
          aria-labelledby="orders-heading"
        >
          <h2 id="orders-heading" className="font-heading text-lg font-semibold text-primary">
            Orders per day
          </h2>
          <div className="mt-4 flex h-48 items-end gap-2">
            {ORDERS_BY_DAY.map((d) => (
              <div
                key={d.day}
                className="flex-1 rounded-t bg-accent/40 transition-colors hover:bg-accent/50"
                style={{ height: `${(d.orders / maxOrders) * 100}%`, minHeight: "4px" }}
                title={`${d.day}: ${d.orders}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            {ORDERS_BY_DAY.map((d) => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section
          className="rounded-[var(--radius-lg)] border border-border bg-surface p-5"
          aria-labelledby="category-heading"
        >
          <h2 id="category-heading" className="font-heading text-lg font-semibold text-primary">
            Category distribution
          </h2>
          <ul className="mt-4 space-y-2">
            {CATEGORY_DISTRIBUTION.map((c) => (
              <li key={c.name} className="flex items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: c.color }}
                  aria-hidden
                />
                <span className="text-sm text-primary">{c.name}</span>
                <span className="ml-auto text-sm font-medium text-muted-foreground">{c.value}%</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="rounded-[var(--radius-lg)] border border-border bg-surface p-5"
          aria-labelledby="top-heading"
        >
          <h2 id="top-heading" className="font-heading text-lg font-semibold text-primary">
            Top selling products
          </h2>
          <ul className="mt-4 space-y-3">
            {TOP_PRODUCTS.map((p) => (
              <li key={p.name} className="flex items-center gap-3">
                <span className="min-w-0 flex-1 truncate text-sm text-primary">{p.name}</span>
                <span className="text-sm font-medium text-muted-foreground">{p.sales} sales</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section
        className="rounded-[var(--radius-lg)] border border-border bg-surface p-5"
        aria-labelledby="funnel-heading"
      >
        <h2 id="funnel-heading" className="font-heading text-lg font-semibold text-primary">
          Funnel: Visits → Cart → Checkout → Purchase
        </h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {FUNNEL_DATA.map((s) => (
            <div
              key={s.stage}
              className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-muted px-4 py-2"
            >
              <span className="text-sm font-medium text-primary">{s.stage}</span>
              <span className="text-sm text-muted-foreground">{s.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
