import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { getWeeks } from "@/modules/registry";
import { WeekTabs } from "@/components/WeekTabs";
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
        <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
          <nav className="mx-auto flex min-h-12 max-w-5xl flex-wrap items-stretch gap-x-5 px-6">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
              <span aria-hidden className="size-2 rounded-full bg-brand" />
              FreshLens
            </Link>
            <WeekTabs weeks={getWeeks()} />
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
