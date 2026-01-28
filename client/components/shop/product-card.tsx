"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { getFormattedPrice } from "@/data/products";
import { useShop } from "@/context/shop-context";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "default" | "compact" | "wishlist";
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5 text-accent" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i <= full || (i === full + 1 && half) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polygon points="12 2 15 9 22 9 17 14 18 22 12 18 6 22 7 14 2 9 9 9" />
        </svg>
      ))}
    </span>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
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
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDecrease();
        }}
        disabled={quantity <= min}
        className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        className="flex h-9 min-w-[2rem] items-center justify-center text-sm font-medium text-primary"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onIncrease();
        }}
        className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export function ProductCard({ product, index = 0, variant = "default" }: ProductCardProps) {
  const { current, original } = getFormattedPrice(product);
  const isCompact = variant === "compact";
  const isWishlistView = variant === "wishlist";
  const { cart, addToCart, updateQuantity, toggleWishlist, isInWishlist, moveToCart } = useShop();
  const qty = cart[product.id] ?? 0;
  const inCart = qty > 0;
  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) addToCart(product.id, 1);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group"
    >
      <Link
        href={`/shop?p=${product.id}`}
        className="block rounded-[var(--radius-lg)] border border-border bg-surface overflow-hidden transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
      >
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes={isCompact ? "(max-width: 640px) 45vw, 220px" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.isNew && (
              <span className="rounded bg-accent px-2 py-0.5 text-xs font-medium text-on-accent">
                New
              </span>
            )}
            {product.isDeal && product.originalPrice && (
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-medium text-on-primary">
                Deal
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleWishlistClick}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-muted-foreground transition-colors hover:bg-surface hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon filled={inWishlist} />
          </button>
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/60">
              <span className="rounded bg-primary px-3 py-1 text-sm font-medium text-on-primary">
                Out of stock
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {product.category}
          </p>
          <h3 className="mt-1 font-heading font-semibold text-primary line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-medium text-primary">{current}</span>
            {original && (
              <span className="text-xs text-muted-foreground line-through">
                {original}
              </span>
            )}
          </div>
          <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
            {isWishlistView && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="text-sm text-muted-foreground hover:text-primary underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                >
                  Remove from wishlist
                </button>
                {inCart ? (
                  <QuantityStepper
                    quantity={qty}
                    onIncrease={() => updateQuantity(product.id, qty + 1)}
                    onDecrease={() => updateQuantity(product.id, qty - 1)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (product.inStock) moveToCart(product.id);
                    }}
                    disabled={!product.inStock}
                    className="rounded-[var(--radius-sm)] bg-accent px-3 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Move to Cart
                  </button>
                )}
              </div>
            )}
            {!isWishlistView &&
              (inCart ? (
                <QuantityStepper
                  quantity={qty}
                  onIncrease={() => updateQuantity(product.id, qty + 1)}
                  onDecrease={() => updateQuantity(product.id, qty - 1)}
                />
              ) : (
                <motion.button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full rounded-[var(--radius-sm)] py-2 text-sm font-medium bg-accent text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add to cart
                </motion.button>
              ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
