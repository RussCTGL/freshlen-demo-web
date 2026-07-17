import {
  matcherFloor,
  matchExamples,
  riskSignals,
  highRiskExample,
  type IdentityOutcome,
  type RiskLevel,
} from "./data";

const outcomeLabel: Record<IdentityOutcome, string> = {
  match: "Match",
  mismatch: "Mismatch",
  unknown: "Unknown",
};

const outcomeBadge: Record<IdentityOutcome, string> = {
  match: "border-success/30 bg-success/10 text-success",
  mismatch: "border-danger/30 bg-danger/10 text-danger",
  unknown: "border-warning/30 bg-warning/10 text-warning",
};

const levelLabel: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const levelBadge: Record<RiskLevel, string> = {
  low: "border-success/30 bg-success/10 text-success",
  medium: "border-warning/30 bg-warning/10 text-warning",
  high: "border-danger/30 bg-danger/10 text-danger",
};

function Badge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest ${tone}`}
    >
      {children}
    </span>
  );
}

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">
        <code>#76</code> gives <code>evaluate_claim</code> two independent, advisory signals before
        a claim ever reaches <code>adjudicate()</code>: does the submitted photo&apos;s produce
        classification agree with the receipt&apos;s line item, and does the photo itself carry any
        metadata tells worth a human&apos;s attention. Neither signal decides a claim on its own —
        the matcher can only say match, mismatch, or unknown, and the risk signals only ever route
        to review, never to an automatic decline.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Identity outcomes", value: 3, note: "Match / mismatch / unknown" },
          {
            label: "Confidence floor",
            value: matcherFloor.toFixed(2),
            note: "Low-confidence answers are withheld",
          },
          {
            label: "Risk signals",
            value: 4,
            note: "Metadata / timestamp / background / blur",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">{s.label}</div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
            <p className="mt-1 text-xs text-faint">{s.note}</p>
          </div>
        ))}
      </div>

      {/* --- Identity matcher: representative examples, not graded results --- */}
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            Identity matcher — representative examples
          </h3>
          <span className="text-xs italic text-faint">
            Representative examples, not aggregate evaluation results
          </span>
        </div>
        <ul className="mt-3 space-y-2">
          {matchExamples.map((ex) => (
            <li
              key={ex.key}
              className="rounded-lg border border-border bg-surface p-3 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={outcomeBadge[ex.outcome]}>{outcomeLabel[ex.outcome]}</Badge>
                <span className="font-mono text-xs text-muted">
                  receipt &quot;{ex.receiptLabel}&quot; → normalized{" "}
                  <code>{ex.normalizedLabel}</code>
                </span>
                <span className="font-mono text-xs text-faint">
                  predicted <code>{ex.predictedLabel}</code>
                  {ex.confidence !== null ? ` @ ${ex.confidence.toFixed(2)}` : ""}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-faint">{ex.note}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Photo-risk signals: advisory only --- */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Photo-risk signals
        </h3>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-faint">
              <th className="py-1.5 font-medium">signal</th>
              <th className="py-1.5 font-medium">risk level</th>
              <th className="py-1.5 font-medium">what it flags</th>
            </tr>
          </thead>
          <tbody>
            {riskSignals.map((s) => (
              <tr key={s.key} className="border-b border-border last:border-0">
                <td className="py-2 font-mono text-xs">{s.key}</td>
                <td className="py-2">
                  <Badge tone={levelBadge[s.level]}>{levelLabel[s.level]}</Badge>
                </td>
                <td className="py-2 text-xs text-faint">{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-faint">
          Signals are advisory tells, not verdicts — each one is a reason a human reviewer might
          look closer, never a reason the system declines a claim by itself.
        </p>
      </div>

      {/* --- One representative high-risk result --- */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Representative high-risk result
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-danger/30 border-l-4 border-l-danger bg-danger/5 p-4 text-sm">
          <Badge tone={outcomeBadge[highRiskExample.identityOutcome]}>
            {outcomeLabel[highRiskExample.identityOutcome]}
          </Badge>
          <span className="font-mono text-xs text-muted">
            triggered: {highRiskExample.triggeredSignals.join(", ")}
          </span>
          <span className="ml-auto flex items-center gap-4">
            <span className="text-xs text-faint">
              Risk level:{" "}
              <span className="font-semibold text-danger">
                {levelLabel[highRiskExample.riskLevel]}
              </span>
            </span>
            <span className="text-xs text-faint">
              Route: <span className="font-semibold text-foreground">{highRiskExample.route}</span>
            </span>
          </span>
        </div>
      </div>

      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          Finding
        </p>
        <p className="mt-2">
          Issue #76 separates confirmed mismatches from uncertain classifications. Low-confidence
          or unavailable classifications return <code>match=None</code>. Fraud signals are
          advisory only and never automatically decline a claim.
        </p>
      </div>
    </section>
  );
}
