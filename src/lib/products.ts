import { db } from "../lib/db";

export async function getProducts() {
  return db.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}