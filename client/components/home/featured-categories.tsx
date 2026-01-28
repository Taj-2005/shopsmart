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
      className="py-16 sm:py-20 lg:py-24 bg-muted/70"
      aria-labelledby="categories-heading"
    >
      <Container as="div">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Explore
          </p>
          <h2
            id="categories-heading"
            className="mt-2 font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl lg:text-4xl"
          >
            Shop by category
          </h2>
          <p className="mt-1.5 text-muted-foreground sm:max-w-md">
            Browse by interest. Find exactly what you’re looking for.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <Link
                href={`/shop?cat=${cat.slug}`}
                className="group block overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={categoryImages[cat.name]?.url ?? categoryImages.Electronics.url}
                    alt={categoryImages[cat.name]?.alt ?? cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />
                  <span className="absolute bottom-4 left-4 right-4 font-heading text-lg font-semibold text-on-primary drop-shadow-md">
                    {cat.name}
                  </span>
                  <span className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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
