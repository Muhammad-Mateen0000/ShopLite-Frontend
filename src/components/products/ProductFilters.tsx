import type { ProductFilters as ProductFilterValues } from "../../types/product";

type ProductFiltersProps = {
  filters: ProductFilterValues;
  onChange: (
    field: keyof ProductFilterValues,
    value: string | number,
  ) => void;
};

function ProductFilters({
  filters,
  onChange,
}: ProductFiltersProps) {
  return (
    <div className="rounded-2xl border border-[#e7ddd2] bg-[#fffdf9] p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="search"
            className="mb-2 block text-sm font-medium text-[#5f554c]"
          >
            Search
          </label>

          <input
            id="search"
            type="text"
            value={filters.search}
            onChange={(event) =>
              onChange("search", event.target.value)
            }
            placeholder="Search products..."
            className="w-full rounded-lg border border-[#d9cec2] bg-white px-3 py-2.5 text-sm text-[#51463d] outline-none focus:border-[#b45f3c] focus:ring-2 focus:ring-[#ead8c8]"
          />
        </div>

        <div>
          <label
            htmlFor="minPrice"
            className="mb-2 block text-sm font-medium text-[#5f554c]"
          >
            Min Price
          </label>

          <input
            id="minPrice"
            type="number"
            min="0"
            value={filters.minPrice}
            onChange={(event) =>
              onChange("minPrice", event.target.value)
            }
            placeholder="e.g. 20"
            className="w-full rounded-lg border border-[#d9cec2] bg-white px-3 py-2.5 text-sm text-[#51463d] outline-none focus:border-[#b45f3c] focus:ring-2 focus:ring-[#ead8c8]"
          />
        </div>

        <div>
          <label
            htmlFor="maxPrice"
            className="mb-2 block text-sm font-medium text-[#5f554c]"
          >
            Max Price
          </label>

          <input
            id="maxPrice"
            type="number"
            min="0"
            value={filters.maxPrice}
            onChange={(event) =>
              onChange("maxPrice", event.target.value)
            }
            placeholder="e.g. 100"
            className="w-full rounded-lg border border-[#d9cec2] bg-white px-3 py-2.5 text-sm text-[#51463d] outline-none focus:border-[#b45f3c] focus:ring-2 focus:ring-[#ead8c8]"
          />
        </div>

        <div>
          <label
            htmlFor="sort"
            className="mb-2 block text-sm font-medium text-[#5f554c]"
          >
            Sort
          </label>

          <select
            id="sort"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(event) => {
              const [sortBy, sortOrder] =
                event.target.value.split("-");

              onChange(
                "sortBy",
                sortBy as ProductFilterValues["sortBy"],
              );

              onChange(
                "sortOrder",
                sortOrder as ProductFilterValues["sortOrder"],
              );
            }}
            className="w-full rounded-lg border border-[#d9cec2] bg-white px-3 py-2.5 text-sm text-[#51463d] outline-none focus:border-[#b45f3c] focus:ring-2 focus:ring-[#ead8c8]"
          >
            <option value="created_at-desc">
              Newest
            </option>
            <option value="created_at-asc">
              Oldest
            </option>
            <option value="name-asc">
              Name A-Z
            </option>
            <option value="name-desc">
              Name Z-A
            </option>
            <option value="price-asc">
              Price Low to High
            </option>
            <option value="price-desc">
              Price High to Low
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;