"use client";

import { ProductCard } from "./product-card";
import type { Product } from "@/data/products";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-surface py-16 text-center">
        <p className="text-muted-foreground">No products match your filters.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting category, price, or rating.
        </p>
      </div>
    );
  }

  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
      role="list"
    >
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} index={i} />
        </li>
      ))}
    </ul>
  );
}
