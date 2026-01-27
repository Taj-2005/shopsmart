"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/layout/section";

const categories = [
  {
    name: "Electronics",
    href: "/shop?cat=electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
    alt: "Modern electronics and gadgets on a clean surface",
  },
  {
    name: "Fashion",
    href: "/shop?cat=fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
    alt: "Curated fashion and apparel selection",
  },
  {
    name: "Home & Living",
    href: "/shop?cat=home",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=400&fit=crop",
    alt: "Home and living products",
  },
];

export function CategoriesSection() {
  return (
    <Section
      id="categories"
      aria-labelledby="categories-heading"
    >
      <div className="text-center">
        <h2
          id="categories-heading"
          className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl"
        >
          Shop by category
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
          Find what you need across thoughtfully organised categories.
        </p>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              href={cat.href}
              className="group block overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[var(--foreground)]/20" />
                <span className="absolute bottom-4 left-4 font-heading text-lg font-semibold text-white drop-shadow-md">
                  {cat.name}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
