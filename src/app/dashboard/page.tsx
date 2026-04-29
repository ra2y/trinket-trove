import { db } from "../../lib/db";

export default async function DashboardPage() {
  const events = await db.event.findMany({
    orderBy: {
      occurredAt: "desc",
    },
    take: 20,
  });

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="rounded-lg border p-4">
            <p className="font-semibold">{event.name}</p>
            <p className="text-sm text-gray-500">{event.pathname}</p>
            <pre className="mt-2 overflow-x-auto text-sm">
              {JSON.stringify(event.properties, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </main>
  );
}