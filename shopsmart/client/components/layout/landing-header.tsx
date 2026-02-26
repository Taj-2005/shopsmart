"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "./container";
import { Logo } from "@/components/ui/logo";
import { useShop } from "@/context/shop-context";
import { useAuth } from "@/context/auth-context";

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/#categories", label: "Categories" },
  { href: "/#features", label: "Why ShopSmart" },
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { cartCount, wishlistCount } = useShop();
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isSuperAdmin = user?.role === "super_admin";

  const closeMenu = useCallback(() => setOpen(false), []);

  const handleLogout = async () => {
    closeMenu();
    await logout();
    router.replace("/");
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80"
      role="banner"
    >
      <Container as="div" className="flex h-14 min-h-[44px] sm:h-16 items-center justify-between gap-2">
        <Link
          href="/"
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2 font-heading text-lg font-semibold tracking-tight text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent sm:gap-3 sm:text-xl"
          aria-label="ShopSmart — Home"
          onClick={closeMenu}
        >
          <Logo size={36} />
          <span className="truncate">ShopSmart</span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex md:gap-4"
        >
          <ul className="flex items-center gap-1 sm:gap-4">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent min-h-[44px] min-w-[44px] md:flex md:items-center md:justify-center"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/home"
                className="inline-flex h-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius)] bg-accent px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
              >
                Start Shopping
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className="rounded-md px-3 py-2 text-sm font-semibold text-accent transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent min-h-[44px] min-w-[44px] md:flex md:items-center md:justify-center"
                >
                  Admin
                </Link>
              </li>
            )}
            {isSuperAdmin && (
              <li>
                <Link
                  href="/super-admin"
                  className="rounded-md px-3 py-2 text-sm font-semibold text-accent transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent min-h-[44px] min-w-[44px] md:flex md:items-center md:justify-center"
                >
                  Super Admin
                </Link>
              </li>
            )}
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    href="/profile"
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent min-h-[44px] min-w-[44px] md:flex md:items-center md:justify-center"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                  >
                    Log out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/login"
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent min-h-[44px] min-w-[44px] md:flex md:items-center md:justify-center"
                  >
                    Log in
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="inline-flex h-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius)] border-2 border-accent px-4 text-sm font-medium text-accent transition-colors hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="flex min-h-[44px] items-center gap-1 shrink-0">
          <Link
            href="/wishlist"
            className="relative flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
            aria-label={wishlistCount > 0 ? `Wishlist (${wishlistCount} items)` : "Wishlist"}
          >
            <HeartIcon filled={wishlistCount > 0} />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-on-accent">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="relative flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
            aria-label={cartCount > 0 ? `Cart (${cartCount} items)` : "Cart"}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-on-accent">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 min-h-[44px] min-w-[44px] items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </Container>

      <div
        id="mobile-nav"
        className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out md:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        aria-hidden={!open}
      >
        <div className="min-h-0 border-t border-border bg-surface">
          <nav aria-label="Mobile navigation" className="px-4 py-4">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className="flex min-h-[44px] items-center rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/home"
                  onClick={closeMenu}
                  className="flex min-h-[44px] items-center justify-center rounded-[var(--radius)] bg-accent px-4 py-3 text-sm font-medium text-on-accent transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent mt-2"
                >
                  Start Shopping
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="flex min-h-[44px] items-center rounded-md px-3 py-3 text-sm font-medium text-accent hover:bg-muted hover:text-primary"
                  >
                    Admin
                  </Link>
                </li>
              )}
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      href="/profile"
                      onClick={closeMenu}
                      className="flex min-h-[44px] items-center rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex min-h-[44px] w-full items-center rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary text-left"
                    >
                      Log out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="flex min-h-[44px] items-center rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                    >
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      onClick={closeMenu}
                      className="flex min-h-[44px] items-center justify-center rounded-[var(--radius)] border-2 border-accent px-4 py-3 text-sm font-medium text-accent mt-2"
                    >
                      Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
