"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/shop/product-card";
import { Container } from "@/components/layout/container";
import type { Product } from "@/data/products";
import { getNewArrivals } from "@/data/products";

export function NewArrivalsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const products = getNewArrivals(8);

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
        ref={scrollRef}
        className="overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-thin px-4 sm:px-6 lg:px-8"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="flex gap-6 pb-4" style={{ minWidth: "min-content" }}>
          {products.map((p: Product, i: number) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="w-[280px] shrink-0 sm:w-[300px]"
            >
              <ProductCard product={p} index={i} variant="compact" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
