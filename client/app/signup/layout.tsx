import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your ShopSmart account.",
};

export default function SignupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
