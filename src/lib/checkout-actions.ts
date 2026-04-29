"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { getSessionId } from "./session";
import { clearCart, getCartBySessionId } from "./cart";
import { trackEvent } from "./events";

export async function placeOrder(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    throw new Error("Email is required.");
  }

  const sessionId = await getSessionId();

  if (!sessionId) {
    throw new Error("No active cart session found.");
  }

  const cart = await getCartBySessionId(sessionId);

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const order = await db.order.create({
    data: {
      sessionId,
      email,
      status: "confirmed",
      total,
      itemCount,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          unitPrice: item.product.price,
          quantity: item.quantity,
          subtotal: item.quantity * item.product.price,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  await trackEvent(
    "order_created",
    {
      orderId: order.id,
      total: order.total,
      itemCount: order.itemCount,
    },
    {
      sessionId,
      pathname: "/checkout",
      source: "server",
    }
  );

  await trackEvent(
    "checkout_completed",
    {
      orderId: order.id,
      total: order.total,
      itemCount: order.itemCount,
    },
    {
      sessionId,
      pathname: "/checkout",
      source: "server",
    }
  );

  for (const item of order.items) {
    await trackEvent(
      "order_item_purchased",
      {
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      },
      {
        sessionId,
        pathname: "/checkout",
        source: "server",
      }
    );
  }

  await clearCart(cart.id);

  revalidatePath("/cart");
  revalidatePath("/dashboard");
  revalidatePath("/products");

  redirect(`/orders/${order.id}`);
}