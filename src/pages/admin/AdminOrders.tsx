import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
} from "lucide-react";
import {
  getAdminOrders,
  type AdminOrderFilters,
} from "../../services/adminOrderService";
import type {
  AdminOrder,
  AdminOrderStatus,
} from "../../types/adminOrder";

const formatPrice = (amount: number): string => {
  return `$${(amount / 100).toFixed(2)}`;
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );
};

const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );
};

const getCustomerName = (
  order: AdminOrder,
): string => {
  const profile = order.profiles;

  if (!profile) {
    return "Unknown Customer";
  }

  const fullName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim();

  return fullName || profile.email;
};

const statusClass = (
  status: AdminOrderStatus,
): string => {
  if (status === "paid") {
    return "bg-green-100 text-green-700";
  }

  if (status === "failed") {
    return "bg-red-100 text-red-700";
  }

  return "bg-yellow-100 text-yellow-700";
};

function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);

  const [filters, setFilters] =
    useState<AdminOrderFilters>({
      status: "",
      startDate: "",
      endDate: "",
      page: 1,
      limit: 10,
    });

  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAdminOrders(filters);

      setOrders(response.orders);
      setTotalPages(
        Math.max(response.pagination.totalPages, 1),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load orders.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const handleStatusChange = (
    status: AdminOrderStatus | "",
  ) => {
    setFilters((current) => ({
      ...current,
      status,
      page: 1,
    }));
  };

  const handleStartDateChange = (
    startDate: string,
  ) => {
    setFilters((current) => ({
      ...current,
      startDate,
      page: 1,
    }));
  };

  const handleEndDateChange = (
    endDate: string,
  ) => {
    setFilters((current) => ({
      ...current,
      endDate,
      page: 1,
    }));
  };

  const handlePreviousPage = () => {
    setFilters((current) => ({
      ...current,
      page: Math.max(current.page - 1, 1),
    }));
  };

  const handleNextPage = () => {
    setFilters((current) => ({
      ...current,
      page: Math.min(current.page + 1, totalPages),
    }));
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f7f3ed]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#b45f3c]">
              Admin
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#51463d]">
              Orders
            </h1>

            <p className="mt-1 text-sm text-[#756b62]">
              View and filter all customer orders.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadOrders()}
            disabled={isLoading}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#d9cec2] bg-white px-4 py-2 text-sm font-medium text-[#655b52] transition hover:border-[#b45f3c] hover:text-[#a65332] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <section className="mb-6 rounded-xl border border-[#e7ddd2] bg-white p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label
                htmlFor="order-status"
                className="mb-2 block text-sm font-medium text-[#51463d]"
              >
                Status
              </label>

              <select
                id="order-status"
                value={filters.status}
                onChange={(event) =>
                  handleStatusChange(
                    event.target.value as
                      | AdminOrderStatus
                      | "",
                  )
                }
                className="w-full rounded-lg border border-[#d9cec2] bg-white px-3 py-2.5 text-sm text-[#51463d] outline-none focus:border-[#b45f3c]"
              >
                <option value="">All Statuses</option>
                <option value="pending">
                  Pending
                </option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="start-date"
                className="mb-2 block text-sm font-medium text-[#51463d]"
              >
                Start Date
              </label>

              <input
                id="start-date"
                type="date"
                value={filters.startDate}
                onChange={(event) =>
                  handleStartDateChange(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-[#d9cec2] bg-white px-3 py-2.5 text-sm text-[#51463d] outline-none focus:border-[#b45f3c]"
              />
            </div>

            <div>
              <label
                htmlFor="end-date"
                className="mb-2 block text-sm font-medium text-[#51463d]"
              >
                End Date
              </label>

              <input
                id="end-date"
                type="date"
                value={filters.endDate}
                onChange={(event) =>
                  handleEndDateChange(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-[#d9cec2] bg-white px-3 py-2.5 text-sm text-[#51463d] outline-none focus:border-[#b45f3c]"
              />
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-[#e7ddd2] bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e7ddd2] border-t-[#b45f3c]" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadOrders()}
              className="mt-4 rounded-lg bg-[#b45f3c] px-4 py-2 text-sm font-medium text-white"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl border border-[#e7ddd2] bg-white p-10 text-center">
            <p className="text-base font-medium text-[#51463d]">
              No orders found
            </p>

            <p className="mt-1 text-sm text-[#756b62]">
              Try changing the selected filters.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-[#e7ddd2] bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="border-b border-[#e7ddd2] bg-[#fbf7f2]">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                        Order
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                        Date
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                        Total
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                        Details
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#eee5dc]">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition hover:bg-[#fffaf6]"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-[#51463d]">
                            #{order.id.slice(0, 8)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-[#51463d]">
                            {getCustomerName(order)}
                          </p>

                          <p className="text-xs text-[#756b62]">
                            {order.profiles?.email ??
                              "No email"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#655b52]">
                          {formatDate(
                            order.created_at,
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-[#51463d]">
                          {formatPrice(order.total)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(
                              order.status,
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedOrder(order)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-[#d9cec2] px-3 py-2 text-sm font-medium text-[#655b52] transition hover:border-[#b45f3c] hover:text-[#a65332]"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-5 flex items-center justify-between rounded-xl border border-[#e7ddd2] bg-white px-4 py-3">
              <p className="text-sm text-[#756b62]">
                Page {filters.page} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={filters.page === 1}
                  className="rounded-lg border border-[#d9cec2] p-2 text-[#655b52] transition hover:border-[#b45f3c] hover:text-[#a65332] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={
                    filters.page >= totalPages
                  }
                  className="rounded-lg border border-[#d9cec2] p-2 text-[#655b52] transition hover:border-[#b45f3c] hover:text-[#a65332] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e7ddd2] px-6 py-5">
              <div>
                <p className="text-sm text-[#756b62]">
                  Order
                </p>

                <h2 className="text-xl font-bold text-[#51463d]">
                  #{selectedOrder.id.slice(0, 8)}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#655b52] hover:bg-[#f5eee8]"
              >
                Close
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-[#fbf7f2] p-4">
                  <p className="text-xs text-[#756b62]">
                    Customer
                  </p>
                  <p className="mt-1 font-medium text-[#51463d]">
                    {getCustomerName(
                      selectedOrder,
                    )}
                  </p>
                </div>

                <div className="rounded-lg bg-[#fbf7f2] p-4">
                  <p className="text-xs text-[#756b62]">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(
                      selectedOrder.status,
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="rounded-lg bg-[#fbf7f2] p-4">
                  <p className="text-xs text-[#756b62]">
                    Total
                  </p>

                  <p className="mt-1 font-semibold text-[#51463d]">
                    {formatPrice(
                      selectedOrder.total,
                    )}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-[#756b62]">
                  Customer Email
                </p>

                <p className="font-medium text-[#51463d]">
                  {selectedOrder.profiles?.email ??
                    "No email"}
                </p>
              </div>

              <div>
                <p className="mb-3 font-semibold text-[#51463d]">
                  Order Items
                </p>

                <div className="divide-y divide-[#eee5dc] rounded-xl border border-[#e7ddd2]">
                  {selectedOrder.order_items.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 p-4"
                      >
                        <div>
                          <p className="font-medium text-[#51463d]">
                            {item.products?.name ??
                              "Product"}
                          </p>

                          <p className="mt-1 text-sm text-[#756b62]">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold text-[#51463d]">
                          {formatPrice(
                            item.price *
                              item.quantity,
                          )}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="grid gap-3 text-sm text-[#756b62]">
                <div className="flex justify-between">
                  <span>Created</span>
                  <span>
                    {formatDateTime(
                      selectedOrder.created_at,
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Updated</span>
                  <span>
                    {formatDateTime(
                      selectedOrder.updated_at,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminOrders;