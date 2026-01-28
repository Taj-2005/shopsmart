"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/shop/product-card";
import { Container } from "@/components/layout/container";
import type { Product } from "@/data/products";
import { getNewArrivals } from "@/data/products";

export function NewArrivalsCarousel() {
  const products = getNewArrivals(8);

  const renderSet = (offset: number) =>
    products.map((p: Product, i: number) => (
      <motion.div
        key={`${p.id}-${offset}-${i}`}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: i * 0.05 }}
        className="shrink-0 w-[280px] sm:w-[300px]"
      >
        <ProductCard product={p} index={i} variant="compact" />
      </motion.div>
    ));

  return (
    <section
      className="py-12 sm:py-16 bg-surface"
      aria-labelledby="new-arrivals-heading"
    >
      <Container as="div" className="mb-6">
        <div className="flex items-end justify-between gap-4">
          <h2
            id="new-arrivals-heading"
            className="font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl"
          >
            New arrivals
          </h2>
        </div>
      </Container>
      <div
        className="marquee-wrap overflow-hidden px-4 sm:px-6 lg:px-8 select-none"
        aria-label="New arrivals carousel — scrolls continuously; pauses on hover"
      >
        <div className="marquee-track inline-flex gap-6 pb-4">
          <div className="marquee-set flex shrink-0 gap-6">{renderSet(0)}</div>
          <div className="marquee-set flex shrink-0 gap-6" aria-hidden>
            {renderSet(1)}
          </div>
        </div>
      </div>
    </section>
  );
}
