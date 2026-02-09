"use client";

export type SortOption = "newest" | "price-asc" | "price-desc" | "rating";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
];

interface SortBarProps {
  count: number;
  sortBy: SortOption;
  onSortChange: (s: SortOption) => void;
}

export function SortBar({ count, sortBy, onSortChange }: SortBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-primary">{count}</span>{" "}
        {count === 1 ? "product" : "products"}
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-muted-foreground">
          Sort by
        </label>
        <select
          id="sort"
          name="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 focus-visible:ring-accent"
          aria-label="Sort products by"
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
