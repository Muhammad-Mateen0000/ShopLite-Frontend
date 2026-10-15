import { Link } from "react-router-dom";
import CartItem from "../components/cart/CartItem";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalItems,
    totalAmount,
  } = useCart();

  const formattedTotal = (totalAmount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="border-b border-[#e8dfd4] bg-[#f3e8dc]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b45f3c]">
            Shopping Cart
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#51463d]">Your Cart</h1>

          <p className="mt-3 text-[#756b61]">
            Review your items before checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] px-5 py-16 text-center">
            <h2 className="text-2xl font-semibold text-[#51463d]">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-[#81766b]">
              Add some products to your cart to continue.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-xl bg-[#b45f3c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#9f5031]"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] px-5">
              <div className="flex items-center justify-between border-b border-[#e5dbd0] py-5">
                <h2 className="font-semibold text-[#51463d]">Cart Items</h2>

                <span className="text-sm text-[#81766b]">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>

              {items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] p-6 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-[#51463d]">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#81766b]">Items</span>

                  <span className="font-medium text-[#51463d]">
                    {totalItems}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#e5dbd0] pt-4">
                  <span className="font-semibold text-[#51463d]">Total</span>

                  <span className="text-xl font-bold text-[#b45f3c]">
                    {formattedTotal}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#b45f3c] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#9f5031]"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-[#d8c7b7] px-6 py-3.5 text-sm font-semibold text-[#655b52] transition hover:border-[#b45f3c] hover:text-[#a65332]"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

export default Cart;
