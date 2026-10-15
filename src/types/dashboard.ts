export interface DashboardStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
}

export interface SpendingMonth {
  month: string;
  total: number;
}

export interface RecentOrder {
  id: string;
  status: "pending" | "paid" | "failed";
  total: number;
  created_at: string;
}

export interface DashboardData {
  stats: DashboardStats;
  spendingOverLastSixMonths: SpendingMonth[];
  recentOrders: RecentOrder[];
}

export interface DashboardResponse {
  success: boolean;
  dashboard: DashboardData;
}