"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/layout/section";

export function MissionSection() {
  return (
    <Section
      id="mission"
      className="bg-[var(--primary)] text-[var(--primary-foreground)]"
      aria-labelledby="mission-heading"
    >
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <h2
          id="mission-heading"
          className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Built for how you shop
        </h2>
        <p className="mt-6 text-lg opacity-90">
          ShopSmart exists to make online shopping clear, trustworthy, and
          effortless. We combine premium quality with approachable design — no
          clutter, no dark patterns. Just smart choices, delivered.
        </p>
        <p className="mt-4 text-sm opacity-75">
          Unique in focus. Premium in execution. Yours to trust.
        </p>
      </motion.div>
    </Section>
  );
}
