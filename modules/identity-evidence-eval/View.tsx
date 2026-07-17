import {
  matcherFloor,
  pass1,
  pass2,
  subfloorBins,
  subfloorTotal,
  hypothetical,
  hypoPrecision,
  hypoRecall,
  hypoMisses,
  liveRuns,
  rerun,
  rerunOutcomes,
} from "./data";

const pct = (part: number, whole: number) =>
  whole ? `${Math.round((100 * part) / whole)}%` : "n/a";

/** Stacked agree/disagree bar per confidence bin. Counts are always printed beside
 *  the marks, so identity never rides on color alone. */
function SubfloorChart() {
  const maxTotal = Math.max(...subfloorBins.map((b) => b.agree + b.disagree), 1);
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Prediction vs. human label, by confidence (all rows &lt; {matcherFloor.toFixed(2)})
        </h3>
        <div className="flex shrink-0 items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand" /> agrees
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-danger" /> disagrees
          </span>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {subfloorBins.map((b) => {
          const total = b.agree + b.disagree;
          return (
            <li key={b.bin} className="flex items-center gap-3 text-sm">
              <span className="w-20 shrink-0 font-mono text-xs tabular-nums text-muted">
                {b.bin}
              </span>
              <span className="flex h-2 flex-1 gap-[2px] overflow-hidden">
                {total === 0 ? (
                  <span className="h-2 w-full rounded-full bg-border" />
                ) : (
                  <>
                    {b.agree > 0 && (
                      <span
                        className="h-2 rounded-full bg-brand"
                        style={{ width: `${(b.agree / maxTotal) * 100}%` }}
                      />
                    )}
                    {b.disagree > 0 && (
                      <span
                        className="h-2 rounded-full bg-danger"
                        style={{ width: `${(b.disagree / maxTotal) * 100}%` }}
                      />
                    )}
                  </>
                )}
              </span>
              <span className="w-24 shrink-0 text-right font-mono text-xs tabular-nums text-faint">
                {total === 0 ? "no rows" : `${b.agree} / ${b.disagree}`}
              </span>
              <span className="w-12 shrink-0 text-right font-mono text-xs tabular-nums text-muted">
                {pct(b.agree, total)}
              </span>
            </li>
          );
        })}
        <li className="flex items-center gap-3 border-t border-border pt-2 text-sm">
          <span className="w-20 shrink-0 font-mono text-xs text-muted">all</span>
          <span className="flex-1 text-xs text-faint">
            {subfloorTotal.agree + subfloorTotal.disagree} withheld answers
          </span>
          <span className="w-24 shrink-0 text-right font-mono text-xs tabular-nums text-faint">
            {subfloorTotal.agree} / {subfloorTotal.disagree}
          </span>
          <span className="w-12 shrink-0 text-right font-mono text-xs font-semibold tabular-nums">
            {pct(subfloorTotal.agree, subfloorTotal.agree + subfloorTotal.disagree)}
          </span>
        </li>
      </ul>
    </div>
  );
}

/** One bar per hypothetical outcome; tone marks good / miss / fraud rows, and every
 *  row carries its count and meaning in plain text. */
