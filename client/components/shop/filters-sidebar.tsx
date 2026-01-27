"use client";

export function FiltersSidebar() {
  return (
    <aside
      className="hidden lg:block w-64 shrink-0"
      aria-label="Filters and sort"
    >
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
              {["All", "Electronics", "Fashion", "Home"].map((opt) => (
                <label
                  key={opt}
                  className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
                >
                  <input
                    type="radio"
                    name="category"
                    value={opt}
                    defaultChecked={opt === "All"}
                    className="h-4 w-4 border-border text-accent focus:ring-accent"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-medium text-primary">
              Price
            </legend>
            <div className="mt-2 space-y-2">
              {["Any", "Under ₹2,000", "₹2,000 – ₹10,000", "Above ₹10,000"].map(
                (opt) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
                  >
                    <input
                      type="radio"
                      name="price"
                      value={opt}
                      defaultChecked={opt === "Any"}
                      className="h-4 w-4 border-border text-accent focus:ring-accent"
                    />
                    {opt}
                  </label>
                )
              )}
            </div>
          </fieldset>
        </div>
        <button
          type="button"
          className="w-full rounded-[var(--radius-sm)] border border-border py-2 text-sm font-medium text-primary hover:bg-muted transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-accent"
        >
          Clear filters
        </button>
      </div>
    </aside>
  );
}
