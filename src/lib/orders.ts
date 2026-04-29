import { db } from "./db";

export async function getOrderById(orderId: string) {
  return db.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });
}