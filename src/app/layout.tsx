import Link from "next/link";
import "./globals.css";
import { getSessionId } from "../lib/session";
import { getCartBySessionId } from "../lib/cart";

const sessionId = await getSessionId();
const cart = sessionId ? await getCartBySessionId(sessionId) : null;

const cartCount =
  cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <Link href="/" className="text-lg font-bold">
              Trinket Trove
            </Link>

            <div className="flex gap-4">
              <Link href="/products">Products</Link>
             <Link href="/cart" className="relative">
                Cart
                {cartCount > 0 && (
                  <span className="ml-1 text-sm font-semibold">
                    ({cartCount})
                  </span>
                )}
            </Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}