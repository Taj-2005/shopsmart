"use client";

export function SortBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-primary">6</span> products
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-muted-foreground">
          Sort by
        </label>
        <select
          id="sort"
          name="sort"
          className="rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 focus-visible:ring-accent"
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
