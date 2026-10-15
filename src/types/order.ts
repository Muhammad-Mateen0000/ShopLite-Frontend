export type OrderStatus = "pending" | "paid" | "failed";

export interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  stripe_session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetOrdersResponse {
  success: boolean;
  orders: Order[];
}