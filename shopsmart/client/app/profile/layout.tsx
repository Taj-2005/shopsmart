import type { Metadata } from "next";
import { ShopHeader } from "@/components/shop/shop-header";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your ShopSmart profile.",
};

export default function ProfileLayout({
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
