import type { Metadata } from "next";
import { LandingHeader } from "@/components/layout/landing-header";
import { LandingFooter } from "@/components/layout/landing-footer";
import { Hero } from "@/components/landing/hero";
import { ValueSection } from "@/components/landing/value-section";
import { CategoriesSection } from "@/components/landing/categories-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { MissionSection } from "@/components/landing/mission-section";

export const metadata: Metadata = {
  title: "ShopSmart — Smart Shopping, Trusted Choices",
  description:
    "Discover quality products with clarity and confidence. ShopSmart is your trusted eCommerce destination — modern, premium, built for scale.",
  openGraph: {
    title: "ShopSmart — Smart Shopping, Trusted Choices",
    description:
      "Discover quality products with clarity and confidence. Modern, premium, built for scale.",
  },
  twitter: {
    title: "ShopSmart — Smart Shopping, Trusted Choices",
    description:
      "Discover quality products with clarity and confidence. Built for how you shop.",
  },
};

export default function Home() {
  return (
    <>
      <LandingHeader />
      <main id="main-content" className="min-w-0 overflow-x-hidden">
        <Hero />
        <ValueSection />
        <CategoriesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <MissionSection />
      </main>
      <LandingFooter />
    </>
  );
}
