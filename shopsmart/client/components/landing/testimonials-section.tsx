"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/layout/section";

const testimonials = [
  {
    quote:
      "The clarity and speed of the experience stood out. Feels like a brand that gets it.",
    author: "Priya M.",
    role: "Frequent shopper",
  },
  {
    quote:
      "Finally, an eCommerce site that doesn't overwhelm. Clean, trustworthy, and easy to use.",
    author: "Rahul K.",
    role: "First-time buyer",
  },
  {
    quote:
      "Quality and trust are obvious from the first click. My go-to for online shopping now.",
    author: "Anita S.",
    role: "Verified buyer",
  },
];

export function TestimonialsSection() {
  return (
    <Section id="testimonials" className="bg-muted" aria-labelledby="testimonials-heading">
      <div className="text-center">
        <h2
          id="testimonials-heading"
          className="font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl"
        >
          What people say
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Real feedback from shoppers who chose ShopSmart.
        </p>
      </div>
      <ul className="mt-12 grid min-w-0 grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-3" role="list">
        {testimonials.map((t, i) => (
          <motion.li
            key={t.author}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-[var(--radius-lg)] border border-border bg-surface p-8"
          >
            <blockquote className="text-primary">
              <p className="text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4">
                <cite className="not-italic">
                  <span className="font-semibold">{t.author}</span>
                  <span className="text-muted-foreground"> — {t.role}</span>
                </cite>
              </footer>
            </blockquote>
          </motion.li>
        ))}
      </ul>
    </Section>
  );
}
