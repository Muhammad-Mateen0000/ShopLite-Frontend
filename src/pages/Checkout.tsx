import { ArrowLeft, CreditCard, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createCheckoutSession } from "../services/checkoutService";

function Checkout() {
  const navigate = useNavigate();

  const { items, totalItems, totalAmount } = useCart();

  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart", { replace: true });
      return;
    }

    setIsLoading(false);
  }, [items.length, navigate]);

  const formattedTotal = (totalAmount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      setError("");

      const checkoutItems = items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const data = await createCheckoutSession(checkoutItems);

      window.location.href = data.checkoutUrl;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start checkout.",
      );

      setIsCheckingOut(false);
    }
  };

  if (isLoading || items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-64px)]">
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoaderCircle size={30} className="animate-spin text-[#b45f3c]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="border-b border-[#e8dfd4] bg-[#f3e8dc]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b45f3c]">
            Checkout
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#51463d]">
            Complete Your Order
          </h1>

          <p className="mt-3 text-[#756b61]">
            Review your order and continue to secure payment.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#756b61] transition hover:text-[#a65332]"
        >
          <ArrowLeft size={17} />
          Back to Cart
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Order Items */}
          <div className="rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] px-5">
            <div className="flex items-center justify-between border-b border-[#e5dbd0] py-5">
              <h2 className="text-lg font-semibold text-[#51463d]">
                Order Items
              </h2>

              <span className="text-sm text-[#81766b]">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>

            <div>
              {items.map((item) => {
                const itemTotal = (
                  (item.product.price * item.quantity) /
                  100
                ).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                });

                const itemPrice = (item.product.price / 100).toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "USD",
                  },
                );

                return (
                  <article
                    key={item.product.id}
                    className="flex flex-col gap-5 border-b border-[#e5dbd0] py-6 last:border-b-0 sm:flex-row"
                  >
                    {/* Product Image - Same as Cart */}
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#eee5dc]">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-2 text-center text-xs text-[#8a7d70]">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Product Information */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="text-base font-semibold text-[#51463d]">
                          {item.product.name}
                        </h3>

                        <p className="mt-1 text-sm text-[#81766b]">
                          {itemPrice} each
                        </p>

                        <div className="mt-3 inline-flex items-center rounded-lg bg-[#f5eee8] px-3 py-1.5 text-xs font-medium text-[#655b52]">
                          Quantity: {item.quantity}
                        </div>
                      </div>

                      {/* Product Total */}
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-medium uppercase tracking-wide text-[#8a7d70]">
                          Item Total
                        </p>

                        <p className="mt-1 text-lg font-bold text-[#51463d]">
                          {itemTotal}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold text-[#51463d]">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#81766b]">Items</span>

                <span className="font-medium text-[#51463d]">{totalItems}</span>
              </div>

              <div className="flex items-center justify-between border-t border-[#e5dbd0] pt-4">
                <span className="font-semibold text-[#51463d]">Total</span>

                <span className="text-xl font-bold text-[#b45f3c]">
                  {formattedTotal}
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#b45f3c] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#9f5031] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckingOut ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Continue to Stripe
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-[#8a7d70]">
              You will be redirected to Stripe Checkout to securely complete
              your payment.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Checkout;
