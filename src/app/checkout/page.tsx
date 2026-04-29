import Link from "next/link";
import { getSessionId } from "../../lib/session";
import { getCartBySessionId } from "../../lib/cart";
import { trackEvent } from "../../lib/events";
import { placeOrder } from "../../lib/checkout-actions";

function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}

export default async function CheckoutPage() {
  const sessionId = await getSessionId();
  const cart = sessionId ? await getCartBySessionId(sessionId) : null;

  if (!cart || cart.items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="mb-4 text-3xl font-bold">Checkout</h1>
        <div className="rounded-lg border p-6">
          <p className="text-gray-600">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block underline">
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  if (sessionId) {
    await trackEvent(
      "checkout_started",
      {
        itemCount,
        cartValue: total,
      },
      {
        sessionId,
        pathname: "/checkout",
        source: "server",
      }
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <form action={placeOrder} className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Contact</h2>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Email</span>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border px-4 py-2"
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            className="mt-6 rounded-lg border px-5 py-3 font-medium"
          >
            Place mock order
          </button>
        </form>

        <aside className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Order Summary</h2>

          <div className="mt-4 space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <div>
                  <p>{item.product.name}</p>
                  <p className="text-gray-500">Qty {item.quantity}</p>
                </div>
                <span>{formatPrice(item.quantity * item.product.price)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between border-t pt-4 font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </main>
  );
}