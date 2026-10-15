import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "../../types/cart";

interface CartItemProps {
  item: CartItemType;
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
  onRemove: (productId: string) => void;
}

function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  const itemTotal = (
    (item.product.price * item.quantity) /
    100
  ).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <article className="flex flex-col gap-5 border-b border-[#e5dbd0] py-6 sm:flex-row">
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

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row">
        <div>
          <h2 className="font-semibold text-[#51463d]">
            {item.product.name}
          </h2>

          <p className="mt-1 text-sm text-[#81766b]">
            {(
              item.product.price / 100
            ).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}{" "}
            each
          </p>
        </div>

        <div className="flex items-center justify-between gap-5 sm:justify-end">
          <div className="flex items-center overflow-hidden rounded-lg border border-[#d9cec2] bg-white">
            <button
              type="button"
              onClick={() =>
                onDecrease(item.product.id)
              }
              aria-label={`Decrease ${item.product.name} quantity`}
              className="flex h-9 w-9 items-center justify-center text-[#655b52] transition hover:bg-[#f5eee8] hover:text-[#a65332]"
            >
              <Minus size={15} />
            </button>

            <span className="flex h-9 w-10 items-center justify-center border-x border-[#d9cec2] text-sm font-semibold text-[#51463d]">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                onIncrease(item.product.id)
              }
              aria-label={`Increase ${item.product.name} quantity`}
              className="flex h-9 w-9 items-center justify-center text-[#655b52] transition hover:bg-[#f5eee8] hover:text-[#a65332]"
            >
              <Plus size={15} />
            </button>
          </div>

          <p className="min-w-24 text-right font-semibold text-[#51463d]">
            {itemTotal}
          </p>

          <button
            type="button"
            onClick={() =>
              onRemove(item.product.id)
            }
            aria-label={`Remove ${item.product.name}`}
            className="rounded-lg p-2 text-[#8a7d70] transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default CartItem;