"use client";

import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">
          Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Platform configuration and feature flags.
        </p>
      </div>

      {isSuperAdmin ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-semibold text-primary">
              Create Admin
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Invite or create new admin accounts. Super Admin only.
            </p>
            <Button variant="outline" className="mt-4">
              Create Admin
            </Button>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
            <h2 className="font-heading text-lg font-semibold text-primary">
              Feature flags
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enable or disable features globally.
            </p>
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded border-border text-accent" />
                New checkout flow
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="rounded border-border text-accent" />
                Reviews moderation
              </label>
            </div>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:col-span-2">
            <h2 className="font-heading text-lg font-semibold text-primary">
              System logs
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              View platform and audit logs.
            </p>
            <Button variant="outline" className="mt-4">
              View logs
            </Button>
          </section>
        </div>
      ) : (
        <p className="text-muted-foreground">
          Only Super Admins can access settings. Contact your administrator.
        </p>
      )}
    </div>
  );
}
