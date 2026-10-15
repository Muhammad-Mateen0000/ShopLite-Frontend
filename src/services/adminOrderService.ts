import { supabase } from "../lib/supabase";
import type {
  AdminOrderStatus,
  AdminOrdersResponse,
} from "../types/adminOrder";

const API_URL = import.meta.env.VITE_API_URL;

export interface AdminOrderFilters {
  status: AdminOrderStatus | "";
  startDate: string;
  endDate: string;
  page: number;
  limit: number;
}

const getAccessToken = async (): Promise<string> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Authentication session not found.");
  }

  return session.access_token;
};

export const getAdminOrders = async (
  filters: AdminOrderFilters,
): Promise<AdminOrdersResponse> => {
  const token = await getAccessToken();

  const params = new URLSearchParams();

  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  }

  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  }

  const response = await fetch(
    `${API_URL}/admin/orders?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = (await response.json()) as
    | AdminOrdersResponse
    | { message?: string };

  if (!response.ok) {
    throw new Error(
      "message" in data && data.message
        ? data.message
        : "Failed to load admin orders.",
    );
  }

  return data as AdminOrdersResponse;
};