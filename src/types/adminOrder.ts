export type AdminOrderStatus =
  | "pending"
  | "paid"
  | "failed";

export interface AdminOrderProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export interface AdminOrderProduct {
  id: string;
  name: string;
  image_url: string | null;
}

export interface AdminOrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: AdminOrderProduct | null;
}

export interface AdminOrder {
  id: string;
  user_id: string;
  status: AdminOrderStatus;
  total: number;
  stripe_session_id: string | null;
  created_at: string;
  updated_at: string;
  profiles: AdminOrderProfile | null;
  order_items: AdminOrderItem[];
}

export interface AdminOrdersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminOrdersResponse {
  success: boolean;
  orders: AdminOrder[];
  pagination: AdminOrdersPagination;
}

export interface AdminOrderResponse {
  success: boolean;
  order: AdminOrder;
}