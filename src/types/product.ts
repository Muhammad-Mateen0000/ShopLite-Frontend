export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductFilters = {
  search: string;
  minPrice: string;
  maxPrice: string;
  sortBy: "created_at" | "name" | "price";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
};

export type ProductsResponse = {
  success: boolean;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ProductResponse = {
  success: boolean;
  product: Product;
};