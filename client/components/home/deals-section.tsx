"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/shop/product-card";
import { Container } from "@/components/layout/container";
import { getDeals } from "@/data/products";

export function DealsSection() {
  const products = getDeals(6);

  return (
    <section
      className="py-12 sm:py-16 bg-muted"
      aria-labelledby="deals-heading"
    >
      <Container as="div">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2
              id="deals-heading"
              className="font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl"
            >
              Deals & offers
            </h2>
            <p className="mt-1 text-muted-foreground">
              Limited-time savings on quality products.
            </p>
          </div>
          <Link
            href="/shop?deal=1"
            className="shrink-0 text-sm font-medium text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
          >
            View all →
          </Link>
        </div>
        <ul
          className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3"
          role="list"
        >
          {products.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <ProductCard product={p} index={i} />
            </motion.li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
