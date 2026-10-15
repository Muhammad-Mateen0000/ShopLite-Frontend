export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  todaySales: number;
}

export interface RevenuePoint {
  label: string;
  amount: number;
}

export interface TopSellingProduct {
  product_id: string;
  product_name: string;
  total_quantity: number;
  total_revenue: number;
}

export interface AdminStatsResponse {
  success: boolean;
  stats: AdminStats;
  revenue: {
    daily: RevenuePoint[];
    weekly: RevenuePoint[];
    monthly: RevenuePoint[];
  };
  topProducts: TopSellingProduct[];
}