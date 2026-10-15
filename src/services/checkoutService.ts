import { supabase } from "../lib/supabase";
import type { CheckoutResponse } from "../types/checkout";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("API URL is missing.");
}

export interface CheckoutItem {
  productId: string;
  quantity: number;
}

export const createCheckoutSession = async (
  items: CheckoutItem[],
): Promise<CheckoutResponse> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error(
      "You must be logged in to continue to checkout.",
    );
  }

  const response = await fetch(
    `${API_URL}/checkout/create-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        items,
      }),
    },
  );

  const data: CheckoutResponse & {
    message?: string;
  } = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to start checkout. Please try again.",
    );
  }

  if (!data.checkoutUrl) {
    throw new Error(
      "Stripe checkout URL was not returned.",
    );
  }

  return data;
};