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
    return <p className="text-sm text-muted">No modules in this week yet.</p>;
  }
  const current = groups[Math.min(active, groups.length - 1)];

  return (
    <div>
      {/* Owner pills read as a filter row — deliberately distinct from the
          underline tabs used for primary (week) navigation. */}
      <div role="tablist" className="flex flex-wrap gap-2">
        {groups.map((g, i) => (
          <button
            key={g.owner}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              i === active
                ? "border-brand/30 bg-brand-tint font-medium text-brand"
                : "border-transparent text-muted hover:bg-surface-raised hover:text-foreground"
            }`}
          >
            {g.owner}
            <span className="ml-1.5 font-mono text-xs opacity-60">{g.modules.length}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {current.modules.map((m) => (
          <Link
            key={m.slug}
            href={`/${m.slug}`}
            className="rounded-lg border border-border bg-surface p-5 transition hover:border-border-strong hover:bg-surface-raised"
          >
            <div className="flex items-center justify-between gap-3 font-mono text-xs text-faint">
              <span>{m.slug}</span>
              {m.issue ? <span>#{m.issue}</span> : null}
            </div>
            <h3 className="mt-2 font-semibold">{m.title}</h3>
            <p className="mt-1.5 text-sm text-muted">{m.summary}</p>
            <p className="mt-3 text-xs text-faint">Owner: {m.owners}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
