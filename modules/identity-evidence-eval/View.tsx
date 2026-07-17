import { headline, ledger, passes, fixes, history, totals } from "./data";

const toneBar = {
  good: "bg-brand",
  miss: "bg-warning",
  fraud: "bg-danger",
  watch: "bg-info",
} as const;

const toneText = {
  good: "text-brand",
  miss: "text-warning",
  fraud: "text-danger",
  watch: "text-info",
} as const;

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
      {children}
    </h3>
  );
}

/** The 82-case ledger: one group per ground-truth class, one row per outcome.
 *  Counts and glyphs are printed on every row — tone never carries identity alone. */
function Ledger() {
  const max = Math.max(...ledger.flatMap((g) => g.rows.map((r) => r.count)), 1);
  return (
    <div className="space-y-5">
      {ledger.map((g) => (
        <div key={g.name} className="rounded-lg border border-border bg-surface p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="font-semibold">{g.name}</h4>
            <span className="font-mono text-xs tabular-nums text-faint">{g.total} cases</span>
          </div>
          <p className="mt-1 text-sm text-muted">{g.meaning}</p>
          <ul className="mt-3 space-y-2.5">
            {g.rows.map((r) => (
              <li key={r.label} className="text-sm">
                <div className="flex items-center gap-3">
                  <span aria-hidden className={`w-4 shrink-0 text-center font-mono ${toneText[r.tone]}`}>
                    {r.glyph}
                  </span>
                  <span className="w-56 shrink-0">{r.label}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                    <span
                      className={`block h-2 rounded-full ${toneBar[r.tone]}`}
                      style={{ width: `${(r.count / max) * 100}%` }}
                    />
                  </span>
                  <span className="w-8 shrink-0 text-right font-mono text-sm font-semibold tabular-nums">
                    {r.count}
                  </span>
                </div>
                <p className="ml-7 mt-0.5 text-xs text-faint">{r.note}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function View() {
  return (
    <section className="space-y-10">
      {/* Lede */}
      <p className="text-muted">
        <code>matches_receipt_item</code> decides whether a claim photo shows what the receipt
        says — the check that routes claims to <code>human_review</code>, and the gate any future
        auto-approval would depend on. This eval grades it on {totals.calls} calls
        ({totals.pass1Rows} classifier-reliability photos + {totals.pass2Rows} ground-truthed
        evidence cases), run <strong>Jul 17 with the Claude vision tier live</strong>. The
        classifier <em>predicts</em>; nothing here confirms or guarantees a match — the matcher
        only routes, humans decide.
      </p>

      {/* Headline tiles — each metric is a plain-language question */}
      <div className="grid gap-4 sm:grid-cols-3">
        {headline.map((h) => (
          <div key={h.metric} className="rounded-lg border border-border bg-surface p-4">
            <div className="text-sm font-medium">{h.question}</div>
            <div className="mt-2 font-mono text-3xl font-semibold tabular-nums">{h.value}</div>
            <div className="mt-1 font-mono text-xs uppercase tracking-widest text-faint">
              {h.metric}
            </div>
            <p className="mt-2 text-xs text-muted">{h.detail}</p>
          </div>
        ))}
      </div>

      {/* The ledger — the core result */}
      <div>
        <SectionHeading>The {totals.pass2Rows} ground-truthed cases — every case, once</SectionHeading>
        <p className="mb-4 mt-2 text-sm text-muted">
          Grouped by what the right answer was. Read each group against its own bar: the green
          rows are correct behavior, amber rows are honest claims wrongly failed, the red row is
          fraud exposure (zero), and the blue row is the new over-commitment finding.
        </p>
        <Ledger />
      </div>

      {/* The two passes */}
      <div>
        <SectionHeading>Why two passes — two questions, same comparison</SectionHeading>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {passes.map((p) => (
            <div key={p.name} className="rounded-lg border border-border bg-surface p-4">
              <h4 className="text-sm font-semibold">{p.name}</h4>
              <p className="mt-2 text-sm text-muted">{p.setup}</p>
              <p className="mt-2 text-sm">{p.result}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fix list */}
      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          What to do about it — in order
        </p>
        <div className="mt-3 space-y-3">
          {fixes.map((f) => (
            <div key={f.title}>
              <h4 className="text-sm font-semibold">{f.title}</h4>
              <p className="mt-0.5 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Compressed history */}
      <div>
        <SectionHeading>How we got here — the short version</SectionHeading>
        <ul className="mt-3 space-y-2.5">
          {history.map((h) => (
            <li key={h.date} className="flex gap-3 text-sm">
              <span className="w-24 shrink-0 font-mono text-xs text-faint">{h.date}</span>
              <span className="text-muted">{h.what}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-faint">
        Fail-closed accounting throughout: a withheld answer (<code>match=None</code>) is
        unmeasured, never correct. Advisory only — the model scores and the matcher routes;
        policy and humans make every decision.
      </p>
    </section>
  );
}
