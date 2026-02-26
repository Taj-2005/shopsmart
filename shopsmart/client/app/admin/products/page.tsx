"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { productApi, type ApiProduct } from "@/api/product.api";
import { categoriesApi } from "@/api/categories.api";
import { Button } from "@/components/ui/button";
import { toApiError } from "@/api/axios";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({ name: "", slug: "", price: "", categoryId: "", description: "", image: "" });

  useEffect(() => {
    Promise.all([productApi.list(), categoriesApi.list()])
      .then(([pRes, cRes]) => {
        if (pRes.success && pRes.data) setProducts(pRes.data);
        if (cRes.success && cRes.data) setCategories(cRes.data);
      })
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.price || !addForm.categoryId) {
      setAddError("Name, price and category are required");
      return;
    }
    setAddError(null);
    setAddSubmitting(true);
    try {
      await productApi.create({
        name: addForm.name.trim(),
        slug: addForm.slug.trim() || addForm.name.toLowerCase().replace(/\s+/g, "-"),
        price: Number(addForm.price),
        categoryId: addForm.categoryId,
        description: addForm.description || undefined,
        image: addForm.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      });
      const res = await productApi.list();
      if (res.success && res.data) setProducts(res.data);
      setShowAddModal(false);
      setAddForm({ name: "", slug: "", price: "", categoryId: "", description: "", image: "" });
    } catch (err) {
      setAddError(toApiError(err).message ?? "Failed to create product");
    } finally {
      setAddSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-error)] bg-[var(--color-error)]/10 p-6 text-[var(--color-error)]">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">
          Products
        </h1>
        <div className="flex gap-2">
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-accent"
          />
          <Button type="button" onClick={() => setShowAddModal(true)}>Add product</Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 font-semibold text-primary">Product</th>
                <th className="px-4 py-3 font-semibold text-primary">Category</th>
                <th className="px-4 py-3 font-semibold text-primary">Price</th>
                <th className="px-4 py-3 font-semibold text-primary">Stock</th>
                <th className="px-4 py-3 font-semibold text-primary">Status</th>
                <th className="px-4 py-3 font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-primary">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-3">₹{Number(p.price).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">{p.stockQty ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.inStock ? "bg-green-100 text-green-800" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.inStock ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/products/${p.id}`} className="text-accent hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
          <span>Showing {filtered.length} products</span>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-product-title">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-lg">
            <h2 id="add-product-title" className="font-heading text-lg font-semibold text-primary">
              Add product
            </h2>
            {addError && <p className="mt-2 text-sm text-[var(--color-error)]">{addError}</p>}
            <form onSubmit={handleAddProduct} className="mt-4 space-y-3">
              <div>
                <label htmlFor="add-name" className="block text-sm font-medium text-primary">Name</label>
                <input
                  id="add-name"
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="add-slug" className="block text-sm font-medium text-primary">Slug (optional)</label>
                <input
                  id="add-slug"
                  type="text"
                  value={addForm.slug}
                  onChange={(e) => setAddForm((f) => ({ ...f, slug: e.target.value }))}
                  className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
                />
              </div>
              <div>
                <label htmlFor="add-price" className="block text-sm font-medium text-primary">Price</label>
                <input
                  id="add-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={addForm.price}
                  onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))}
                  className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="add-category" className="block text-sm font-medium text-primary">Category</label>
                <select
                  id="add-category"
                  value={addForm.categoryId}
                  onChange={(e) => setAddForm((f) => ({ ...f, categoryId: e.target.value }))}
                  className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="add-desc" className="block text-sm font-medium text-primary">Description (optional)</label>
                <textarea
                  id="add-desc"
                  value={addForm.description}
                  onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
                  className="mt-1 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-primary"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" disabled={addSubmitting}>{addSubmitting ? "Creating…" : "Create"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
