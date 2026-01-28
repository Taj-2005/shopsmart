"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { CATEGORIES } from "@/data/products";

const categoryImages: Record<string, { url: string; alt: string }> = {
  Electronics: {
    url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
    alt: "Modern electronics and gadgets",
  },
  Fashion: {
    url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
    alt: "Curated fashion and apparel",
  },
  Home: {
    url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=400&fit=crop",
    alt: "Home and living products",
  },
  Sports: {
    url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop",
    alt: "Sports and fitness gear",
  },
};

export function FeaturedCategories() {
  return (
    <section
      className="py-12 sm:py-16 bg-muted"
      aria-labelledby="categories-heading"
    >
      <Container as="div">
        <h2
          id="categories-heading"
          className="font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl mb-8"
        >
          Shop by category
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <Link
                href={`/shop?cat=${cat.slug}`}
                className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={categoryImages[cat.name]?.url ?? categoryImages.Electronics.url}
                    alt={categoryImages[cat.name]?.alt ?? cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/40" />
                  <span className="absolute bottom-4 left-4 font-heading text-lg font-semibold text-on-primary drop-shadow-md">
                    {cat.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
