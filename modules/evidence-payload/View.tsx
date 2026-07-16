"use client";

import { useState } from "react";
import { seam, beforePayload, afterPayload, enumTries, stats, timeline } from "./data";

export default function View() {
  const [selected, setSelected] = useState(enumTries[0].value);
  const active = enumTries.find((t) => t.value === selected) ?? enumTries[0];

  return (
    <section className="space-y-8">
      <p className="text-muted">
        Every adjudicated claim writes one <code>&quot;evaluated&quot;</code> event to the audit
        hash chain (SPEC §1.8). Before issue #80, that event&apos;s fraud/identity/receipt fields
        would have been hand-built at each call site — three chances for the key names to drift
        from what Week 5&apos;s gates (#76 identity, #77 fraud/receipt) actually return.{" "}
        <code>evidence_payload()</code> in <code>src/audit.py</code> is the one typed constructor
        that pins the mapping down, and it validates <code>fraud_risk</code> against a closed
        enum before the event is ever hashed.
      </p>

      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          The naming seam it closes
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-mono text-xs uppercase tracking-wide text-faint">
                <th className="py-1 pr-4 font-medium">evidence_payload() field</th>
                <th className="py-1 pr-4 font-medium">sourced from</th>
                <th className="py-1 font-medium">type</th>
              </tr>
            </thead>
            <tbody>
              {seam.map((row) => (
                <tr key={row.field} className="border-t border-border">
                  <td className="py-1.5 pr-4 font-mono text-brand">{row.field}</td>
                  <td className="py-1.5 pr-4 font-mono text-muted">{row.source}</td>
                  <td className="py-1.5 font-mono text-faint">{row.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-warning/40 border-l-4 border-l-warning bg-surface p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
            Before — hand-built payload
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-black p-3 font-mono text-xs text-zinc-100">
{beforePayload}
          </pre>
          <p className="mt-2 text-xs text-faint">
            No fraud/identity/receipt fields at all — the placeholder shape #78 shipped with while
            #80 was still landing.
          </p>
        </div>

        <div className="rounded-lg border border-success/40 border-l-4 border-l-success bg-surface p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-success">
            After — evidence_payload() wired in
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-black p-3 font-mono text-xs text-zinc-100">
{afterPayload}
          </pre>
          <p className="mt-2 text-xs text-faint">
            src/claims.py, evaluate_claim — live as of PR #96. Nested under an{" "}
            <code>&quot;evidence&quot;</code> key; no change to <code>append_event</code> or{" "}
            <code>verify_audit_chain</code> was needed since <code>payload</code> was already an
            opaque dict.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Try it — fraud_risk is a closed enum
        </p>
        <p className="mt-2 text-sm text-muted">
          <code>_FRAUD_RISK_LEVELS = frozenset({`{"low", "medium", "high"}`})</code>. Pick a value
          below the way a caller would pass it in.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {enumTries.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setSelected(t.value)}
              aria-pressed={t.value === selected}
              className={`rounded-full border px-3 py-1.5 font-mono text-sm transition ${
                t.value === selected
                  ? "border-brand bg-brand-tint font-medium text-brand"
                  : "border-border bg-background text-muted hover:border-brand hover:text-foreground"
              }`}
            >
              fraud_risk=&quot;{t.value}&quot;
            </button>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-border bg-black p-4 font-mono text-xs text-zinc-100">
          <div className="mb-2 text-zinc-500">
            $ evidence_payload(fraud_risk=&quot;{active.value}&quot;, identity_match=True,
            receipt_parse_ok=True)
          </div>
          <span className={active.outcome === "ok" ? "text-success" : "text-danger"}>
            {active.detail}
          </span>
        </div>
      </div>

      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Landing order
        </h3>
        <ul className="mt-3 space-y-3">
          {timeline.map((t) => (
            <li key={t.label} className="rounded-lg border border-border bg-surface-raised p-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{t.label}</span>
                <span className="font-mono text-xs text-faint">{t.date}</span>
              </div>
              <p className="mt-1.5 text-sm text-muted">{t.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-success/30 border-l-4 border-l-success bg-success/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-success">
          Test coverage · PR #94
        </p>
        <p className="mt-2 text-muted">
          {stats.newTests} new tests in <code>tests/test_audit.py</code> ({stats.fileBaseline} →{" "}
          {stats.fileTotal} passing): happy-path chain verification, nested-field tampering
          caught at the correct <code>broken_at</code> index, <code>identity_match=None</code>{" "}
          round-tripping, the bad-enum <code>ValueError</code>, and the wholesale-rewrite test
          extended to compose with evidence payloads. Full suite: {stats.suitePassed} passed,{" "}
          {stats.suiteSkipped} skipped.
        </p>
      </div>
    </section>
  );
}
