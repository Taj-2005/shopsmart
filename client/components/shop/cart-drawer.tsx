"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "@/context/shop-context";
import { getProductById, getFormattedPrice } from "@/data/products";
import type { Product } from "@/data/products";

function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, cartCount, removeFromCart, updateQuantity } = useShop();
  const entries = Object.entries(cart).filter(([, q]) => q > 0);
  const products = entries
    .map(([id]) => getProductById(id))
    .filter((p): p is Product => !!p);
  const subtotal = products.reduce(
    (sum, p) => sum + p.price * (cart[p.id] ?? 0),
    0
  );
  const discount = 0;
  const total = subtotal - discount;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            role="presentation"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-primary/20 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-xl"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
              <h2 className="font-heading text-lg font-semibold text-primary">
                Cart ({cartCount})
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                aria-label="Close cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {entries.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  Your cart is empty.
                </p>
              ) : (
                <ul className="space-y-4" role="list">
                  {entries.map(([id, qty]) => {
                    const p = getProductById(id);
                    if (!p) return null;
                    const { current } = getFormattedPrice(p);
                    return (
                      <li
                        key={id}
                        className="flex gap-4 rounded-[var(--radius)] border border-border bg-muted p-3"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-surface">
                          <Image
                            src={p.image}
                            alt={p.alt}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-primary line-clamp-2">
                            {p.name}
                          </p>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {current}
                            {qty > 1 && ` × ${qty}`}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center rounded-[var(--radius-sm)] border border-border bg-surface">
                              <button
                                type="button"
                                onClick={() => updateQuantity(id, qty - 1)}
                                className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="flex h-8 min-w-[2rem] items-center justify-center text-sm font-medium text-primary" aria-live="polite">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(id, qty + 1)}
                                className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(id)}
                              className="text-sm text-muted-foreground hover:text-primary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {entries.length > 0 && (
              <div className="shrink-0 border-t border-border p-4">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-accent">
                      <span>Discount</span>
                      <span>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-primary pt-2">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-[var(--radius)] bg-accent py-3 text-base font-medium text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
