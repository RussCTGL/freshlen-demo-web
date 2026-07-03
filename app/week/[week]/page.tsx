// 🔒 SHELL — one page per program week, with second-level tabs grouped by owner.
// Weeks are derived from module metadata; adding a module never touches this file.

import { notFound } from "next/navigation";
import { formatOwners } from "@/lib/define-module";
import { getWeeks, getOwnersForWeek } from "@/modules/registry";
import { OwnerTabs, type OwnerGroup } from "@/components/OwnerTabs";

export function generateStaticParams() {
  return getWeeks().map((w) => ({ week: String(w) }));
}

export const dynamicParams = false;

export default async function WeekPage({ params }: { params: Promise<{ week: string }> }) {
  const { week: weekParam } = await params;
  const week = Number(weekParam);
  if (!getWeeks().includes(week)) notFound();

  // Strip View (non-serializable) before crossing into the client component.
  const groups: OwnerGroup[] = getOwnersForWeek(week).map((g) => ({
    owner: g.owner,
    modules: g.modules.map((m) => ({
      slug: m.slug,
      title: m.title,
      issue: m.issue,
      summary: m.summary,
      owners: formatOwners(m.owner),
    })),
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-widest text-faint">
        Weekly demo · {groups.length} owner{groups.length === 1 ? "" : "s"}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Week {week}</h1>
      <p className="mt-2 text-sm text-muted">
        Workstreams delivered this week, grouped by owner.
      </p>
      <div className="mt-8">
        <OwnerTabs groups={groups} />
      </div>
    </div>
  );
}
