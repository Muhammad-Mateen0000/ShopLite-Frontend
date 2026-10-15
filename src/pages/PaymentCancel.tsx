import { Link } from "react-router-dom";
import { ShoppingCart, XCircle } from "lucide-react";

function PaymentCancel() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f7f3ed] px-4 py-12">
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-2xl border border-[#e7ddd2] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <XCircle size={34} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-[#51463d]">
            Payment Cancelled
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#756b62]">
            Your payment was cancelled. No payment was
            completed. You can return to your cart and try
            again.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#b45f3c] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#9f5031]"
            >
              <ShoppingCart size={17} />
              Return to Cart
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center justify-center rounded-lg border border-[#d9cec2] px-5 py-2.5 text-sm font-medium text-[#655b52] transition hover:border-[#b45f3c] hover:text-[#a65332]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PaymentCancel;