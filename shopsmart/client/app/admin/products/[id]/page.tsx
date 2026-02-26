"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { productApi, type ApiProduct } from "@/api/product.api";
import { categoriesApi } from "@/api/categories.api";
import { Button } from "@/components/ui/button";
import { toApiError } from "@/api/axios";

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", price: "", categoryId: "", description: "", image: "", inStock: true, stockQty: 0 });

  useEffect(() => {
    Promise.all([productApi.getById(id), categoriesApi.list()])
      .then(([pRes, cRes]) => {
        if (pRes.success && pRes.data) {
          setProduct(pRes.data);
          setForm({
            name: pRes.data.name,
            slug: pRes.data.slug,
            price: String(pRes.data.price),
            categoryId: pRes.data.categoryId,
            description: pRes.data.description ?? "",
            image: pRes.data.image ?? "",
            inStock: pRes.data.inStock ?? true,
            stockQty: pRes.data.stockQty ?? 0,
          });
        }
        if (cRes.success && cRes.data) setCategories(cRes.data);
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setError(null);
    setSaving(true);
    try {
      await productApi.update(id, {
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        price: Number(form.price),
        categoryId: form.categoryId || undefined,
        description: form.description || undefined,
        image: form.image || undefined,
        inStock: form.inStock,
        stockQty: form.stockQty,
      });
      router.push("/admin/products");
    } catch (err) {
      setError(toApiError(err).message ?? "Failed to update product");
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

  if (error && !product) {
    return (
      <div className="space-y-4">
        <p className="text-[var(--color-error)]">{error}</p>
        <Link href="/admin/products" className="text-accent hover:underline">Back to products</Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="text-sm text-accent hover:underline">← Products</Link>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-primary mt-2">
          Edit product
        </h1>
      </div>

      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-[var(--radius-lg)] border border-border bg-surface p-6">
        <div>
          <label htmlFor="edit-name" className="block text-sm font-medium text-primary">Name</label>
          <input
            id="edit-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="edit-slug" className="block text-sm font-medium text-primary">Slug</label>
          <input
            id="edit-slug"
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
          />
        </div>
        <div>
          <label htmlFor="edit-price" className="block text-sm font-medium text-primary">Price</label>
          <input
            id="edit-price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="edit-category" className="block text-sm font-medium text-primary">Category</label>
          <select
            id="edit-category"
            value={form.categoryId}
            onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
            className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="edit-desc" className="block text-sm font-medium text-primary">Description</label>
          <textarea
            id="edit-desc"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="edit-image" className="block text-sm font-medium text-primary">Image URL</label>
          <input
            id="edit-image"
            type="text"
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
          />
        </div>
        <div>
          <label htmlFor="edit-stockQty" className="block text-sm font-medium text-primary">Stock quantity</label>
          <input
            id="edit-stockQty"
            type="number"
            min="0"
            value={form.stockQty}
            onChange={(e) => setForm((f) => ({ ...f, stockQty: Number(e.target.value) }))}
            className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="edit-inStock"
            type="checkbox"
            checked={form.inStock}
            onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
            className="rounded border-border text-accent"
          />
          <label htmlFor="edit-inStock" className="text-sm font-medium text-primary">In stock</label>
        </div>
        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
