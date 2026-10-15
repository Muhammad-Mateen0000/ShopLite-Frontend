import { Link } from "react-router-dom";
import type { Product } from "../../types/product";

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps) {
  const price = (product.price / 100).toFixed(2);

  return (
    <article className="overflow-hidden rounded-2xl border border-[#e7ddd2] bg-[#fffdf9] transition hover:-translate-y-1 hover:shadow-md">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-[#f3eee8]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#8a7d70]">
              No image
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="line-clamp-1 text-base font-semibold text-[#51463d]">
            {product.name}
          </h2>

          <p className="mt-2 text-lg font-bold text-[#a65332]">
            ${price}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;