import Link from "next/link";
import "./globals.css";

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
              <Link href="/cart">Cart</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}