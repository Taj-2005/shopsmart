"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";

export function Hero() {
  return (
    <section
      className="relative min-w-0 overflow-hidden bg-surface py-12 sm:py-28 lg:py-36"
      aria-labelledby="hero-heading"
    >
      <Container as="div">
        <div className="mx-auto max-w-3xl min-w-0 text-center">
          <motion.h1
            id="hero-heading"
            className="font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl xl:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Smart shopping.
            <br />
            <span className="text-muted-foreground">Trusted choices.</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            Discover quality products with clarity and confidence. Built for
            scale, designed for you.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <Link
              href="/home"
              className="inline-flex min-h-[44px] min-w-[44px] flex-1 basis-0 items-center justify-center rounded-[var(--radius)] bg-accent px-6 py-3 text-base font-medium text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent sm:min-h-14 sm:flex-none sm:basis-auto sm:px-8 sm:text-lg"
            >
              Start Shopping
            </Link>
            <Link
              href="/#categories"
              className="inline-flex min-h-[44px] min-w-[44px] flex-1 basis-0 items-center justify-center rounded-[var(--radius)] border-2 border-border bg-surface px-6 py-3 text-base font-medium text-primary transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent sm:min-h-14 sm:flex-none sm:basis-auto sm:px-8 sm:text-lg"
            >
              Explore Categories
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
