"use client";

export type PriceRange = "any" | "under-2000" | "2000-10000" | "above-10000";
export type RatingFilter = "any" | "4" | "4.5";

export interface ShopFilters {
  category: string;
  priceRange: PriceRange;
  rating: RatingFilter;
  inStockOnly: boolean;
}

const CATEGORY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Electronics", label: "Electronics" },
  { value: "Fashion", label: "Fashion" },
  { value: "Home", label: "Home" },
  { value: "Sports", label: "Sports" },
];

const PRICE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "under-2000", label: "Under ₹2,000" },
  { value: "2000-10000", label: "₹2,000 – ₹10,000" },
  { value: "above-10000", label: "Above ₹10,000" },
];

const RATING_OPTIONS: { value: RatingFilter; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "4", label: "4+ stars" },
  { value: "4.5", label: "4.5+ stars" },
];

interface FiltersSidebarProps {
  filters: ShopFilters;
  onFiltersChange: (f: ShopFilters) => void;
  inline?: boolean;
}

export function FiltersSidebar({ filters, onFiltersChange, inline }: FiltersSidebarProps) {
  const update = (patch: Partial<ShopFilters>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  const content = (
      <div className="sticky top-24 space-y-6 rounded-[var(--radius-lg)] border border-border bg-surface p-6">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Filters
        </h3>
        <div className="space-y-4">
          <fieldset>
            <legend className="text-sm font-medium text-primary">
              Category
            </legend>
            <div className="mt-2 space-y-2">
              {CATEGORY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <input
                    type="radio"
                    name="category"
                    value={opt.value}
                    checked={filters.category === opt.value}
                    onChange={() => update({ category: opt.value })}
                    className="h-4 w-4 border-border text-accent focus:ring-accent"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium text-primary">
              Price
            </legend>
            <div className="mt-2 space-y-2">
              {PRICE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <input
                    type="radio"
                    name="price"
                    value={opt.value}
                    checked={filters.priceRange === opt.value}
                    onChange={() => update({ priceRange: opt.value })}
                    className="h-4 w-4 border-border text-accent focus:ring-accent"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium text-primary">
              Rating
            </legend>
            <div className="mt-2 space-y-2">
              {RATING_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={opt.value}
                    checked={filters.rating === opt.value}
                    onChange={() => update({ rating: opt.value })}
                    className="h-4 w-4 border-border text-accent focus:ring-accent"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium text-primary">
              Availability
            </legend>
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => update({ inStockOnly: e.target.checked })}
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              In stock only
            </label>
          </fieldset>
        </div>
        <button
          type="button"
          onClick={() =>
            onFiltersChange({
              category: "all",
              priceRange: "any",
              rating: "any",
              inStockOnly: false,
            })
          }
          className="w-full rounded-[var(--radius-sm)] border border-border py-2 text-sm font-medium text-primary hover:bg-muted transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
        >
          Clear filters
        </button>
      </div>
  );

  if (inline) {
    return <div className="lg:hidden" aria-label="Filters">{content}</div>;
  }

  return (
    <aside
      className="hidden lg:block w-64 shrink-0"
      aria-label="Filters"
    >
      {content}
    </aside>
  );
}
