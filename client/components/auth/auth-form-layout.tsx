"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";

interface AuthFormLayoutProps {
  children: React.ReactNode;
  title: string;
  alternateHref: string;
  alternateLabel: string;
  alternatePrompt: string;
}

export function AuthFormLayout({
  children,
  title,
  alternateHref,
  alternateLabel,
  alternatePrompt,
}: AuthFormLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted px-4 py-12">
      <div className="w-full max-w-[400px]">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-3 font-heading text-xl font-semibold tracking-tight text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
          aria-label="ShopSmart — Home"
        >
          <Logo size={40} />
          ShopSmart
        </Link>
        <h1 className="sr-only">{title}</h1>
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-sm sm:p-8">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-primary">
            {title}
          </h2>
          {children}
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {alternatePrompt}{" "}
          <Link
            href={alternateHref}
            className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
          >
            {alternateLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
