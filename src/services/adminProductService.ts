import { supabase } from "../lib/supabase";
import type {
  AdminProductResponse,
  CreateProductData,
  DeleteProductResponse,
  UpdateProductData,
  UploadProductImageResponse,
} from "../types/adminProduct";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("API URL is missing.");
}

async function getAccessToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error(
      "You must be logged in to manage products.",
    );
  }

  return session.access_token;
}

async function getErrorMessage(
  response: Response,
): Promise<string> {
  const data: unknown = await response.json();

  if (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return "Unable to complete the product request.";
}

export async function createAdminProduct(
  product: CreateProductData,
): Promise<AdminProductResponse> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${API_URL}/admin/products`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return (await response.json()) as AdminProductResponse;
}

export async function updateAdminProduct(
  productId: string,
  product: UpdateProductData,
): Promise<AdminProductResponse> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${API_URL}/admin/products/${productId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return (await response.json()) as AdminProductResponse;
}

export async function deleteAdminProduct(
  productId: string,
): Promise<DeleteProductResponse> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${API_URL}/admin/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return (await response.json()) as DeleteProductResponse;
}

export async function uploadAdminProductImage(
  productId: string,
  file: File,
): Promise<UploadProductImageResponse> {
  const accessToken = await getAccessToken();

  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(
    `${API_URL}/admin/products/${productId}/image`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  return (await response.json()) as UploadProductImageResponse;
}