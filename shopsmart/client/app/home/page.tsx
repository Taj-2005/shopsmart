"use client";

import { motion } from "framer-motion";
import { HomeHero } from "@/components/home/home-hero";
import { NewArrivalsCarousel } from "@/components/home/new-arrivals-carousel";
import { DealsSection } from "@/components/home/deals-section";
import { TrendingGrid } from "@/components/home/trending-grid";
import { FeaturedCategories } from "@/components/home/featured-categories";

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-w-0"
    >
      <HomeHero />
      <NewArrivalsCarousel />
      <DealsSection />
      <TrendingGrid />
      <FeaturedCategories />
    </motion.div>
  );
}
