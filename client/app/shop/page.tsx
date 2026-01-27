"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { FiltersSidebar } from "@/components/shop/filters-sidebar";
import { SortBar } from "@/components/shop/sort-bar";
import { ProductGrid } from "@/components/shop/product-grid";

export default function ShopPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Container as="div" className="py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            Shop
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Discover quality products across categories.
          </p>
        </div>

        <div className="flex gap-8">
          <FiltersSidebar />
          <div className="min-w-0 flex-1">
            <SortBar />
            <div className="mt-6">
              <ProductGrid />
            </div>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
