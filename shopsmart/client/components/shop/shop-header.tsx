"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Logo } from "@/components/ui/logo";
import { useShop } from "@/context/shop-context";
import { useAuth } from "@/context/auth-context";

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

export function ShopHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/home";
  const isShop = pathname?.startsWith("/shop");
  const isCart = pathname === "/cart";
  const isWishlist = pathname === "/wishlist";
  const { cartCount, wishlistCount } = useShop();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  return (
    <header
      className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80"
      role="banner"
    >
      <Container as="div" className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 font-heading text-xl font-semibold tracking-tight text-primary shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
          aria-label="ShopSmart — Home"
        >
          <Logo size={36} />
          ShopSmart
        </Link>

        <nav aria-label="Shop navigation" className="hidden sm:flex items-center gap-6">
          <Link
            href="/home"
            className={`text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent ${isHome ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent ${isShop ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            Shop
          </Link>
          <Link
            href="/shop?cat=electronics"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
          >
            Electronics
          </Link>
          <Link
            href="/shop?cat=fashion"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
          >
            Fashion
          </Link>
          <Link
            href="/shop?cat=home"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
          >
            Home & Living
          </Link>
          <Link
            href="/shop?cat=sports"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
          >
            Sports
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/profile"
                className={`text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent ${pathname === "/profile" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                Profile
              </Link>
              <Link
                href="/orders"
                className={`text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent ${pathname === "/orders" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                Orders
              </Link>
            </>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-semibold text-accent hover:underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0" role="toolbar" aria-label="Account and cart actions">
          <Link
            href="/wishlist"
            className={`relative flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent ${isWishlist ? "text-accent bg-accent/10" : "text-muted-foreground hover:bg-muted hover:text-primary"}`}
            aria-label={`Wishlist${wishlistCount > 0 ? ` (${wishlistCount} items)` : ""}`}
          >
            <HeartIcon filled={wishlistCount > 0 || isWishlist} />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-on-accent">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className={`relative flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent ${isCart ? "text-accent bg-accent/10" : "text-muted-foreground hover:bg-muted hover:text-primary"}`}
            aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium text-on-accent">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-accent/20 font-medium text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
              aria-label="Profile"
            >
              <span className="text-sm" aria-hidden>
                {user?.fullName?.charAt(0) ?? "U"}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
              aria-label="Log in"
            >
              <span className="text-sm font-medium" aria-hidden>U</span>
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
