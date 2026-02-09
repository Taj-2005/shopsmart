"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/layout/section";

export function MissionSection() {
  return (
    <Section
      id="mission"
      className="bg-primary text-white"
      aria-labelledby="mission-heading"
    >
      <motion.div
        className="mx-auto max-w-3xl text-center text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px", amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          id="mission-heading"
          className="font-heading text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Built for how you shop
        </h2>
        <p className="mt-6 text-lg text-white/90">
          ShopSmart exists to make online shopping clear, trustworthy, and
          effortless. We combine premium quality with approachable design — no
          clutter, no dark patterns. Just smart choices, delivered.
        </p>
        <p className="mt-4 text-sm text-white/80">
          Unique in focus. Premium in execution. Yours to trust.
        </p>
      </motion.div>
    </Section>
  );
}
