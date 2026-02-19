"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute requiredRole={["admin", "super_admin"]}>
      <div className="min-h-screen bg-muted">
        <AdminSidebar />
        <main id="main-content" className="pl-64 min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-surface px-6">
            <AdminBreadcrumb />
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
