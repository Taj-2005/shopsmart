"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { NewArrivalsCarousel } from "@/components/home/new-arrivals-carousel";
import { DealsSection } from "@/components/home/deals-section";
import { TrendingGrid } from "@/components/home/trending-grid";
import { FeaturedCategories } from "@/components/home/featured-categories";

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <section className="bg-muted py-12 sm:py-16 lg:py-20">
        <Container as="div">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Welcome back
          </h1>
          <p className="mt-2 text-muted-foreground">
            New arrivals, deals, and your next favourite find.
          </p>
        </Container>
      </section>
      <NewArrivalsCarousel />
      <DealsSection />
      <TrendingGrid />
      <FeaturedCategories />
    </motion.div>
  );
}
