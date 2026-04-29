import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-4xl font-bold">Trinket Trove</h1>
      <p className="mt-4 text-gray-600">
        A mock ecommerce store with a TypeScript analytics dashboard.
      </p>

      <div className="mt-8 flex gap-4">
        <Link href="/products" className="rounded-lg border px-4 py-2">
          Shop products
        </Link>
        <Link href="/dashboard" className="rounded-lg border px-4 py-2">
          View dashboard
        </Link>
      </div>
    </main>
  );
}