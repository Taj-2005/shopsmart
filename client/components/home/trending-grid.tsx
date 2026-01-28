"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/shop/product-card";
import { Container } from "@/components/layout/container";
import { getTrending } from "@/data/products";

export function TrendingGrid() {
  const products = getTrending(8);

  return (
    <section
      className="py-12 sm:py-16 bg-surface"
      aria-labelledby="trending-heading"
    >
      <Container as="div">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2
              id="trending-heading"
              className="font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl"
            >
              Trending now
            </h2>
            <p className="mt-1 text-muted-foreground">
              Popular picks across categories.
            </p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 text-sm font-medium text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
          >
            Shop all →
          </Link>
        </div>
        <ul
          className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
          role="list"
        >
          {products.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <ProductCard product={p} index={i} />
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
