import { lead, board, findings, numbers, claimLimit, type Verdict } from "./data";

const chip: Record<Verdict, string> = {
  works: "border-brand/40 bg-brand-tint text-brand-strong",
  fails: "border-danger/40 bg-danger/5 text-danger",
  "by-design": "border-border bg-surface-raised text-muted",
  mismatch: "border-warning/40 bg-warning/5 text-warning",
};

const accent: Record<string, string> = {
  danger: "border-l-danger",
  warning: "border-l-warning",
};

export default function View() {
  return (
    <section className="space-y-10">
      {/* Lead */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-faint">
          Freeze week · one job
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{lead}</p>
      </div>

      {/* Verdict board */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Where we actually stand
        </h3>
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {board.map((b) => (
            <li
              key={b.item}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3"
            >
              <span className="text-sm">{b.item}</span>
              <span
                className={`shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-xs ${
                  chip[b.verdict]
                }`}
              >
                {b.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Numbers */}
      <div className="grid gap-4 sm:grid-cols-3">
        {numbers.map((n) => (
          <div key={n.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-3xl font-semibold tabular-nums">{n.value}</div>
            <div className="mt-1 text-sm text-muted">{n.label}</div>
          </div>
        ))}
      </div>

      {/* Findings */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Three things worth someone else&apos;s attention
        </h3>
        <div className="mt-3 space-y-3">
          {findings.map((f) => (
            <div
              key={f.n}
              className={`rounded-lg border border-border border-l-4 bg-surface p-4 ${
                accent[f.tone]
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-faint">{f.n}</span>
                <h4 className="text-base font-semibold leading-snug">{f.title}</h4>
              </div>

              <p className="mt-2 text-sm text-muted">{f.matters}</p>

              <p className="mt-3 border-l-2 border-border pl-3 text-sm">{f.cost}</p>

              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-faint">
                Next
              </p>
              <p className="text-sm text-muted">{f.next}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The boundary */}
      <p className="rounded-lg border border-border bg-surface-raised p-4 text-sm text-muted">
        {claimLimit}
      </p>

      <p className="font-mono text-xs text-faint">
        Detail: issues #164, #177, #226 · PRs #210, #212.
      </p>
    </section>
  );
}
