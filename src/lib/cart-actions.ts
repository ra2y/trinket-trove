"use server";

import { revalidatePath } from "next/cache";
import { db } from "./db";
import { ensureSessionId } from "./session";
import { getOrCreateCart, getCartBySessionId } from "./cart";
import { trackEvent } from "./events";

export async function addToCart(productId: string, quantity: number = 1) {
  const sessionId = await ensureSessionId();
  const cart = await getOrCreateCart(sessionId);

  const existingItem = await db.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    include: {
      product: true,
    },
  });

  let updatedQuantity = quantity;
  let unitPrice = 0;

  if (existingItem) {
    const updated = await db.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
      include: {
        product: true,
      },
    });

    updatedQuantity = updated.quantity;
    unitPrice = updated.product.price;
  } else {
    const created = await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });

    updatedQuantity = created.quantity;
    unitPrice = created.product.price;
  }

  await trackEvent(
    "add_to_cart",
    {
      productId,
      quantity,
      unitPrice,
    },
    {
      sessionId,
      pathname: "/cart",
      source: "server",
    }
  );

  revalidatePath("/cart");
  revalidatePath("/products");
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
  const sessionId = await ensureSessionId();
  const cart = await getOrCreateCart(sessionId);

  if (quantity <= 0) {
    await removeFromCart(productId);
    return;
  }

  const item = await db.cartItem.update({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
    data: {
      quantity,
    },
    include: {
      product: true,
    },
  });

  await trackEvent(
    "cart_quantity_updated",
    {
      productId,
      quantity,
      unitPrice: item.product.price,
    },
    {
      sessionId,
      pathname: "/cart",
      source: "server",
    }
  );

  revalidatePath("/cart");
}

export async function removeFromCart(productId: string) {
  const sessionId = await ensureSessionId();
  const cart = await getOrCreateCart(sessionId);

  const existingItem = await db.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (!existingItem) return;

  await db.cartItem.delete({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  await trackEvent(
    "remove_from_cart",
    {
      productId,
      quantity: existingItem.quantity,
    },
    {
      sessionId,
      pathname: "/cart",
      source: "server",
    }
  );

  revalidatePath("/cart");
}

export async function getCurrentCartForPage(sessionId: string) {
  return getCartBySessionId(sessionId);
}