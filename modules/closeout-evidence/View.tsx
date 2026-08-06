import { stats, divergence, lies, refusal, deviceRows, deviceNote, limits } from "./data";

const toneClass: Record<string, string> = {
  good: "border-l-brand",
  bad: "border-l-danger",
  neutral: "border-l-faint",
};

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">
        Freeze week, so nothing new ships. The work is proving what is true — and being precise
        about the three places where the honest answer is <em>not yet</em>.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">
              {s.label}
            </div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Divergence */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          #177 — same bytes, opposite outcomes, both already on main
        </h3>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-muted">
          {divergence.payload}
        </pre>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {divergence.paths.map((p) => (
            <div
              key={p.path}
              className={`rounded-lg border border-border border-l-4 bg-surface p-3 text-sm ${
                p.bad ? "border-l-danger" : "border-l-brand"
              }`}
            >
              <div className="font-mono text-xs font-semibold">{p.path}</div>
              <div className="mt-1 font-mono text-xs text-muted">{p.result}</div>
              <div className="mt-1.5 font-semibold">{p.outcome}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-lg border border-danger/30 border-l-4 border-l-danger bg-danger/5 p-3 text-sm text-muted">
          {divergence.cost}
        </p>
        <p className="mt-2 rounded border border-border px-4 py-3 text-sm text-muted">
          {divergence.proposal}
        </p>
      </div>

      {/* The checker */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          #164 — three ways my manual check printed a clean diff while broken
        </h3>
        <ul className="mt-3 space-y-2">
          {lies.map((l, i) => (
            <li
              key={l.failure}
              className="flex items-baseline gap-3 rounded-lg border border-border bg-surface p-3 text-sm"
            >
              <span className="w-4 shrink-0 font-mono text-xs text-faint">{i + 1}</span>
              <span>
                <span className="font-semibold">{l.failure}</span>
                <span className="mt-1 block text-muted">{l.why}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded border border-border px-4 py-3 text-sm text-muted">
          {refusal}
        </p>
      </div>

      {/* Device */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Device truth — what the app actually did, on the build actually installed
        </h3>
        <ul className="mt-3 space-y-1.5">
          {deviceRows.map((d) => (
            <li
              key={d.claim}
              className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg border border-border border-l-4 bg-surface px-3 py-2 text-sm ${
                toneClass[d.tone]
              }`}
            >
              <span className="font-medium">{d.claim}</span>
              <span className="font-mono text-xs text-muted">{d.status}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-3 text-sm text-muted">
          {deviceNote}
        </p>
      </div>

      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          What may not be claimed from any of this
        </p>
        <ul className="mt-2 space-y-1.5">
          {limits.map((l) => (
            <li key={l} className="text-muted">
              {l}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm font-semibold">PR #210 and PR #212 — both merged to main.</p>
    </section>
  );
}
