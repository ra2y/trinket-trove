"use client";

import { useTransition } from "react";
import { addToCart } from "../../../lib/cart-actions";

export function AddToCartButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        startTransition(async () => {
          await addToCart(productId, 1);
        });
      }}
      disabled={isPending}
      className="rounded-lg border px-5 py-3 font-medium disabled:opacity-50"
    >
      {isPending ? "Adding..." : "Add to cart"}
    </button>
  );
}