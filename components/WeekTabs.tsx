// 🔒 SHARED — top-level week navigation as underline tabs. Client component:
// the active tab is derived from the pathname, so it receives plain week
// numbers from the server layout (same serialization rule as OwnerTabs).

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function WeekTabs({ weeks }: { weeks: number[] }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 self-stretch">
      {weeks.map((w) => {
        const href = `/week/${w}`;
        const active = pathname === href;
        return (
          <Link
            key={w}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px flex items-center border-b-2 px-3 text-sm transition ${
              active
                ? "border-brand font-medium text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            Week {w}
          </Link>
        );
      })}
    </div>
  );
}
