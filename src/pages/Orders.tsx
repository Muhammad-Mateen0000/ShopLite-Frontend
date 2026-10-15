import {
  CalendarDays,
  ChevronRight,
  LoaderCircle,
  Package,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/orderService";
import type { Order, OrderStatus } from "../types/order";

function getStatusStyles(status: OrderStatus) {
  if (status === "paid") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "failed") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function formatStatus(status: OrderStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPrice(price: number) {
  return (price / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getOrders();

        setOrders(data.orders);
      } catch (ordersError) {
        setError(
          ordersError instanceof Error
            ? ordersError.message
            : "Unable to load your orders.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, []);

  return (
    <main className="min-h-[calc(100vh-64px)]">
      {/* Header */}
      <section className="border-b border-[#e8dfd4] bg-[#f3e8dc]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b45f3c]">
            Account
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#51463d]">
            My Orders
          </h1>

          <p className="mt-3 max-w-xl text-[#756b61]">
            View your recent orders and keep track of your purchases.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <LoaderCircle
              size={30}
              className="animate-spin text-[#b45f3c]"
            />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-12 text-center">
            <h2 className="text-xl font-semibold text-red-800">
              Unable to load orders
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3e4d8] text-[#b45f3c]">
              <ShoppingBag size={25} />
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-[#51463d]">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#81766b]">
              You haven't placed any orders yet. Start shopping and your
              orders will appear here.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#b45f3c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#9f5031]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] p-5 transition hover:border-[#d7c4b4] hover:shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f3e4d8] text-[#b45f3c]">
                      <Package size={21} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="font-semibold text-[#51463d]">
                          Order #{order.id.slice(0, 8)}
                        </h2>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyles(
                            order.status,
                          )}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-5 text-sm text-[#81766b]">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={15} />
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6 border-t border-[#e5dbd0] pt-4 sm:border-0 sm:pt-0">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[#8a7d70]">
                        Total
                      </p>

                      <p className="mt-1 text-lg font-bold text-[#b45f3c]">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#d8c7b7] px-3.5 py-2 text-sm font-medium text-[#655b52] transition hover:border-[#b45f3c] hover:text-[#a65332]"
                    >
                      View
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Orders;