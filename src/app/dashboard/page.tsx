import {
  getDashboardMetrics,
  getFunnelMetrics,
  getTopPurchasedProducts,
  getTopViewedProducts,
} from "../../lib/analytics";
import { db } from "../../lib/db";

function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(priceInCents / 100);
}

function percentage(part: number, total: number) {
  if (total === 0) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

export default async function DashboardPage() {
  const [metrics, topPurchased, topViewed, funnel, recentOrders, recentEvents] =
    await Promise.all([
      getDashboardMetrics(),
      getTopPurchasedProducts(5),
      getTopViewedProducts(5),
      getFunnelMetrics(),
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      db.event.findMany({
        orderBy: { occurredAt: "desc" },
        take: 10,
      }),
    ]);

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold">
            {formatPrice(metrics.totalRevenue)}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-2 text-2xl font-bold">{metrics.totalOrders}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Average Order Value</p>
          <p className="mt-2 text-2xl font-bold">
            {formatPrice(metrics.averageOrderValue)}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Product Views</p>
          <p className="mt-2 text-2xl font-bold">
            {metrics.totalProductViews}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Add to Carts</p>
          <p className="mt-2 text-2xl font-bold">
            {metrics.totalAddToCarts}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Checkout Starts</p>
          <p className="mt-2 text-2xl font-bold">
            {metrics.totalCheckoutStarts}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Add to Cart Rate</p>
          <p className="mt-2 text-2xl font-bold">{metrics.addToCartRate}%</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Checkout Completion Rate</p>
          <p className="mt-2 text-2xl font-bold">
            {metrics.checkoutCompletionRate}%
          </p>
        </div>
      </section>

      <section className="mb-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Top Purchased Products</h2>

          {topPurchased.length === 0 ? (
            <p className="text-gray-500">No purchases yet.</p>
          ) : (
            <div className="space-y-3">
              {topPurchased.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty sold: {product.quantitySold}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Top Viewed Products</h2>

          {topViewed.length === 0 ? (
            <p className="text-gray-500">No product views yet.</p>
          ) : (
            <div className="space-y-3">
              {topViewed.map((product) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between"
                >
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.viewCount} views
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Funnel</h2>

        <div className="space-y-4">
          {funnel.map((step, index) => {
            const previous = index === 0 ? step.count : funnel[index - 1].count;

            return (
              <div key={step.name}>
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-medium">{step.name}</p>
                  <p className="text-sm text-gray-500">
                    {step.count}{" "}
                    {index > 0 && `(${percentage(step.count, previous)})`}
                  </p>
                </div>

                <div className="h-3 w-full rounded bg-gray-200">
                  <div
                    className="h-3 rounded bg-black"
                    style={{
                      width: `${percentage(step.count, funnel[0].count)}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Orders</h2>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="rounded-lg border p-4">
                  <p className="font-medium">{order.email}</p>
                  <p className="text-sm text-gray-500">{order.id}</p>
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
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Events</h2>

          {recentEvents.length === 0 ? (
            <p className="text-gray-500">No events yet.</p>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event) => (
                <div key={event.id} className="rounded-lg border p-4">
                  <p className="font-medium">{event.name}</p>
                  <p className="text-sm text-gray-500">{event.pathname}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(event.occurredAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}