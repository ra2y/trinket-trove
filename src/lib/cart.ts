import { db } from "./db";

export async function getOrCreateCart(sessionId: string) {
  let cart = await db.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: { sessionId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  return cart;
}

export async function getCartBySessionId(sessionId: string) {
  return db.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function getCartTotals(sessionId: string) {
  const cart = await getCartBySessionId(sessionId);

  if (!cart) {
    return {
      itemCount: 0,
      subtotal: 0,
    };
  }

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return { itemCount, subtotal };
}