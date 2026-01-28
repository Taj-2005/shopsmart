"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useShop } from "@/context/shop-context";
import { getProductById, getFormattedPrice } from "@/data/products";
import type { Product } from "@/data/products";
import { Container } from "@/components/layout/container";

function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-[var(--radius-sm)] border border-border bg-surface">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        className="flex h-9 min-w-[2.5rem] items-center justify-center text-sm font-medium text-primary"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useShop();
  const entries = Object.entries(cart).filter(([, q]) => q > 0);
  const subtotal = entries.reduce((sum, [id, qty]) => {
    const p = getProductById(id);
    return sum + (p ? p.price * qty : 0);
  }, 0);
  const discount = 0;
  const total = subtotal - discount;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-muted"
    >
      <Container as="div" className="py-8 lg:py-12">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Your Cart
        </h1>
        <p className="mt-2 text-muted-foreground">
          {entries.length === 0
            ? "Your cart is empty."
            : `${entries.length} item${entries.length === 1 ? "" : "s"} in your cart.`}
        </p>

        {entries.length === 0 ? (
          <div className="mt-12 rounded-[var(--radius-lg)] border border-border bg-surface py-16 text-center">
            <p className="text-muted-foreground">Add items from the shop to get started.</p>
            <Link
              href="/shop"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-[var(--radius)] bg-accent px-6 text-sm font-medium text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <ul className="space-y-4" role="list">
              {entries.map(([id, qty]) => {
                const p = getProductById(id);
                if (!p) return null;
                const { current } = getFormattedPrice(p);
                return (
                  <motion.li
                    key={id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-4"
                  >
                    <Link
                      href={`/shop?p=${id}`}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius)] bg-muted"
                    >
                      <Image
                        src={p.image}
                        alt={p.alt}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/shop?p=${id}`}
                        className="font-heading font-semibold text-primary hover:underline line-clamp-2"
                      >
                        {p.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-muted-foreground">{current}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4">
                        <QuantityStepper
                          quantity={qty}
                          onIncrease={() => updateQuantity(id, qty + 1)}
                          onDecrease={() => updateQuantity(id, qty - 1)}
                        />
                        <button
                          type="button"
                          onClick={() => removeFromCart(id)}
                          className="text-sm text-muted-foreground hover:text-primary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="shrink-0 text-right font-medium text-primary">
                      {formatPrice(p.price * qty)}
                    </p>
                  </motion.li>
                );
              })}
            </ul>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
                <h2 className="font-heading text-lg font-semibold text-primary">
                  Order summary
                </h2>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Discount</span>
                    <span>{discount > 0 ? `−${formatPrice(discount)}` : "—"}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3 font-semibold text-primary">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-6 w-full rounded-[var(--radius)] bg-accent py-3 text-base font-medium text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                >
                  Proceed to Checkout
                </button>
              </div>
            </aside>
          </div>
        )}
      </Container>
    </motion.div>
  );
}
