import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "../../../lib/products";
import { trackEvent } from "../../../lib/events";
import { AddToCartButton } from "./add-to-cart-button"

function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }
  
  await trackEvent(
  "product_viewed",
  {
    productId: product.id,
    slug: product.slug,
    category: product.category.slug,
    price: product.price,
  },
  {
    pathname: `/products/${product.slug}`,
    source: "server",
  }
);

  return (
    <main className="mx-auto max-w-4xl p-8">
      <Link href="/products" className="mb-6 inline-block text-sm underline">
        Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-square w-full rounded-xl object-cover"
          />
        </div>

        <div>
          <p className="text-sm text-gray-500">{product.category.name}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-lg font-semibold">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 text-gray-700">{product.description}</p>

          <div className="mt-8">
            <AddToCartButton productId={product.id} />
          </div>
        </div>
      </div>
    </main>
  );
}