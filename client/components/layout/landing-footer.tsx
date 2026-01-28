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
    { label: "Contact Us", href: "/#features" },
  ],
  company: [
    { label: "About Us", href: "/#mission" },
    { label: "Careers", href: "/#mission" },
    { label: "Press", href: "/#mission" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container as="div" className="py-16">
        <div className="grid min-w-0 grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="font-heading text-lg font-semibold text-primary"
              aria-label="ShopSmart — Home"
            >
              ShopSmart
            </Link>
            <p className="mt-3 max-w-xs min-w-0 text-sm text-muted-foreground">
              Smart shopping. Trusted choices. Built for how you live.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.shop.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Help
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.help.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ShopSmart. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
