import Link from "next/link";
import { Container } from "./container";
import { Logo } from "@/components/ui/logo";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <Container as="div" className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 font-heading text-xl font-semibold tracking-tight text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
          aria-label="ShopSmart — Home"
        >
          <Logo size={36} />
          ShopSmart
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-1 sm:gap-4">
            <li>
              <Link
                href="/#categories"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/#features"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
              >
                Why ShopSmart
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="inline-flex h-10 items-center justify-center rounded-[var(--radius)] bg-accent px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
              >
                Start Shopping
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
