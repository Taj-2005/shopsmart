import Link from "next/link";
import { Container } from "./container";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <Container as="div" className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-heading text-xl font-semibold tracking-tight text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label="ShopSmart — Home"
        >
          ShopSmart
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-1 sm:gap-4">
            <li>
              <Link
                href="/#categories"
                className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/#features"
                className="rounded-md px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Why ShopSmart
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="inline-flex h-10 items-center justify-center rounded-[var(--radius)] bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
