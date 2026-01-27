"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/layout/section";

const features = [
  {
    title: "Free shipping",
    description: "On orders above a threshold. Fast, reliable delivery.",
  },
  {
    title: "Easy returns",
    description: "Hassle-free returns within the return window.",
  },
  {
    title: "Quality assured",
    description: "Rigorous checks so you get what you expect.",
  },
  {
    title: "Secure checkout",
    description: "Your payments and data are always protected.",
  },
];

export function FeaturesSection() {
  return (
    <Section
      id="features"
      className="bg-[var(--card)]"
      aria-labelledby="features-heading"
    >
      <div className="text-center">
        <h2
          id="features-heading"
          className="font-heading text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl"
        >
          Why ShopSmart
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
          Shipping, returns, quality, and trust — all built in.
        </p>
      </div>
      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" role="list">
        {features.map((f, i) => (
          <motion.li
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] p-6"
          >
            <h3 className="font-heading font-semibold text-[var(--foreground)]">
              {f.title}
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{f.description}</p>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
