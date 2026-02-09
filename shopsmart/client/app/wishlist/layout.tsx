import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop/shop-header";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description: "Your saved items at ShopSmart.",
};

export default function WishlistLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ShopHeader />
      <main id="main-content">{children}</main>
    </>
  );
}
