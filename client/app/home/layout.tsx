import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop/shop-header";

export const metadata: Metadata = {
  title: "Home — Shop Smart",
  description:
    "New arrivals, deals, and trending products. Your main shop experience at ShopSmart.",
};

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ShopHeader />
      <main id="main-content" className="min-w-0 overflow-x-hidden">{children}</main>
    </>
  );
}
