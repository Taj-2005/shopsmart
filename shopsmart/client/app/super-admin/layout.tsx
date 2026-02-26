"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { SuperAdminSidebar } from "@/components/super-admin/super-admin-sidebar";

export default function SuperAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute requiredRole="super_admin">
      <div className="min-h-screen bg-muted">
        <SuperAdminSidebar />
        <main id="main-content" className="pl-64 min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-surface px-6">
            <span className="font-heading text-sm font-medium text-muted-foreground">System Owner</span>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
