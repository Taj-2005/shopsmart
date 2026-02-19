"use client";

import { useState } from "react";
import { PRODUCTS } from "@/data/products";
import { Button } from "@/components/ui/button";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

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
          <Button>Add product</Button>
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
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3">₹{p.price.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">{p.inStock ? "In stock" : "Out"}</td>
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
                    <a href={`/admin/products/${p.id}`} className="text-accent hover:underline">
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted-foreground">
          <span>Showing {filtered.length} products</span>
          <div className="flex gap-2">
            <button type="button" className="rounded px-2 py-1 hover:bg-muted" disabled>
              Previous
            </button>
            <button type="button" className="rounded px-2 py-1 hover:bg-muted" disabled>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
