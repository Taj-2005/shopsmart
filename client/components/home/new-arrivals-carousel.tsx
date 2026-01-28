"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/shop/product-card";
import { Container } from "@/components/layout/container";
import type { Product } from "@/data/products";
import { getNewArrivals } from "@/data/products";

const RESUME_DELAY_MS = 3000;

export function NewArrivalsCarousel() {
  const products = getNewArrivals(8);
  const [paused, setPaused] = useState(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleResume = useCallback(() => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => {
      setPaused(false);
      resumeRef.current = null;
    }, RESUME_DELAY_MS);
  }, []);

  const handleInteractionStart = useCallback(() => {
    setPaused(true);
    scheduleResume();
  }, [scheduleResume]);

  useEffect(() => {
    return () => {
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, []);

  const renderSet = (offset: number) =>
    products.map((p: Product, i: number) => (
      <motion.div
        key={`${p.id}-${offset}-${i}`}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: i * 0.05 }}
        className="shrink-0 w-[min(72vw,260px)] sm:w-[300px]"
      >
        <ProductCard product={p} index={i} variant="compact" />
      </motion.div>
    ));

  return (
    <section
      id="new-arrivals"
      className="scroll-mt-20 py-16 sm:py-20 lg:py-24 bg-surface"
      aria-labelledby="new-arrivals-heading"
    >
      <Container as="div" className="mb-8 sm:mb-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              Fresh picks
            </p>
            <h2
              id="new-arrivals-heading"
              className="font-heading text-2xl font-bold tracking-tight text-primary sm:text-3xl lg:text-4xl"
            >
              New arrivals
            </h2>
            <p className="mt-1.5 text-muted-foreground sm:max-w-md">
              Updated weekly. Latest styles and tech, ready to ship.
            </p>
          </div>
        </div>
      </Container>
      <div
        className={`marquee-wrap overflow-hidden px-4 sm:px-6 lg:px-8 select-none rounded-[var(--radius-lg)] ${paused ? "marquee-paused" : ""}`}
        aria-label="New arrivals carousel — scrolls continuously; pauses on interaction"
        onTouchStart={handleInteractionStart}
        onPointerDown={handleInteractionStart}
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
