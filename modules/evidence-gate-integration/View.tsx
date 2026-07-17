import { bugsFixed, targetedTests, fullSuite, pipeline, bugs, notDone } from "./data";

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">
        <code>evaluate_claim</code> runs the evidence gate - receipt parse, fraud signals, and
        item-identity match - unconditionally, right before the model call. If the gate fails
        (<code>identity_result[&quot;match&quot;] is False</code> or{" "}
        <code>fraud_signals[&quot;risk_level&quot;] == &quot;high&quot;</code>), the claim routes
        straight to <code>human_review</code> and <code>adjudicate()</code> never runs.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Bugs fixed", value: bugsFixed },
          { label: "Targeted tests", value: targetedTests },
          {
            label: "Full suite after merge",
            value: `${fullSuite.passed} passed, ${fullSuite.skipped} skipped`,
          },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">
              {s.label}
            </div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* The pipeline */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          The wiring - #77 + #76 + #80 into one gate
        </h3>
        <ol className="mt-3 space-y-2">
          {pipeline.map((p, i) => (
            <li
              key={i}
              className="rounded-lg border border-border bg-surface p-3 text-sm"
            >
              <div className="font-semibold">
                {i + 1}. {p.step}
              </div>
              <div className="mt-1 font-mono text-xs text-muted">{p.detail}</div>
            </li>
          ))}
        </ol>
      </div>

      {/* The bugs */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Two integration bugs found end-to-end (no test caught either)
        </h3>
        <ul className="mt-3 space-y-2">
          {bugs.map((b, i) => (
            <li
              key={i}
              className="rounded-lg border border-border border-l-4 border-l-danger bg-surface p-3 text-sm"
            >
              <div className="font-semibold">{b.title}</div>
              <div className="mt-1 text-muted">{b.detail}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Why these calls */}
      <div className="rounded border border-border px-4 py-3 text-sm">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Why the gate runs before the model call, not after
        </h3>
        <p className="mt-2 text-muted">
          AGENTS.md&apos;s non-negotiable #4: <code>analyze_image()</code> (the model call) must
          run strictly last. All three evidence functions run unconditionally first, so a fraud
          or identity failure short-circuits before the most expensive call ever happens - and
          the audit trail seals only the redacted <code>evidence_payload()</code> fields
          (<code>fraud_risk</code>, <code>identity_match</code>, <code>receipt_parse_ok</code>),
          never the raw image or receipt text.
        </p>
      </div>

      {/* What's not done */}
      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          What&apos;s not done - handoff for calibration
        </p>
        <p className="mt-2 text-muted">{notDone.criterion}</p>
        <p className="mt-2 text-muted">{notDone.status}</p>
        <p className="mt-2 text-muted">{notDone.reasoning}</p>
      </div>

      <p className="text-sm font-semibold">PR #96 - merged to main.</p>
    </section>
  );
}
