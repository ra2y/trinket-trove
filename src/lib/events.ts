import { db } from "./db";

type EventMap = {
  product_list_viewed: {
    search?: string;
    category?: string;
    resultsCount: number;
  };
  product_viewed: {
    productId: string;
    slug: string;
    category: string;
    price: number;
  };
  search_performed: {
    query: string;
    resultsCount: number;
  };
  filter_applied: {
    filterType: "category";
    value: string;
    resultsCount: number;
  };
};

type EventName = keyof EventMap;

export async function trackEvent<T extends EventName>(
  name: T,
  properties: EventMap[T],
  meta?: {
    userId?: string;
    sessionId?: string;
    pathname?: string;
    source?: "web" | "server" | "job";
  }
) {
  return db.event.create({
    data: {
      name,
      userId: meta?.userId,
      sessionId: meta?.sessionId,
      pathname: meta?.pathname,
      source: meta?.source ?? "server",
      properties,
    },
  });
}