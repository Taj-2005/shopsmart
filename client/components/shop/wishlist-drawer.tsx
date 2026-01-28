"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useShop } from "@/context/shop-context";
import { getProductById, getFormattedPrice } from "@/data/products";
import type { Product } from "@/data/products";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { wishlist, wishlistCount, toggleWishlist, moveToCart } = useShop();
  const productIds = Array.from(wishlist);
  const products = productIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => !!p);

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
            aria-label="Wishlist"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-xl"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
              <h2 className="font-heading text-lg font-semibold text-primary">
                Wishlist ({wishlistCount})
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-muted hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                aria-label="Close wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {products.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  Your wishlist is empty.
                </p>
              ) : (
                <ul className="space-y-4" role="list">
                  {products.map((p) => {
                    const { current } = getFormattedPrice(p);
                    return (
                      <li
                        key={p.id}
                        className="flex gap-4 rounded-[var(--radius)] border border-border bg-muted p-3"
                      >
                        <Link
                          href={`/shop?p=${p.id}`}
                          onClick={onClose}
                          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
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
                            href={`/shop?p=${p.id}`}
                            onClick={onClose}
                            className="font-medium text-primary line-clamp-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                          >
                            {p.name}
                          </Link>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {current}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => moveToCart(p.id)}
                              className="rounded-[var(--radius-sm)] bg-accent px-3 py-1.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                            >
                              Move to cart
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleWishlist(p.id)}
                              className="rounded-[var(--radius-sm)] border border-border px-3 py-1.5 text-sm font-medium text-primary hover:bg-muted transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
