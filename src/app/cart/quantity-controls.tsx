"use client";

import { useTransition } from "react";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../lib/cart-actions";

type Props = {
  productId: string;
  quantity: number;
};

export function CartQuantityControls({ productId, quantity }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            if (quantity <= 1) {
              await removeFromCart(productId);
            } else {
              await updateCartItemQuantity(productId, quantity - 1);
            }
          });
        }}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        -
      </button>

      <span className="min-w-8 text-center">{quantity}</span>

      <button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await updateCartItemQuantity(productId, quantity + 1);
          });
        }}
        className="rounded border px-3 py-1 disabled:opacity-50"
      >
        +
      </button>

      <button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await removeFromCart(productId);
          });
        }}
        className="ml-4 text-sm underline disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
}