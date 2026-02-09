"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/layout/section";

const values = [
  {
    title: "Curated quality",
    description:
      "Every product is vetted for quality and value. No clutter, no guesswork.",
  },
  {
    title: "Transparent pricing",
    description:
      "Clear prices, no hidden fees. What you see is what you pay.",
  },
  {
    title: "Trust at scale",
    description:
      "Built for millions. Your data and trust are protected at every step.",
  },
];

export function ValueSection() {
  return (
    <Section
      id="value"
      className="bg-surface"
      aria-labelledby="value-heading"
    >
      <h2
        id="value-heading"
        className="sr-only"
      >
        Why choose ShopSmart
      </h2>
      <div className="grid min-w-0 gap-8 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((item, i) => (
          <motion.article
            key={item.title}
            className="rounded-[var(--radius-lg)] border border-border bg-muted p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <h3 className="font-heading text-lg font-semibold text-primary">
              {item.title}
            </h3>
            <p className="mt-2 text-muted-foreground">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
