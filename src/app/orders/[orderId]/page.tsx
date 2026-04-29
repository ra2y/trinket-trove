import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "../../../lib/db";

function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await db.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="rounded-xl border p-8">
        <p className="text-sm text-gray-500">Order confirmed</p>
        <h1 className="mt-2 text-3xl font-bold">Thanks for your order</h1>
        <p className="mt-4 text-gray-600">
          Your mock order has been placed successfully.
        </p>

        <div className="mt-6 space-y-2 text-sm">
          <p>
            <span className="font-medium">Order ID:</span> {order.id}
          </p>
          <p>
            <span className="font-medium">Email:</span> {order.email}
          </p>
          <p>
            <span className="font-medium">Items:</span> {order.itemCount}
          </p>
          <p>
            <span className="font-medium">Total:</span>{" "}
            {formatPrice(order.total)}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold">Items</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    Qty {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(item.subtotal)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/products" className="rounded-lg border px-4 py-2">
            Continue shopping
          </Link>
          <Link href="/dashboard" className="rounded-lg border px-4 py-2">
            View dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}