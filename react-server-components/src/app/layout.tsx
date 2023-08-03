import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";

import "../styles/common.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Test Todo App",
  description: "Some cool description will come soon!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ maxWidth: 750 }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>Todo app header</h3>
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/todo-simple">Simple</Link>
            <Link href="/todo-updates">With Delete</Link>
            <Link href="/todo-updates-better">With Delete Better</Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
