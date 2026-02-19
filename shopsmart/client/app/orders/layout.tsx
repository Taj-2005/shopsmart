import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop/shop-header";

export const metadata: Metadata = {
  title: "Orders",
  description: "Your order history at ShopSmart.",
};

export default function OrdersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ShopHeader />
      <main id="main-content" className="min-w-0 overflow-x-hidden bg-muted">
        {children}
      </main>
    </>
  );
}
