import { supabase } from "../lib/supabase";
import type { DashboardResponse } from "../types/dashboard";

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

export const getUserDashboard =
  async (): Promise<DashboardResponse> => {
    const token = await getAccessToken();

    const response = await fetch(
      `${API_URL}/dashboard/user`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = (await response.json()) as
      | DashboardResponse
      | { message?: string };

    if (!response.ok) {
      throw new Error(
        "message" in data && data.message
          ? data.message
          : "Failed to load dashboard.",
      );
    }

    if (
      !("dashboard" in data) ||
      !data.dashboard
    ) {
      throw new Error(
        "Dashboard data is unavailable.",
      );
    }

    return data;
  };