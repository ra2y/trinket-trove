import Link from "next/link";
import { getCurrentCartForPage } from "../../lib/cart-actions";
import { getSessionId } from "../../lib/session";
import { trackEvent } from "../../lib/events";
import { CartQuantityControls } from "./quantity-controls";

function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}

export default async function CartPage() {
  const sessionId = await getSessionId();
  const cart = sessionId ? await getCurrentCartForPage(sessionId) : null;

  const itemCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const subtotal =
    cart?.items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    ) ?? 0;

  if (sessionId) {
    await trackEvent(
      "cart_viewed",
      {
        itemCount,
        subtotal,
      },
      {
        sessionId,
        pathname: "/cart",
        source: "server",
      }
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>

      {!cart || cart.items.length === 0 ? (
        <div className="rounded-lg border p-6">
          <p className="text-gray-600">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-lg border p-4"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-24 w-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h2 className="font-semibold">{item.product.name}</h2>
                  <p className="text-sm text-gray-500">
                    {item.product.category.name}
                  </p>
                  <p className="mt-2 text-sm text-gray-700">
                    {formatPrice(item.product.price)}
                  </p>

                  <div className="mt-4">
                    <CartQuantityControls
                      productId={item.productId}
                      quantity={item.quantity}
                    />
                  </div>
                </div>

                <div className="font-semibold">
                  {formatPrice(item.quantity * item.product.price)}
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="mt-2 flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <Link
                href="/checkout"
                className="mt-6 block w-full rounded-lg border px-4 py-3 text-center font-medium"
              >
                Checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}