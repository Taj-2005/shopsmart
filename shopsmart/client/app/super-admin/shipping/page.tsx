"use client";

import { useState, useEffect } from "react";
import { superAdminApi } from "@/api/super-admin.api";
import { toApiError } from "@/api/axios";

export default function SuperAdminShippingPage() {
  const [providers, setProviders] = useState<{ id?: string; name: string; enabled?: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    superAdminApi
      .getShippingProviders()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) setProviders(res.data.length ? res.data : [{ name: "", enabled: true }]);
        else setProviders([{ name: "", enabled: true }]);
      })
      .catch(() => setError("Failed to load shipping providers"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = providers.filter((p) => p.name?.trim());
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await superAdminApi.updateShippingProviders(valid.length ? valid : []);
      setProviders(valid.length ? valid : [{ name: "", enabled: true }]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setError(toApiError(e).message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const addRow = () => setProviders((p) => [...p, { name: "", enabled: true }]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">Shipping providers</h1>
      <p className="text-muted-foreground">Manage shipping options.</p>
      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      {success && <p className="text-sm text-green-600">Saved.</p>}
      <form onSubmit={handleSave} className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-surface p-6">
        {providers.map((p, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={p.name}
              onChange={(e) => setProviders((prev) => prev.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
              placeholder="Provider name"
              className="flex-1 rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
            />
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={!!p.enabled}
                onChange={(e) => setProviders((prev) => prev.map((x, j) => (j === i ? { ...x, enabled: e.target.checked } : x)))}
                className="rounded border-border text-accent"
              />
              Enabled
            </label>
          </div>
        ))}
        <div className="flex gap-2">
          <button type="button" onClick={addRow} className="rounded-[var(--radius-sm)] border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-muted">
            Add provider
          </button>
          <button type="submit" disabled={saving} className="rounded-[var(--radius)] bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent/90 disabled:opacity-50">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
