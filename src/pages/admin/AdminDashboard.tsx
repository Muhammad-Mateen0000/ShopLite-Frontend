import { useEffect, useState } from "react";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { NavLink } from "react-router-dom";

import { getAdminStats } from "../../services/adminService";
import type {
  AdminStats,
  RevenuePoint,
  TopSellingProduct,
} from "../../types/admin";

type RevenuePeriod = "daily" | "weekly" | "monthly";

function AdminDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [stats, setStats] = useState<AdminStats | null>(null);

  const [revenue, setRevenue] = useState<Record<RevenuePeriod, RevenuePoint[]>>(
    {
      daily: [],
      weekly: [],
      monthly: [],
    },
  );

  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);

  const [selectedPeriod, setSelectedPeriod] =
    useState<RevenuePeriod>("monthly");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getAdminStats();

        setStats(data.stats);

        setRevenue({
          daily: data.revenue?.daily ?? [],
          weekly: data.revenue?.weekly ?? [],
          monthly: data.revenue?.monthly ?? [],
        });

        setTopProducts(data.topProducts ?? []);
      } catch (dashboardError) {
        setError(
          dashboardError instanceof Error
            ? dashboardError.message
            : "Failed to load admin dashboard.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const selectedRevenue = revenue[selectedPeriod];

  const formatMoney = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const formatRevenueLabel = (label: string) => {
    if (selectedPeriod === "daily") {
      const date = new Date(label);

      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    }

    return label;
  };

  const navLinks = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: "/admin/products",
      label: "Products",
      icon: Package,
      end: false,
    },
    {
      to: "/admin/orders",
      label: "Orders",
      icon: ShoppingCart,
      end: false,
    },
    {
      to: "/admin/customers",
      label: "Customers",
      icon: Users,
      end: false,
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#f7f3ed]">
      <aside
        className={`hidden shrink-0 border-r border-[#e7ddd2] bg-[#fffdf9] transition-all duration-200 md:block ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex min-h-[calc(100vh-64px)] flex-col">
          <div
            className={`flex items-center border-b border-[#e7ddd2] px-4 py-5 ${
              isSidebarCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <BarChart3 size={20} className="text-[#b45f3c]" />
                <span className="font-semibold text-[#51463d]">
                  Admin Panel
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((current) => !current)}
              aria-label={
                isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
              className="rounded-lg p-2 text-[#655b52] transition hover:bg-[#f5eee8] hover:text-[#a65332]"
            >
              {isSidebarCollapsed ? (
                <ChevronRight size={19} />
              ) : (
                <ChevronLeft size={19} />
              )}
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  title={isSidebarCollapsed ? link.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg py-2.5 text-sm font-medium transition ${
                      isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"
                    } ${
                      isActive
                        ? "bg-[#f3e4d8] text-[#a65332]"
                        : "text-[#655b52] hover:bg-[#f8f1eb] hover:text-[#a65332]"
                    }`
                  }
                >
                  <Icon size={19} />

                  {!isSidebarCollapsed && <span>{link.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#51463d]">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-[#756b62]">
              Overview of your store performance.
            </p>
          </div>

          {isLoading ? (
            <div className="flex min-h-[50vh] items-center justify-center rounded-2xl border border-[#e7ddd2] bg-white">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#e7ddd2] border-t-[#b45f3c]" />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : !stats ? (
            <div className="rounded-2xl border border-[#e7ddd2] bg-white p-8 text-center text-sm text-[#756b62]">
              Dashboard data is unavailable.
            </div>
          ) : (
            <>
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#756b62]">
                      Total Revenue
                    </p>

                    <div className="rounded-lg bg-[#f3e4d8] p-2 text-[#b45f3c]">
                      <DollarSign size={19} />
                    </div>
                  </div>

                  <p className="mt-4 text-2xl font-bold text-[#51463d]">
                    {formatMoney(stats.totalRevenue)}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#756b62]">
                      Total Orders
                    </p>

                    <div className="rounded-lg bg-[#f3e4d8] p-2 text-[#b45f3c]">
                      <ShoppingCart size={19} />
                    </div>
                  </div>

                  <p className="mt-4 text-2xl font-bold text-[#51463d]">
                    {stats.totalOrders}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#756b62]">
                      Customers
                    </p>

                    <div className="rounded-lg bg-[#f3e4d8] p-2 text-[#b45f3c]">
                      <Users size={19} />
                    </div>
                  </div>

                  <p className="mt-4 text-2xl font-bold text-[#51463d]">
                    {stats.totalCustomers}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#756b62]">
                      Today's Sales
                    </p>

                    <div className="rounded-lg bg-[#f3e4d8] p-2 text-[#b45f3c]">
                      <Package size={19} />
                    </div>
                  </div>

                  <p className="mt-4 text-2xl font-bold text-[#51463d]">
                    {formatMoney(stats.todaySales)}
                  </p>
                </div>
              </section>

              <section className="mt-6 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#51463d]">
                      Revenue Over Time
                    </h2>

                    <p className="mt-1 text-sm text-[#756b62]">
                      Store revenue for the selected period.
                    </p>
                  </div>

                  <div className="flex rounded-lg border border-[#d9cec2] bg-[#faf6f1] p-1">
                    {(["daily", "weekly", "monthly"] as RevenuePeriod[]).map(
                      (period) => (
                        <button
                          key={period}
                          type="button"
                          onClick={() => setSelectedPeriod(period)}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                            selectedPeriod === period
                              ? "bg-[#b45f3c] text-white"
                              : "text-[#655b52] hover:text-[#a65332]"
                          }`}
                        >
                          {period}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {selectedRevenue.length === 0 ? (
                  <div className="flex h-80 items-center justify-center text-sm text-[#756b62]">
                    No revenue data available.
                  </div>
                ) : (
                  <div className="mt-6 h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={selectedRevenue}
                        margin={{
                          top: 10,
                          right: 10,
                          left: 0,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis
                          dataKey="label"
                          tickFormatter={formatRevenueLabel}
                          tick={{ fontSize: 12 }}
                        />

                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value: number) => formatMoney(value)}
                        />

                        <Tooltip
                          formatter={(value) => [
                            formatMoney(Number(value ?? 0)),
                            "Revenue",
                          ]}
                          labelFormatter={(label) =>
                            formatRevenueLabel(String(label))
                          }
                        />

                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="#b45f3c"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>

              <section className="mt-6 rounded-2xl border border-[#e7ddd2] bg-white p-5 shadow-sm sm:p-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#51463d]">
                    Top-Selling Products
                  </h2>

                  <p className="mt-1 text-sm text-[#756b62]">
                    Products with the highest sales volume.
                  </p>
                </div>

                {topProducts.length === 0 ? (
                  <div className="py-12 text-center text-sm text-[#756b62]">
                    No product sales data available.
                  </div>
                ) : (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left">
                      <thead>
                        <tr className="border-b border-[#e7ddd2] text-xs uppercase tracking-wide text-[#8a7d72]">
                          <th className="px-3 py-3 font-semibold">Product</th>

                          <th className="px-3 py-3 font-semibold">
                            Quantity Sold
                          </th>

                          <th className="px-3 py-3 font-semibold">Revenue</th>
                        </tr>
                      </thead>

                      <tbody>
                        {topProducts.map((product) => (
                          <tr
                            key={product.product_id}
                            className="border-b border-[#f0e8df] last:border-0"
                          >
                            <td className="px-3 py-4 text-sm font-medium text-[#51463d]">
                              {product.product_name}
                            </td>

                            <td className="px-3 py-4 text-sm text-[#655b52]">
                              {product.total_quantity}
                            </td>

                            <td className="px-3 py-4 text-sm font-medium text-[#51463d]">
                              {formatMoney(product.total_revenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
