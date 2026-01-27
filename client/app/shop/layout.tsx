import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop/shop-header";

export const metadata: Metadata = {
  title: "Shop — All Products",
  description:
    "Browse all products on ShopSmart. Electronics, Fashion, Home & Living. Smart shopping, trusted choices.",
  openGraph: {
    title: "Shop | ShopSmart",
    description:
      "Browse all products on ShopSmart. Electronics, Fashion, Home & Living.",
  },
  twitter: {
    title: "Shop | ShopSmart",
    description:
      "Browse all products on ShopSmart. Smart shopping, trusted choices.",
  },
};

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ShopHeader />
      <main id="main-content">{children}</main>
    </>
  );
}
