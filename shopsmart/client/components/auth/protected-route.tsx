"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import type { UserRole } from "@/types/auth";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  fallback?: ReactNode;
};

export function ProtectedRoute({
  children,
  requiredRole,
  fallback = null,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isInitialized, isLoading } = useAuth();

  const allowed = (() => {
    if (!requiredRole) return true;
    if (!user) return false;
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(user.role);
  })();

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname ?? "/")}`);
      return;
    }
    if (!allowed) {
      router.replace(user?.role === "customer" ? "/home" : "/admin");
      return;
    }
  }, [isInitialized, isAuthenticated, allowed, pathname, router, user?.role]);

  if (!isInitialized || isLoading) {
    return fallback ?? <ProtectedRouteSkeleton />;
  }
  if (!isAuthenticated || !allowed) {
    return fallback ?? <ProtectedRouteSkeleton />;
  }
  return <>{children}</>;
}

export function ProtectedRouteSkeleton() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-muted/30">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function AdminRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute requiredRole={["admin", "super_admin"]} fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}

export function SuperAdminRoute({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="super_admin" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}
