import { db } from "./db";
import { fillMissingDays } from "./time";

export async function getDashboardMetrics() {
  const [orders, events] = await Promise.all([
    db.order.findMany({
      include: {
        items: true,
      },
    }),
    db.event.findMany(),
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const averageOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const totalProductViews = events.filter(
    (event) => event.name === "product_viewed"
  ).length;

  const totalAddToCarts = events.filter(
    (event) => event.name === "add_to_cart"
  ).length;

  const totalCheckoutStarts = events.filter(
    (event) => event.name === "checkout_started"
  ).length;

  const totalCheckoutCompleted = events.filter(
    (event) => event.name === "checkout_completed"
  ).length;

  const addToCartRate =
    totalProductViews > 0
        ? Math.round((totalAddToCarts / totalProductViews) * 100)
        : 0;

  const checkoutCompletionRate =
    totalCheckoutStarts > 0
        ? Math.round((totalCheckoutCompleted / totalCheckoutStarts) * 100)
        : 0;

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    totalProductViews,
    totalAddToCarts,
    totalCheckoutStarts,
    totalCheckoutCompleted,
    addToCartRate,
    checkoutCompletionRate
  };
}

export async function getTopPurchasedProducts(limit: number = 5) {
  const orderItems = await db.orderItem.findMany({
    include: {
      product: true,
    },
  });

  const grouped = new Map<
    string,
    {
      productId: string;
      name: string;
      quantitySold: number;
      revenue: number;
    }
  >();

  for (const item of orderItems) {
    const existing = grouped.get(item.productId);

    if (existing) {
      existing.quantitySold += item.quantity;
      existing.revenue += item.subtotal;
    } else {
      grouped.set(item.productId, {
        productId: item.productId,
        name: item.productName,
        quantitySold: item.quantity,
        revenue: item.subtotal,
      });
    }
  }

  return Array.from(grouped.values())
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, limit);
}

export async function getTopViewedProducts(limit: number = 5) {
  const events = await db.event.findMany({
    where: {
      name: "product_viewed",
    },
  });

  const grouped = new Map<
    string,
    {
      productId: string;
      slug: string;
      viewCount: number;
    }
  >();

  for (const event of events) {
    const props = event.properties as {
      productId?: string;
      slug?: string;
    };

    if (!props.productId || !props.slug) continue;

    const existing = grouped.get(props.productId);

    if (existing) {
      existing.viewCount += 1;
    } else {
      grouped.set(props.productId, {
        productId: props.productId,
        slug: props.slug,
        viewCount: 1,
      });
    }
  }

  const products = await db.product.findMany();

  const productMap = new Map(products.map((p) => [p.id, p.name]));

  return Array.from(grouped.values())
    .map((item) => ({
      ...item,
      name: productMap.get(item.productId) ?? item.slug,
    }))
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, limit);
}

export async function getFunnelMetrics() {
  const events = await db.event.findMany();

  const productViewed = events.filter(
    (event) => event.name === "product_viewed"
  ).length;

  const addToCart = events.filter(
    (event) => event.name === "add_to_cart"
  ).length;

  const checkoutStarted = events.filter(
    (event) => event.name === "checkout_started"
  ).length;

  const checkoutCompleted = events.filter(
    (event) => event.name === "checkout_completed"
  ).length;

  return [
    { name: "Product Viewed", count: productViewed },
    { name: "Add to Cart", count: addToCart },
    { name: "Checkout Started", count: checkoutStarted },
    { name: "Checkout Completed", count: checkoutCompleted },
  ];
}

export async function getRevenueOverTime() {
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  const map = new Map<
    string,
    { date: string; revenue: number; orders: number }
  >();

  for (const order of orders) {
    const date = order.createdAt.toISOString().split("T")[0];

    const existing = map.get(date);

    if (existing) {
      existing.revenue += order.total;
      existing.orders += 1;
    } else {
      map.set(date, {
        date,
        revenue: order.total,
        orders: 1,
      });
    }
  }

  const raw = Array.from(map.values());

  return fillMissingDays(raw, {
    fill: {
      revenue: 0,
      orders: 0,
    },
  });
}

export async function getEventsOverTime() {
  const events = await db.event.findMany({
    orderBy: {
      occurredAt: "asc",
    },
  });

  const map = new Map<string, { date: string; count: number }>();

  for (const event of events) {
    const date = event.occurredAt.toISOString().split("T")[0];

    const existing = map.get(date);

    if (existing) {
      existing.count += 1;
    } else {
      map.set(date, {
        date,
        count: 1,
      });
    }
  }

  return Array.from(map.values());
}