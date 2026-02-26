"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApiCart } from "@/hooks/use-api-cart";
import { orderApi } from "@/api/order.api";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { toApiError } from "@/api/axios";

function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function CheckoutContent() {
  const router = useRouter();
  const { cart, loading: cartLoading, error: cartError } = useApiCart();
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);

  const items = cart?.items ?? [];
  const subtotal = items.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0);
  const total = subtotal;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setPlaceError(null);
    setPlacing(true);
    try {
      await orderApi.create({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      router.replace("/orders");
    } catch (e) {
      setPlaceError(toApiError(e).message ?? "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
      </div>
    );
  }

  if (cartError) {
    return (
      <Container as="div" className="py-12">
        <p className="text-[var(--color-error)]">{cartError}</p>
        <Link href="/cart" className="mt-4 inline-block text-accent hover:underline">Back to cart</Link>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container as="div" className="py-12">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block text-accent hover:underline">Continue shopping</Link>
      </Container>
    );
  }

  return (
    <Container as="div" className="py-8 lg:py-12">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-primary">
        Checkout
      </h1>
      <p className="mt-2 text-muted-foreground">
        Review your order and place it.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between rounded-[var(--radius-sm)] border border-border bg-surface p-3 text-sm">
              <span className="text-primary">{item.product?.name ?? "Item"} × {item.quantity}</span>
              <span className="font-medium text-primary">{formatPrice((item.product?.price ?? 0) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-semibold text-primary">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-t border-border pt-3 font-semibold text-primary">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            {placeError && <p className="mt-2 text-sm text-[var(--color-error)]">{placeError}</p>}
            <Button
              className="mt-6 w-full"
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? "Placing order…" : "Place order"}
            </Button>
            <Link href="/cart" className="mt-3 block text-center text-sm text-accent hover:underline">
              Back to cart
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
