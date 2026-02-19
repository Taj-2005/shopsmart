"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Container } from "@/components/layout/container";
import { getOrdersByUserId } from "@/data/orders-mock";
import type { Order, OrderStatus } from "@/data/orders-mock";

function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-muted text-muted-foreground",
  refunded: "bg-red-100 text-red-800",
};

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-muted/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
      >
        <div className="min-w-0">
          <p className="font-heading font-semibold text-primary">{order.id}</p>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[order.status]}`}
          >
            {order.status}
          </span>
          <span className="font-semibold text-primary">{formatPrice(order.total)}</span>
          <span className="text-muted-foreground" aria-hidden>
            {expanded ? "▼" : "▶"}
          </span>
        </div>
      </button>
      {expanded && (
        <div className="border-t border-border p-4 space-y-4">
          {order.shippingAddress && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">Address: </span>
              {order.shippingAddress}
            </p>
          )}
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li key={item.productId} className="flex gap-3 text-sm">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-muted">
                  <Image src={item.image} alt="" fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-primary">{item.name}</p>
                  <p className="text-muted-foreground">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              className="rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm font-medium text-primary hover:bg-muted focus-visible:outline focus-visible:ring-accent"
            >
              Download invoice
            </button>
            <Link
              href="/shop"
              className="rounded-[var(--radius-sm)] bg-accent px-3 py-2 text-sm font-medium text-on-accent hover:bg-accent/90 focus-visible:outline focus-visible:ring-accent"
            >
              Reorder
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersContent() {
  const { user } = useAuth();
  const orders = user ? getOrdersByUserId(user.id) : [];

  return (
    <Container as="div" className="py-8 lg:py-12">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-primary">
        Order history
      </h1>
      <p className="mt-2 text-muted-foreground">
        View and manage your orders.
      </p>

      {orders.length === 0 ? (
        <div className="mt-12 rounded-[var(--radius-lg)] border border-border bg-surface py-16 text-center">
          <p className="text-muted-foreground">You haven’t placed any orders yet.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-[var(--radius)] bg-accent px-6 text-sm font-medium text-on-accent hover:bg-accent/90"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4" role="list">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
