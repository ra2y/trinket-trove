import Link from "next/link";
import { getCategories, getProducts } from "../../lib/products";
import { trackEvent } from "../../lib/events";

function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const category = params.category ?? "";

  const [products, categories] = await Promise.all([
    getProducts({ search, category }),
    getCategories(),
  ]);

  await trackEvent(
    "product_list_viewed",
    {
        search: search || undefined,
        category: category || undefined,
        resultsCount: products.length,
    },
    {
        pathname: "/products",
        source: "server",
    }
  );

  if (search) {
    await trackEvent(
        "search_performed",
        {
        query: search,
        resultsCount: products.length,
        },
        {
        pathname: "/products",
        source: "server",
        }
    );
  }

    if (category) {
    await trackEvent(
        "filter_applied",
        {
        filterType: "category",
        value: category,
        resultsCount: products.length,
        },
        {
        pathname: "/products",
        source: "server",
        }
    );
    }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Products</h1>
      <p className="mb-8 text-gray-600">
        Browse, search, and filter the catalog.
      </p>

      <form className="mb-6 flex flex-col gap-4 md:flex-row">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search products..."
          className="w-full rounded-lg border px-4 py-2"
        />

        <select
          name="category"
          defaultValue={category}
          className="rounded-lg border px-4 py-2"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-lg border px-4 py-2 font-medium"
        >
          Apply
        </button>
      </form>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="rounded-xl border p-4 shadow-sm transition hover:shadow-md"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="mb-4 aspect-square w-full rounded-lg object-cover"
              />

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
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}