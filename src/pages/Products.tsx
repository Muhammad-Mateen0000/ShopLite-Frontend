import { useEffect, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import ProductFilters from "../components/products/ProductFilters";
import { getProducts } from "../services/productService";
import type {
  Product,
  ProductFilters as ProductFilterValues,
} from "../types/product";

const DEFAULT_FILTERS: ProductFilterValues = {
  search: "",
  minPrice: "",
  maxPrice: "",
  sortBy: "created_at",
  sortOrder: "desc",
  page: 1,
  limit: 8,
};

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] =
    useState<ProductFilterValues>(DEFAULT_FILTERS);

  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getProducts(filters);

        setProducts(response.products);
        setTotalPages(response.pagination.totalPages);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load products.",
        );
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, [filters]);

  const handleFilterChange = (
    field: keyof ProductFilterValues,
    value: string | number,
  ) => {
    setFilters((current) => ({
      ...current,
      [field]: value,
      page:
        field === "page"
          ? Number(value)
          : 1,
    }));
  };

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#51463d]">
          Products
        </h1>

        <p className="mt-2 text-[#81766b]">
          Browse our collection and find something you love.
        </p>
      </div>

      <ProductFilters
        filters={filters}
        onChange={handleFilterChange}
      />

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#e7ddd2] bg-[#fffdf9]"
              >
                <div className="aspect-square animate-pulse bg-[#eee7df]" />

                <div className="space-y-3 p-4">
                  <div className="h-5 animate-pulse rounded bg-[#eee7df]" />
                  <div className="h-5 w-24 animate-pulse rounded bg-[#eee7df]" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-lg font-semibold text-red-700">
              Unable to load products
            </h2>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-[#e7ddd2] bg-[#fffdf9] p-12 text-center">
            <h2 className="text-xl font-semibold text-[#51463d]">
              No products found
            </h2>

            <p className="mt-2 text-sm text-[#81766b]">
              Try changing your search or price filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>

      {!isLoading && !error && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={filters.page === 1}
            onClick={() =>
              handleFilterChange("page", filters.page - 1)
            }
            className="rounded-lg border border-[#d9cec2] bg-[#fffdf9] px-4 py-2 text-sm font-medium text-[#655b52] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="px-3 text-sm font-medium text-[#655b52]">
            Page {filters.page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={filters.page === totalPages}
            onClick={() =>
              handleFilterChange("page", filters.page + 1)
            }
            className="rounded-lg border border-[#d9cec2] bg-[#fffdf9] px-4 py-2 text-sm font-medium text-[#655b52] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

export default Products;