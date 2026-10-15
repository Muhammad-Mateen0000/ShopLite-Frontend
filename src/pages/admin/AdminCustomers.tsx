import { useCallback, useEffect, useState } from "react";
import { Eye, RefreshCw } from "lucide-react";
import { getAdminCustomers } from "../../services/adminCustomerService";
import type { AdminCustomer } from "../../types/adminCustomer";

const formatPrice = (amount: number): string => {
  return `$${(amount / 100).toFixed(2)}`;
};

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCustomerName = (
  customer: AdminCustomer,
): string => {
  const fullName =
    `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim();

  return fullName || customer.email;
};

function AdminCustomers() {
  const [customers, setCustomers] = useState<
    AdminCustomer[]
  >([]);

  const [selectedCustomer, setSelectedCustomer] =
    useState<AdminCustomer | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getAdminCustomers();

      setCustomers(response.customers);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load customers.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f7f3ed]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#b45f3c]">
              Admin
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#51463d]">
              Customers
            </h1>

            <p className="mt-1 text-sm text-[#756b62]">
              View customers and their order information.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadCustomers()}
            disabled={isLoading}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#d9cec2] bg-white px-4 py-2 text-sm font-medium text-[#655b52] transition hover:border-[#b45f3c] hover:text-[#a65332] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

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
              onClick={() => void loadCustomers()}
              className="mt-4 rounded-lg bg-[#b45f3c] px-4 py-2 text-sm font-medium text-white"
            >
              Try Again
            </button>
          </div>
        ) : customers.length === 0 ? (
          <div className="rounded-xl border border-[#e7ddd2] bg-white p-10 text-center">
            <p className="text-base font-medium text-[#51463d]">
              No customers found
            </p>

            <p className="mt-1 text-sm text-[#756b62]">
              Customer information will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#e7ddd2] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px]">
                <thead className="border-b border-[#e7ddd2] bg-[#fbf7f2]">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                      Email
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                      Orders
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                      Total Spent
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#756b62]">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eee5dc]">
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="transition hover:bg-[#fffaf6]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {customer.avatar_url ? (
                            <img
                              src={customer.avatar_url}
                              alt={getCustomerName(
                                customer,
                              )}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e4d8] text-sm font-semibold text-[#a65332]">
                              {getCustomerName(
                                customer,
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div>
                            <p className="font-medium text-[#51463d]">
                              {getCustomerName(
                                customer,
                              )}
                            </p>

                            {customer.role ===
                              "admin" && (
                              <span className="text-xs text-[#b45f3c]">
                                Admin
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#655b52]">
                        {customer.email}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-[#51463d]">
                        {customer.orderCount}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-[#51463d]">
                        {formatPrice(
                          customer.totalSpent,
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#655b52]">
                        {formatDate(
                          customer.created_at,
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCustomer(
                              customer,
                            )
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
        )}
      </div>

      {selectedCustomer && (
        <CustomerDetails
          customer={selectedCustomer}
          onClose={() =>
            setSelectedCustomer(null)
          }
        />
      )}
    </main>
  );
}

type CustomerDetailsProps = {
  customer: AdminCustomer;
  onClose: () => void;
};

function CustomerDetails({
  customer,
  onClose,
}: CustomerDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e7ddd2] px-6 py-5">
          <div>
            <p className="text-sm text-[#756b62]">
              Customer
            </p>

            <h2 className="text-xl font-bold text-[#51463d]">
              {getCustomerName(customer)}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#655b52] hover:bg-[#f5eee8]"
          >
            Close
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-center gap-4">
            {customer.avatar_url ? (
              <img
                src={customer.avatar_url}
                alt={getCustomerName(customer)}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f3e4d8] text-xl font-semibold text-[#a65332]">
                {getCustomerName(customer)
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div>
              <p className="font-semibold text-[#51463d]">
                {getCustomerName(customer)}
              </p>

              <p className="text-sm text-[#756b62]">
                {customer.email}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[#fbf7f2] p-4">
              <p className="text-sm text-[#756b62]">
                Total Orders
              </p>

              <p className="mt-1 text-xl font-bold text-[#51463d]">
                {customer.orderCount}
              </p>
            </div>

            <div className="rounded-xl bg-[#fbf7f2] p-4">
              <p className="text-sm text-[#756b62]">
                Total Spent
              </p>

              <p className="mt-1 text-xl font-bold text-[#51463d]">
                {formatPrice(
                  customer.totalSpent,
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-[#756b62]">
                Customer ID
              </span>

              <span className="break-all text-right font-medium text-[#51463d]">
                {customer.id}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-[#756b62]">
                Joined
              </span>

              <span className="font-medium text-[#51463d]">
                {formatDate(customer.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCustomers;