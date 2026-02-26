"use client";

import { useState, useEffect } from "react";
import { superAdminApi } from "@/api/super-admin.api";
import { toApiError } from "@/api/axios";

export default function SuperAdminFeatureFlagsPage() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    superAdminApi
      .getFeatureFlags()
      .then((res) => {
        if (res.success && res.data) setFlags(res.data);
      })
      .catch(() => setError("Failed to load feature flags"))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (key: string, value: boolean) => {
    const next = { ...flags, [key]: value };
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await superAdminApi.updateFeatureFlags(next);
      setFlags(next);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setError(toApiError(e).message ?? "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">Feature flags</h1>
      <p className="text-muted-foreground">Enable or disable platform features globally.</p>
      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      {success && <p className="text-sm text-green-600">Saved.</p>}
      <div className="space-y-3 rounded-[var(--radius-lg)] border border-border bg-surface p-6">
        {Object.entries(flags).map(([key, value]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleToggle(key, e.target.checked)}
              disabled={saving}
              className="rounded border-border text-accent"
            />
            <span className="text-primary">{key}</span>
          </label>
        ))}
        {Object.keys(flags).length === 0 && <p className="text-muted-foreground">No flags yet. Defaults may be set on first save.</p>}
      </div>
    </div>
  );
}
