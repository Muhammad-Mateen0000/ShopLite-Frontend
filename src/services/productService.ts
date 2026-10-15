import type {
  ProductResponse,
  ProductsResponse,
  ProductFilters,
} from "../types/product";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("API URL is missing.");
}

const dollarsToCents = (value: string): string => {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    return "";
  }

  return String(Math.round(amount * 100));
};

export const getProducts = async (
  filters: ProductFilters,
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();

  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.minPrice.trim()) {
    const minPriceInCents = dollarsToCents(filters.minPrice);

    if (minPriceInCents) {
      params.set("minPrice", minPriceInCents);
    }
  }

  if (filters.maxPrice.trim()) {
    const maxPriceInCents = dollarsToCents(filters.maxPrice);

    if (maxPriceInCents) {
      params.set("maxPrice", maxPriceInCents);
    }
  }

  params.set("sortBy", filters.sortBy);
  params.set("sortOrder", filters.sortOrder);
  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));

  const response = await fetch(`${API_URL}/products?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load products. Please try again.");
  }

  const data: ProductsResponse = await response.json();

  return data;
};

export const getProductById = async (id: string): Promise<ProductResponse> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load the product. Please try again.");
  }

  const data: ProductResponse = await response.json();

  return data;
};
