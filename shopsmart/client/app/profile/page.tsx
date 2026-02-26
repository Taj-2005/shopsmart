"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { userApi } from "@/api/user.api";
import { toApiError } from "@/api/axios";

function ProfileContent() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setError(null);
    setSaving(true);
    try {
      await userApi.update(user.id, { fullName });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      const err = toApiError(e);
      setError(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container as="div" className="py-8 lg:py-12">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-primary">
        Profile
      </h1>
      <p className="mt-2 text-muted-foreground">
        Manage your account and preferences.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section
          className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 lg:col-span-2"
          aria-labelledby="profile-heading"
        >
          <h2 id="profile-heading" className="font-heading text-xl font-semibold text-primary">
            Edit profile
          </h2>
          {error && (
            <p className="mt-2 text-sm text-[var(--color-error)]" role="alert">
              {error}
            </p>
          )}
          <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-primary">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={user?.email ?? ""}
                disabled
                className="mt-1 block w-full rounded-[var(--radius-sm)] border border-border bg-muted px-4 py-3 text-muted-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
            <div>
              <label htmlFor="profile-name" className="block text-sm font-medium text-primary">
                Full name
              </label>
              <input
                id="profile-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-3 text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
              />
            </div>
            <Button type="submit" disabled={saving || saved}>
              {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
            </Button>
          </form>
        </section>

        <aside className="space-y-6">
          <section
            className="rounded-[var(--radius-lg)] border border-border bg-surface p-6"
            aria-labelledby="password-heading"
          >
            <h2 id="password-heading" className="font-heading text-lg font-semibold text-primary">
              Change password
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Update your password from the security page.
            </p>
            <a
              href="/login"
              className="mt-4 inline-flex h-12 items-center justify-center rounded-[var(--radius)] border-2 border-border bg-surface px-6 font-medium text-primary hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
            >
              Go to login
            </a>
          </section>

          <section
            className="rounded-[var(--radius-lg)] border border-border bg-surface p-6"
            aria-labelledby="address-heading"
          >
            <h2 id="address-heading" className="font-heading text-lg font-semibold text-primary">
              Addresses
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              No saved addresses. Add one at checkout.
            </p>
          </section>
        </aside>
      </div>
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
