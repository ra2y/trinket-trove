import { db } from "../../lib/db";

function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}

export default async function DashboardPage() {
  const [events, orders] = await Promise.all([
    db.event.findMany({
      orderBy: {
        occurredAt: "desc",
      },
      take: 20,
    }),
    db.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Recent Orders</h2>

        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border p-4">
                <p className="font-medium">{order.email}</p>
                  <a
                    href={`/orders/${order.id}`}
                    className="text-sm text-blue-600 underline"
                  >
                    {order.id}
                  </a>
                <p className="mt-1 text-sm">
                  Items: {order.itemCount} · Total: {formatPrice(order.total)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Recent Events</h2>

        {events.length === 0 ? (
          <p className="text-gray-500">No events yet.</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="rounded-lg border p-4">
                <p className="font-semibold">{event.name}</p>
                <p className="text-sm text-gray-500">{event.pathname}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(event.occurredAt).toLocaleString()}
                </p>
                <pre className="mt-2 overflow-x-auto text-sm">
                  {JSON.stringify(event.properties, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}