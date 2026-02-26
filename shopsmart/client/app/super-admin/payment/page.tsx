"use client";

import { useState, useEffect } from "react";
import { superAdminApi } from "@/api/super-admin.api";
import { toApiError } from "@/api/axios";

export default function SuperAdminPaymentPage() {
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    superAdminApi
      .getPaymentConfig()
      .then((res) => {
        if (res.success && res.data) setConfig(res.data);
      })
      .catch(() => setError("Failed to load payment config"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await superAdminApi.updatePaymentConfig(config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setError(toApiError(e).message ?? "Failed to save");
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
      <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">Payment gateway</h1>
      <p className="text-muted-foreground">Configure payment provider and settings.</p>
      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      {success && <p className="text-sm text-green-600">Saved.</p>}
      <form onSubmit={handleSave} className="max-w-md space-y-4 rounded-[var(--radius-lg)] border border-border bg-surface p-6">
        <div>
          <label htmlFor="payment-provider" className="block text-sm font-medium text-primary">Provider</label>
          <input
            id="payment-provider"
            type="text"
            value={(config.provider as string) ?? ""}
            onChange={(e) => setConfig((c) => ({ ...c, provider: e.target.value }))}
            placeholder="e.g. stripe"
            className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
          />
        </div>
        <div>
          <label htmlFor="payment-enabled" className="block text-sm font-medium text-primary">Enabled</label>
          <input
            id="payment-enabled"
            type="checkbox"
            checked={!!config.enabled}
            onChange={(e) => setConfig((c) => ({ ...c, enabled: e.target.checked }))}
            className="rounded border-border text-accent"
          />
        </div>
        <button type="submit" disabled={saving} className="rounded-[var(--radius)] bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent/90 disabled:opacity-50">
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
