"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/api/admin.api";
import { toApiError } from "@/api/axios";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createFullName, setCreateFullName] = useState("");
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  const [logs, setLogs] = useState<unknown[] | null>(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createEmail.trim() || !createPassword.trim()) {
      setCreateError("Email and password are required");
      return;
    }
    setCreateError(null);
    setCreateSuccess(false);
    setCreateSubmitting(true);
    try {
      await adminApi.createAdmin({
        email: createEmail.trim(),
        password: createPassword,
        fullName: createFullName.trim() || undefined,
      });
      setCreateSuccess(true);
      setCreateEmail("");
      setCreatePassword("");
      setCreateFullName("");
    } catch (err) {
      setCreateError(toApiError(err).message ?? "Failed to create admin");
    } finally {
      setCreateSubmitting(false);
    }
  };

  const handleViewLogs = () => {
    setLogsError(null);
    setLogsLoading(true);
    adminApi
      .getLogs(50)
      .then((res) => {
        if (res.success && res.data) setLogs(res.data as unknown[]);
      })
      .catch(() => setLogsError("Failed to load logs"))
      .finally(() => setLogsLoading(false));
  };

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
            {createSuccess && <p className="mt-2 text-sm text-green-600">Admin created successfully.</p>}
            {createError && <p className="mt-2 text-sm text-[var(--color-error)]">{createError}</p>}
            <form onSubmit={handleCreateAdmin} className="mt-4 space-y-3">
              <div>
                <label htmlFor="create-email" className="block text-sm font-medium text-primary">Email</label>
                <input
                  id="create-email"
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="create-password" className="block text-sm font-medium text-primary">Password</label>
                <input
                  id="create-password"
                  type="password"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label htmlFor="create-fullName" className="block text-sm font-medium text-primary">Full name (optional)</label>
                <input
                  id="create-fullName"
                  type="text"
                  value={createFullName}
                  onChange={(e) => setCreateFullName(e.target.value)}
                  className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
                />
              </div>
              <Button type="submit" disabled={createSubmitting} className="mt-4">
                {createSubmitting ? "Creating…" : "Create Admin"}
              </Button>
            </form>
          </section>

          <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:col-span-2">
            <h2 className="font-heading text-lg font-semibold text-primary">
              System logs
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              View platform and audit logs.
            </p>
            <Button variant="outline" className="mt-4" onClick={handleViewLogs} disabled={logsLoading}>
              {logsLoading ? "Loading…" : "View logs"}
            </Button>
            {logsError && <p className="mt-2 text-sm text-[var(--color-error)]">{logsError}</p>}
            {logs && (
              <div className="mt-4 max-h-96 overflow-y-auto rounded-[var(--radius-sm)] border border-border bg-muted/30 p-3 font-mono text-xs">
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(logs, null, 2)}
                </pre>
              </div>
            )}
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
