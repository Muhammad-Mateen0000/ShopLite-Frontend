import {
  ArrowRight,
  CreditCard,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="border-b border-[#e8dfd4] bg-[#f3e8dc]">
        <div className="mx-auto flex min-h-[540px] max-w-7xl items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-[#dfcdbc] bg-[#fffaf5] px-4 py-2">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-[#b45f3c]" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a65332]">
                Welcome to ShopLite
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#51463d] sm:text-5xl lg:text-[62px]">
              Everything you need,
              <br />
              <span className="text-[#a65332]">all in one place.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#756b61] sm:text-lg">
              Discover products you will love, explore our collection with
              ease, and enjoy a simple shopping experience from browsing to
              checkout.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#b45f3c] px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9f5031] hover:shadow-md sm:w-auto"
              >
                Browse Products
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/products"
                className="inline-flex w-full items-center justify-center rounded-xl border border-[#d8c7b7] bg-[#fffaf5] px-7 py-3.5 text-sm font-semibold text-[#655b52] transition hover:border-[#b45f3c] hover:text-[#a65332] sm:w-auto"
              >
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b45f3c]">
            Why ShopLite
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#51463d] sm:text-3xl">
            A simpler way to shop
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#81766b]">
            Everything is designed to make finding and buying your favourite
            products easier.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {/* Card 1 */}
          <div className="group rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] p-7 transition duration-200 hover:-translate-y-1 hover:border-[#d6c2b0] hover:shadow-[0_10px_30px_rgba(90,70,55,0.06)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e4d8] text-[#a65332] transition group-hover:bg-[#ead8c8]">
              <Search size={21} strokeWidth={1.8} />
            </div>

            <h2 className="mt-6 text-lg font-semibold text-[#51463d]">
              Find What You Need
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#756b61]">
              Search, filter and sort products easily to find exactly what
              you are looking for.
            </p>

            <div className="mt-5 h-px w-10 bg-[#d8c1ae] transition-all duration-200 group-hover:w-16" />
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] p-7 transition duration-200 hover:-translate-y-1 hover:border-[#d6c2b0] hover:shadow-[0_10px_30px_rgba(90,70,55,0.06)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e4d8] text-[#a65332] transition group-hover:bg-[#ead8c8]">
              <CreditCard size={21} strokeWidth={1.8} />
            </div>

            <h2 className="mt-6 text-lg font-semibold text-[#51463d]">
              Simple Checkout
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#756b61]">
              Add your favourites to the cart and complete your purchase
              through a simple Stripe checkout.
            </p>

            <div className="mt-5 h-px w-10 bg-[#d8c1ae] transition-all duration-200 group-hover:w-16" />
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl border border-[#e5dbd0] bg-[#fffdf9] p-7 transition duration-200 hover:-translate-y-1 hover:border-[#d6c2b0] hover:shadow-[0_10px_30px_rgba(90,70,55,0.06)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f3e4d8] text-[#a65332] transition group-hover:bg-[#ead8c8]">
              <ShieldCheck size={21} strokeWidth={1.8} />
            </div>

            <h2 className="mt-6 text-lg font-semibold text-[#51463d]">
              Secure Shopping
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#756b61]">
              Your checkout is handled securely through Stripe for a safe and
              reliable payment experience.
            </p>

            <div className="mt-5 h-px w-10 bg-[#d8c1ae] transition-all duration-200 group-hover:w-16" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;