function HypotheticalChart() {
  const max = Math.max(...hypothetical.map((h) => h.count), 1);
  const toneBg = { good: "bg-brand", miss: "bg-warning", fraud: "bg-danger" } as const;
  return (
    <div>
      <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
        68 ground-truthed rows, scored as if there were no floor
      </h3>
      <ul className="mt-3 space-y-2.5">
        {hypothetical.map((h) => (
          <li key={h.key} className="text-sm">
            <div className="flex items-center gap-3">
              <span className="w-40 shrink-0 font-mono text-xs text-muted">{h.key}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                <span
                  className={`block h-2 rounded-full ${toneBg[h.tone]}`}
                  style={{ width: `${(h.count / max) * 100}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right font-mono text-xs font-semibold tabular-nums">
                {h.count}
              </span>
            </div>
            <p className="ml-[10.75rem] mt-0.5 text-xs text-faint">{h.meaning}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Live claim-flow runs (Jul 17) — one row per scenario, tone-coded with the reason
 *  code always printed, so outcome identity never rides on color alone. */
function LiveVerification() {
  const toneDot = { good: "bg-brand", gap: "bg-warning", gate: "bg-danger" } as const;
  return (
    <div>
      <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
        Live verification · Jul 17 — Claude tier active after #103
      </h3>
      <p className="mt-2 text-sm text-muted">
        The snapshot above is CLIP-only: Claude&apos;s replies arrived wrapped in a markdown fence
        and were discarded as unparseable, so the tier failed closed to 0.0 — a gap this eval
        surfaced and main-repo #103 fixed. With the fix in, real claims were run through{" "}
        <code>evaluate_claim</code> on the demo server:
      </p>
      <ul className="mt-3 space-y-2.5">
        {liveRuns.map((r) => (
          <li key={r.scenario} className="rounded-lg border border-border bg-surface p-3 text-sm">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${toneDot[r.tone]}`} />
              <span className="font-medium">{r.scenario}</span>
              <span className="ml-auto font-mono text-xs text-faint">
                {r.outcome} · {r.reasonCode}
              </span>
            </div>
            <p className="mt-1 pl-5 font-mono text-xs text-muted">{r.identity}</p>
            <p className="mt-1 pl-5 text-xs text-faint">{r.note}</p>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-faint">
        Advisory as ever: the tier predicts and the policy routes — every one of these outcomes
        is a routing decision, and humans make every final call.
      </p>
    </div>
  );
}

/** The Claude-tier re-run (Jul 17) — real outcomes at the shipped floor. Counts and
 *  meanings are printed on every row; tone never carries identity alone. */
function RerunSection() {
  const max = Math.max(...rerunOutcomes.map((o) => o.count), 1);
  const toneBg = {
    good: "bg-brand",
    miss: "bg-warning",
    fraud: "bg-danger",
    watch: "bg-info",
  } as const;
  const p1agreePct = Math.round((100 * rerun.pass1.matchTrue) / rerun.pass1.rows);
  return (
    <div>
      <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
        Re-run · {rerun.date} — the same eval, Claude tier live (real outcomes)
      </h3>
      <p className="mt-2 text-sm text-muted">
        Same script, same {rerun.answered.total} rows, working Claude tier. These are no longer
        sub-floor hypotheticals: the tier answers at 0.85–1.0 confidence, so the matcher
        committed on {rerun.answered.answered} of {rerun.answered.total} calls at the shipped
        0.50 floor ({rerun.answered.withheld} withheld). Pass 1 agreement with the human label:{" "}
        {rerun.pass1.matchTrue}/{rerun.pass1.rows} ({p1agreePct}%), {rerun.pass1.bandNote}.
      </p>

      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Answered (was 0/236)",
            value: `${rerun.answered.answered}/${rerun.answered.total}`,
            note: "the CLIP-only snapshot above withheld everything; the Claude tier commits",
          },
          {
            label: "Precision — now real",
            value: pct(rerun.precision.tp, rerun.precision.tp + rerun.precision.fm),
            note: `${rerun.precision.tp}/${rerun.precision.tp + rerun.precision.fm} matches genuine · 0 fraud fixtures passed, again`,
          },
          {
            label: "Recall on genuine claims",
            value: pct(rerun.recall.tp, rerun.recall.genuine),
            note: rerun.floorPreview,
          },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">{s.label}</div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
            <p className="mt-1 text-xs text-faint">{s.note}</p>
          </div>
        ))}
      </div>

      <ul className="mt-4 space-y-2.5">
        {rerunOutcomes.map((o) => (
          <li key={o.key} className="text-sm">
            <div className="flex items-center gap-3">
              <span className="w-44 shrink-0 font-mono text-xs text-muted">{o.key}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                <span
                  className={`block h-2 rounded-full ${toneBg[o.tone]}`}
                  style={{ width: `${(o.count / max) * 100}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right font-mono text-xs font-semibold tabular-nums">
                {o.count}
              </span>
            </div>
            <p className="ml-[11.75rem] mt-0.5 text-xs text-faint">{o.meaning}</p>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-sm text-muted">
        What changed vs. the snapshot: precision and the zero-fraud result held up for real; the
        #76 normalization gap grew into the single largest fixable miss class (13 of 25 genuine
        misses); and a new behavior surfaced — {rerunOutcomes[5].count} rows where ground truth
        says <em>uncertain</em> but the matcher committed anyway, worth a look before Week 6.
        Advisory as ever: the matcher only routes; humans decide.
      </p>
    </div>
  );
}

export default function View() {
  const totalCalls = pass1.rows + pass2.rows;
  return (
    <section className="space-y-8">
      <p className="text-muted">
        <code>matches_receipt_item</code> is the function <code>evaluate_claim</code> leans on to
        route claims to <code>human_review</code>. This eval grades it by confidence band before
        Week 6 puts it in front of shoppers: Pass 1 re-labels the {pass1.rows}-photo calibration
        set (self-consistency), Pass 2 scores the {pass2.rows} ground-truthed evidence cases from
        the #85 gold set — genuine claims, real mismatches, and deliberate fraud fixtures.
        Accounting is fail-closed: <code>match=None</code> is <strong>unmeasured, never
        correct</strong>. The classifier <em>predicts</em> a produce type; nothing here confirms
        or guarantees a match.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Matcher calls", value: totalCalls },
          { label: `Answered at the ${matcherFloor.toFixed(2)} floor`, value: 0 },
          { label: "Routed fail-closed to review", value: "100%" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">{s.label}</div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      <p className="text-sm text-muted">
        The headline is the empty column: on all {totalCalls} calls the classifier&apos;s
        confidence stayed below the {matcherFloor.toFixed(2)} floor, so the matcher withheld every
        answer and every claim routed to a human — the shipped posture worked exactly as designed
        ({pass2.unmeasuredExpectedUncertain} of Pass 2&apos;s rows were <em>expected</em> to be
        uncertain). The interesting data is therefore the sub-floor diagnostics: what the
        classifier <em>would have said</em>.
      </p>

      <SubfloorChart />

      <p className="text-sm text-muted">
        Agreement is not uniform below the floor — the 0.3–0.4 band holds{" "}
        {subfloorBins[3].agree + subfloorBins[3].disagree} of the{" "}
        {subfloorTotal.agree + subfloorTotal.disagree} rows and agrees with the human label{" "}
        {pct(subfloorBins[3].agree, subfloorBins[3].agree + subfloorBins[3].disagree)} of the
        time, while 0.2–0.3 drops to{" "}
        {pct(subfloorBins[2].agree, subfloorBins[2].agree + subfloorBins[2].disagree)}. That
        cliff, not the current 0.50 line, is where a floor discussion should start.
      </p>

      <HypotheticalChart />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Hypothetical precision",
            value: pct(hypoPrecision.tp, hypoPrecision.tp + hypoPrecision.fm),
            note: `${hypoPrecision.tp}/${hypoPrecision.tp + hypoPrecision.fm} matches genuine · 0 fraud fixtures passed`,
          },
          {
            label: "Recall on genuine claims",
            value: pct(hypoRecall.tp, hypoRecall.genuineMeasured),
            note: `${hypoRecall.tp}/${hypoRecall.genuineMeasured} — the cost side of any lower floor`,
          },
          {
            label: "Misses that aren't vision",
            value: pct(hypoMisses.normalization, hypoMisses.total),
            note: `${hypoMisses.normalization}/${hypoMisses.total} failed on receipt phrasing — the #76 normalization map, fixable in code`,
          },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">{s.label}</div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
            <p className="mt-1 text-xs text-faint">{s.note}</p>
          </div>
        ))}
      </div>

      <LiveVerification />

      <RerunSection />

      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          Finding · for the Week-6 floor discussion
        </p>
        <p className="mt-2">
          At today&apos;s {matcherFloor.toFixed(2)} floor the identity gate adds zero automation:
          every claim goes to a human. Hypothetically unfloored, it passed no fraud fixture
          (0 false matches) but would decline half the genuine claims — and{" "}
          {pct(hypoMisses.normalization, hypoMisses.total)} of those declines are the #76 receipt
          normalization gap, not the vision model. Cheapest first move: extend{" "}
          <code>NORMALIZE_MAP</code>, then re-run this eval before touching any threshold. All of
          this is advisory — the numbers come from {pass2.rows} fixture cases, and the matcher
          only ever routes; humans decide.
        </p>
      </div>
    </section>
  );
}
