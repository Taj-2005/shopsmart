"use client";

export function SortBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-[var(--muted)]">
        <span className="font-medium text-[var(--foreground)]">6</span> products
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-[var(--muted)]">
          Sort by
        </label>
        <select
          id="sort"
          name="sort"
          className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/20"
          aria-label="Sort products by"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
