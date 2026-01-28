"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";

export function HomeHero() {
  return (
    <section
      className="relative min-w-0 overflow-hidden bg-white py-16 sm:py-20 lg:py-28"
      aria-labelledby="home-hero-heading"
    >
      {/* Background layer: full-width gradient + pattern, anchored behind content */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden
      >
        <div
          className="absolute left-0 top-0 h-full w-full opacity-[0.4]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, var(--color-teal) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 50% 85%, rgba(34,34,34,0.06) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute left-0 top-0 h-full w-full opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23222222' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H0v40zM40 40V0L0 40h40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <Container as="div" className="relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            className="text-sm font-medium uppercase tracking-[0.2em] text-accent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            Welcome back
          </motion.p>
          <motion.h1
            id="home-hero-heading"
            className="mt-3 font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
          >
            Your next favourite find
          </motion.h1>
          <motion.p
            className="mt-4 text-base text-muted-foreground sm:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
          >
            New arrivals, handpicked deals, and trending picks — all in one place.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
          >
            <Link
              href="#new-arrivals"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius)] bg-accent px-6 py-3 text-base font-medium text-on-accent shadow-sm transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent sm:px-8 sm:text-lg"
            >
              Shop new arrivals
            </Link>
            <Link
              href="#deals"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius)] border-2 border-border bg-surface px-6 py-3 text-base font-medium text-primary transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent sm:px-8 sm:text-lg"
            >
              View deals
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
