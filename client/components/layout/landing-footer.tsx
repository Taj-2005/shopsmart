import Link from "next/link";
import { Container } from "./container";

const footerLinks = {
  shop: [
    { label: "All Categories", href: "/shop" },
    { label: "New Arrivals", href: "/shop?new=1" },
    { label: "Best Sellers", href: "/shop?bestsellers=1" },
  ],
  help: [
    { label: "Shipping & Returns", href: "/#features" },
    { label: "FAQs", href: "/#features" },
    { label: "Contact Us", href: "/#contact" },
  ],
  company: [
    { label: "About Us", href: "/#mission" },
    { label: "Careers", href: "/#mission" },
    { label: "Press", href: "/#mission" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)]">
      <Container as="div" className="py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="font-heading text-lg font-semibold text-[var(--foreground)]"
              aria-label="ShopSmart — Home"
            >
              ShopSmart
            </Link>
            <p className="mt-3 max-w-xs text-sm text-[var(--muted)]">
              Smart shopping. Trusted choices. Built for how you live.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--foreground)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Help
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.help.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--foreground)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--foreground)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[var(--border)] pt-8 text-center text-sm text-[var(--muted)]">
          <p>© {new Date().getFullYear()} ShopSmart. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
