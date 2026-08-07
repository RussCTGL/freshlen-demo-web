// One payload in, two answers out. Both sides already shipped.

import { divergence } from "./data";

export function Divergence() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mx-auto w-fit rounded-md border border-border bg-surface-raised px-3 py-1.5 text-center font-mono text-xs text-muted">
        {divergence.input}
      </div>

      {/* the fork */}
      <svg
        viewBox="0 0 200 34"
        preserveAspectRatio="none"
        aria-hidden
        className="mx-auto mt-1 h-8 w-full max-w-md"
      >
        <path
          d="M100 0 V12 Q100 20 88 20 H26 Q14 20 14 28 V34"
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth="1.2"
        />
        <path
          d="M100 0 V12 Q100 20 112 20 H174 Q186 20 186 28 V34"
          fill="none"
          stroke="var(--color-danger)"
          strokeWidth="1.2"
        />
      </svg>

      <div className="grid gap-3 sm:grid-cols-2">
        {divergence.paths.map((p) => (
          <div
            key={p.side}
            className={`rounded-lg border p-3 ${
              p.bad ? "border-danger/40 bg-danger/5" : "border-brand/40 bg-brand-tint"
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
              {p.side}
            </div>
            <div
              className={`mt-1 text-base font-semibold ${
                p.bad ? "text-danger" : "text-brand-strong"
              }`}
            >
              {p.outcome}
            </div>
            <div className="mt-1.5 text-sm text-muted">{p.how}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
