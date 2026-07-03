import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { modules } from "@/modules/registry";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreshLens — Demo",
  description: "Weekly demo visuals for the FreshLens Snap-to-Claim build.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-black/10 dark:border-white/15">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-5 gap-y-2 px-6 py-4 text-sm">
            <Link href="/" className="font-semibold">FreshLens</Link>
            {modules.map((m) => (
              <Link
                key={m.slug}
                href={`/${m.slug}`}
                className="text-gray-500 transition hover:text-gray-900 dark:hover:text-white"
              >
                {m.title}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
