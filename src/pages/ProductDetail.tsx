import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/product";

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Product not found.");
      setIsLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getProductById(id);

        setProduct(data.product);
      } catch (productError) {
        setProduct(null);

        setError(
          productError instanceof Error
            ? productError.message
            : "Unable to load the product.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [id]);

  const handleDecrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleIncrease = () => {
    setQuantity((current) => current + 1);
  };

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    addToCart(product, quantity);
    navigate("/cart");
  };

  const formattedPrice = product
    ? (product.price / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    : "";

  const formattedTotal = product
    ? ((product.price * quantity) / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    : "";

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-64px)]">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 h-5 w-32 animate-pulse rounded bg-[#e9dfd5]" />

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-[#e9dfd5]" />

            <div className="space-y-5 py-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-[#e9dfd5]" />

              <div className="h-7 w-32 animate-pulse rounded bg-[#e9dfd5]" />

              <div className="space-y-3">
                <div className="h-4 animate-pulse rounded bg-[#eee6de]" />
                <div className="h-4 animate-pulse rounded bg-[#eee6de]" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-[#eee6de]" />
              </div>

              <div className="h-12 w-40 animate-pulse rounded bg-[#e9dfd5]" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-[calc(100vh-64px)]">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#756b61] transition hover:text-[#a65332]"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-12 text-center">
            <h1 className="text-xl font-semibold text-red-800">
              Unable to load product
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error || "The requested product could not be found."}
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-lg bg-[#b45f3c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9f5031]"
            >
              Back to Products
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-64px)]">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#756b61] transition hover:text-[#a65332]"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-2xl border border-[#e5dbd0] bg-[#fffdf9]">
            <div className="aspect-square bg-[#eee5dc]">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#8a7d70]">
                  No image available
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b45f3c]">
              Product Details
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#51463d] sm:text-4xl">
              {product.name}
            </h1>

            <p className="mt-5 text-2xl font-bold text-[#b45f3c]">
              {formattedPrice}
            </p>

            <div className="mt-6 border-t border-[#e5dbd0] pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#655b52]">
                Description
              </h2>

              <p className="mt-3 text-base leading-7 text-[#756b61]">
                {product.description}
              </p>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-semibold text-[#51463d]">
                Quantity
              </p>

              <div className="flex w-fit items-center overflow-hidden rounded-lg border border-[#d9cec2] bg-white">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity === 1}
                  aria-label="Decrease quantity"
                  className="flex h-11 w-11 items-center justify-center text-[#655b52] transition hover:bg-[#f5eee8] hover:text-[#a65332] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={17} />
                </button>

                <span className="flex h-11 w-12 items-center justify-center border-x border-[#d9cec2] text-sm font-semibold text-[#51463d]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={handleIncrease}
                  aria-label="Increase quantity"
                  className="flex h-11 w-11 items-center justify-center text-[#655b52] transition hover:bg-[#f5eee8] hover:text-[#a65332]"
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>

            <div className="mt-8 border-t border-[#e5dbd0] pt-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-[#756b61]">Total</span>

                <span className="text-xl font-bold text-[#51463d]">
                  {formattedTotal}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#b45f3c] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#9f5031] hover:shadow-md"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;
