import { getProducts } from "../lib/products";

function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Mock Store</h1>
      <p className="mb-8 text-gray-600">
        Day 1: products loaded from Postgres with Prisma.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border p-4 shadow-sm"
          >
            <div className="mb-4 aspect-square rounded-lg bg-gray-100" />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {product.category.name}
            </p>
            <p className="mt-3 text-sm text-gray-700">
              {product.description}
            </p>
            <p className="mt-4 text-base font-bold">
              {formatPrice(product.price)}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}