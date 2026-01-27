"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[var(--background)] py-20 sm:py-28 lg:py-36"
      aria-labelledby="hero-heading"
    >
      <Container as="div">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            id="hero-heading"
            className="font-heading text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Smart shopping.
            <br />
            <span className="text-[var(--muted)]">Trusted choices.</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-[var(--muted)] sm:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            Discover quality products with clarity and confidence. Built for
            scale, designed for you.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <Link
              href="/shop"
              className="inline-flex h-14 min-w-[180px] items-center justify-center rounded-[var(--radius)] bg-[var(--primary)] px-8 text-lg font-medium text-[var(--primary-foreground)] transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Start Shopping
            </Link>
            <Link
              href="/#categories"
              className="inline-flex h-14 items-center justify-center rounded-[var(--radius)] border-2 border-[var(--border)] bg-transparent px-8 text-lg font-medium transition-colors hover:border-stone-400 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Explore Categories
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
