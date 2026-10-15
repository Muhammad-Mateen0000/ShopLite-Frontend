import { supabase } from "../lib/supabase";
import type { AdminCustomersResponse } from "../types/adminCustomer";

const API_URL = import.meta.env.VITE_API_URL;

const getAccessToken = async (): Promise<string> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Authentication session not found.");
  }

  return session.access_token;
};

export const getAdminCustomers =
  async (): Promise<AdminCustomersResponse> => {
    const token = await getAccessToken();

    const response = await fetch(
      `${API_URL}/admin/customers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = (await response.json()) as
      | AdminCustomersResponse
      | { message?: string };

    if (!response.ok) {
      throw new Error(
        "message" in data && data.message
          ? data.message
          : "Failed to load customers.",
      );
    }

    return data as AdminCustomersResponse;
  };