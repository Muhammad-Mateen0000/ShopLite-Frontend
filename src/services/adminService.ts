import { supabase } from "../lib/supabase";
import type { AdminStatsResponse } from "../types/admin";

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
      "You must be logged in to access the admin dashboard.",
    );
  }

  return session.access_token;
}

export async function getAdminStats(): Promise<AdminStatsResponse> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}/admin/stats`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

    throw new Error(
      "Unable to load admin dashboard data.",
    );
  }

  return data as AdminStatsResponse;
}