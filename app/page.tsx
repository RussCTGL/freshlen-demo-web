import Link from "next/link";
import { getWeeks, modules } from "@/modules/registry";

export default function Home() {
  const weeks = getWeeks();
  const latest = weeks[weeks.length - 1];

  return (
    <div className="relative overflow-hidden">
      {/* The one decorative flourish in the whole app: a faint emerald glow behind the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_60%_80%_at_50%_-10%,rgba(16,185,129,0.08),transparent)]"
      />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-faint">
          Internal · Weekly demos
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">FreshLens</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          The Snap-to-Claim build, one week at a time. Every workstream — calibration, policy,
          skeleton, audit, UX — consolidated into a demo page by its owner.
        </p>
        <p className="mt-4 font-mono text-xs tracking-wide text-faint">
          {modules.length} workstream{modules.length === 1 ? "" : "s"} ·{" "}
          {weeks.length} week{weeks.length === 1 ? "" : "s"} so far
        </p>
        {latest !== undefined ? (
          <Link
            href={`/week/${latest}`}
            className="mt-10 rounded-full bg-brand-strong px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Latest: Week {latest} →
          </Link>
        ) : null}
        <p className="mt-6 text-xs text-faint">Pick a week in the nav to browse by owner.</p>
      </div>
    </div>
  );
}
