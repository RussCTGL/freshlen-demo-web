import Link from "next/link";
import { getWeeks, modules } from "@/modules/registry";

export default function Home() {
  const weeks = getWeeks();
  const latest = weeks[weeks.length - 1];

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">FreshLens 🍎🔍</h1>
      <p className="mt-4 max-w-xl text-lg text-gray-500">
        The Snap-to-Claim build, one week at a time. Every workstream — calibration, policy,
        skeleton, audit, UX — consolidated into a demo page by its owner.
      </p>
      <p className="mt-2 text-sm text-gray-400">
        {modules.length} workstream{modules.length === 1 ? "" : "s"} across{" "}
        {weeks.length} week{weeks.length === 1 ? "" : "s"} so far.
      </p>
      {latest !== undefined ? (
        <Link
          href={`/week/${latest}`}
          className="mt-10 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Latest: Week {latest} →
        </Link>
      ) : null}
      <p className="mt-6 text-xs text-gray-400">
        Pick a week in the nav to browse by owner.
      </p>
    </div>
  );
}
