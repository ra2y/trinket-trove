import { db } from "./db";

export async function getProducts({
  search,
  category,
}: {
  search?: string;
  category?: string;
} = {}) {
  return db.product.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        category
          ? {
              category: {
                slug: category,
              },
            }
          : {},
      ],
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getProductBySlug(slug: string) {
  return db.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });
}

export async function getCategories() {
  return db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}