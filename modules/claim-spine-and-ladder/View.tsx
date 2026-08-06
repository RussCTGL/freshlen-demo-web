import { stats, order, bands, races, deferred } from "./data";

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">
        The first end-to-end claim: <code>create → evaluate → review → GET</code>, with the
        expensive model call pinned to the end and auto-approve switched off by arithmetic that
        cannot be satisfied.
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

      {/* Order of operations */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Order of operations — the model runs fifth, not first
        </h3>
        <ol className="mt-3 space-y-1.5">
          {order.map((o, i) => (
            <li
              key={o.step}
              className={`flex items-baseline gap-3 rounded-lg border border-border bg-surface px-3 py-2 text-sm ${
                i === 4 ? "border-l-4 border-l-brand" : ""
              }`}
            >
              <span className="w-4 shrink-0 font-mono text-xs text-faint">{i + 1}</span>
              <span className={i === 4 ? "font-semibold" : ""}>{o.step}</span>
              {o.note && <span className="font-mono text-xs text-muted">— {o.note}</span>}
            </li>
          ))}
        </ol>
      </div>

      {/* The ladder */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          The four-band ladder — first match wins
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-xs uppercase tracking-widest text-faint">
                <th className="py-2 pr-3 font-medium">Band</th>
                <th className="py-2 pr-3 font-medium">Condition</th>
                <th className="py-2 pr-3 font-medium">Outcome</th>
                <th className="py-2 font-medium">Reason code</th>
              </tr>
            </thead>
            <tbody>
              {bands.map((b) => (
                <tr
                  key={b.band}
                  className={`border-b border-border align-top ${
                    b.band === "2" ? "bg-brand-tint" : ""
                  }`}
                >
                  <td className="py-2 pr-3 font-mono text-xs">{b.band}</td>
                  <td className="py-2 pr-3 font-mono text-xs text-muted">{b.condition}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{b.outcome}</td>
                  <td className="py-2 font-mono text-xs text-muted">{b.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 rounded border border-border px-4 py-3 text-sm text-muted">
          Band 2 is the calibration gate. <code>min_confidence_for_auto</code> ships at{" "}
          <code>2.0</code>, which is unreachable on a 0–1 confidence scale — so band 3 is dead code
          and every claim routes to <code>human_review</code>. Disabled by{" "}
          <span className="font-semibold text-foreground">math, not a boolean</span>, so it cannot
          be flipped by accident. Turning it on later is a config change, not a code change.
        </p>
      </div>

      {/* Races */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Two concurrency races, found before the PR and fixed in it
        </h3>
        <ul className="mt-3 space-y-2">
          {races.map((r) => (
            <li
              key={r.title}
              className="rounded-lg border border-border border-l-4 border-l-danger bg-surface p-3 text-sm"
            >
              <div className="font-semibold">{r.title}</div>
              <div className="mt-1 text-muted">{r.detail}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          Deferred, not dropped
        </p>
        <p className="mt-2 text-muted">{deferred}</p>
      </div>

      <p className="text-sm font-semibold">PR #46 and PR #50 — both merged to main.</p>
    </section>
  );
}
