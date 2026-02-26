"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/api/axios";
import { toApiError } from "@/api/axios";

type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ code: "", type: "PERCENT", value: "", minOrder: "", maxUses: "", expiresAt: "", active: true });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    apiClient.get<{ success: boolean; data: Coupon[] }>("/api/admin/coupons")
      .then((r) => r.data.success && r.data.data && setCoupons(r.data.data))
      .catch(() => setError("Failed to load coupons"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || form.value === "") return;
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.post("/api/admin/coupons", {
        code: form.code.trim(),
        type: form.type,
        value: Number(form.value),
        minOrder: form.minOrder ? Number(form.minOrder) : undefined,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined,
        active: form.active,
      });
      load();
      setShowAdd(false);
      setForm({ code: "", type: "PERCENT", value: "", minOrder: "", maxUses: "", expiresAt: "", active: true });
    } catch (err) {
      setError(toApiError(err).message ?? "Failed to create coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await apiClient.delete(`/api/admin/coupons/${id}`);
      load();
    } catch {
      setError("Failed to delete coupon");
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">Coupons</h1>
        <button type="button" onClick={() => setShowAdd(true)} className="rounded-[var(--radius)] bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent/90">Add coupon</button>
      </div>
      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 font-semibold text-primary">Code</th>
              <th className="px-4 py-3 font-semibold text-primary">Type</th>
              <th className="px-4 py-3 font-semibold text-primary">Value</th>
              <th className="px-4 py-3 font-semibold text-primary">Used</th>
              <th className="px-4 py-3 font-semibold text-primary">Status</th>
              <th className="px-4 py-3 font-semibold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-primary">{c.code}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.type}</td>
                <td className="px-4 py-3">{c.type === "PERCENT" ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="px-4 py-3">{c.usedCount}{c.maxUses != null ? ` / ${c.maxUses}` : ""}</td>
                <td className="px-4 py-3">{c.active ? "Active" : "Inactive"}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => handleDelete(c.id)} className="text-[var(--color-error)] hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-lg">
            <h2 className="font-heading text-lg font-semibold text-primary">Add coupon</h2>
            <form onSubmit={handleCreate} className="mt-4 space-y-3">
              <div>
                <label htmlFor="coupon-code" className="block text-sm font-medium text-primary">Code</label>
                <input id="coupon-code" type="text" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary" required />
              </div>
              <div>
                <label htmlFor="coupon-type" className="block text-sm font-medium text-primary">Type</label>
                <select id="coupon-type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary">
                  <option value="PERCENT">Percent</option>
                  <option value="FIXED">Fixed</option>
                </select>
              </div>
              <div>
                <label htmlFor="coupon-value" className="block text-sm font-medium text-primary">Value</label>
                <input id="coupon-value" type="number" step="0.01" min="0" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary" required />
              </div>
              <div>
                <label htmlFor="coupon-maxUses" className="block text-sm font-medium text-primary">Max uses (optional)</label>
                <input id="coupon-maxUses" type="number" min="0" value={form.maxUses} onChange={(e) => setForm((f) => ({ ...f, maxUses: e.target.value }))} className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 rounded-[var(--radius-sm)] border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-muted">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 rounded-[var(--radius-sm)] bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent/90 disabled:opacity-50">{submitting ? "Creating…" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
