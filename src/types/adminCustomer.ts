export interface AdminCustomer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: "user" | "admin";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  orderCount: number;
  totalSpent: number;
}

export interface AdminCustomersResponse {
  success: boolean;
  customers: AdminCustomer[];
}

export interface AdminCustomerStats {
  orderCount: number;
  totalSpent: number;
}

export interface AdminCustomerOrder {
  id: string;
  status: "pending" | "paid" | "failed";
  total: number;
  created_at: string;
  updated_at: string;
}

export interface AdminCustomerDetailResponse {
  success: boolean;
  customer: AdminCustomer;
  stats: AdminCustomerStats;
  orders: AdminCustomerOrder[];
}