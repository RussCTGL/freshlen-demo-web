// 🔒 SHARED — second-level tabs on a week page, grouped by owner.
// Client component: receives plain serializable module meta (never View components).

"use client";

import { useState } from "react";
import Link from "next/link";

export type OwnerGroup = {
  owner: string;
  modules: {
    slug: string;
    title: string;
    issue?: number;
    summary: string;
    owners: string; // preformatted byline, e.g. "Lisa & Lezhi"
  }[];
};

export function OwnerTabs({ groups }: { groups: OwnerGroup[] }) {
  const [active, setActive] = useState(0);
  if (groups.length === 0) {
    return <p className="text-sm text-gray-500">No modules in this week yet.</p>;
  }
  const current = groups[Math.min(active, groups.length - 1)];

  return (
    <div>
      <div
        role="tablist"
        className="flex flex-wrap gap-2 border-b border-black/10 pb-3 dark:border-white/15"
      >
        {groups.map((g, i) => (
          <button
            key={g.owner}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              i === active
                ? "bg-emerald-600 text-white"
                : "bg-black/5 text-gray-600 hover:bg-black/10 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20"
            }`}
          >
            {g.owner}
            <span className="ml-1.5 opacity-60">{g.modules.length}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {current.modules.map((m) => (
          <Link
            key={m.slug}
            href={`/${m.slug}`}
            className="rounded-xl border border-black/10 p-5 transition hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-medium">{m.title}</h3>
              {m.issue ? <span className="text-xs text-gray-400">#{m.issue}</span> : null}
            </div>
            <p className="mt-2 text-sm text-gray-500">{m.summary}</p>
            <p className="mt-3 text-xs text-gray-400">Owner: {m.owners}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
