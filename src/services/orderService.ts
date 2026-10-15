import { supabase } from "../lib/supabase";
import type { GetOrdersResponse } from "../types/order";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getOrders(): Promise<GetOrdersResponse> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("You must be logged in to view your orders.");
  }

  const response = await fetch(`${API_URL}/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      throw new Error(data.message);
    }

    throw new Error("Unable to load orders.");
  }

  return data as GetOrdersResponse;
}