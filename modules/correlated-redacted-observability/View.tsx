"use client";

import { useState } from "react";
import {
  happyTrace,
  failureTrace,
  recordedFields,
  neverRecordedFields,
  recoveryTable,
  stats,
  timeline,
  type TraceStep,
} from "./data";

const tagStyle: Record<TraceStep["tag"], string> = {
  start: "border-border bg-surface-raised text-foreground",
  normal: "border-border bg-surface-raised text-foreground",
  problem: "border-warning/40 bg-warning/10 text-warning",
  recovered: "border-success/40 bg-success/10 text-success",
};

export default function View() {
  const [showFailure, setShowFailure] = useState(false);
  const steps = showFailure ? failureTrace : happyTrace;

  return (
    <section className="space-y-8">
      <p className="text-muted">
        Every refund claim now gets a flight recorder. Before this, if something went wrong
        partway through a claim, nobody could say exactly what happened or when — like a plane
        with no black box. Now every step is written down automatically, all steps for one claim
        share one ID so they can be strung back together, and the recorder is built so it{" "}
        <em>cannot</em> write down anything sensitive — not by policy, but because the code
        physically refuses to.
      </p>

      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-faint">
            Trace one claim, step by step
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowFailure(false)}
              aria-pressed={!showFailure}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                !showFailure
                  ? "border-brand bg-brand-tint font-medium text-brand"
                  : "border-border bg-background text-muted hover:border-brand hover:text-foreground"
              }`}
            >
              Normal claim
            </button>
            <button
              type="button"
              onClick={() => setShowFailure(true)}
              aria-pressed={showFailure}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                showFailure
                  ? "border-brand bg-brand-tint font-medium text-brand"
                  : "border-border bg-background text-muted hover:border-brand hover:text-foreground"
              }`}
            >
              Something goes wrong
            </button>
          </div>
        </div>

        <ol className="mt-5 space-y-3">
          {steps.map((step, i) => (
            <li key={step.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${tagStyle[step.tag]}`}
                >
                  {i + 1}
                </span>
                {i < steps.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-border" />}
              </div>
              <div className={`flex-1 rounded-lg border px-4 py-2.5 ${tagStyle[step.tag]}`}>
                <p className="text-sm font-semibold">{step.label}</p>
                <p className="mt-0.5 text-sm opacity-90">{step.plain}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-4 text-xs text-faint">
          {showFailure
            ? "This is the actual recovery rule for this failure: retry the same request, never roll it back. Proven by a test, not just described."
            : "Toggle above to see what happens when the recorder catches a real failure partway through."}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-success/30 border-l-4 border-l-success bg-success/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-success">
            What gets recorded
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            {recordedFields.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-success">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-danger/30 border-l-4 border-l-danger bg-danger/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-danger">
            What can never be recorded
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted">
            {neverRecordedFields.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-danger">✕</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-faint">
            Not a promise — a test plants two fake secrets and proves neither one ever shows up
            in a logged event.
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-faint">
          If something breaks, here&apos;s exactly what to do
        </p>
        <div className="mt-3 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <tbody>
              {recoveryTable.map((row, i) => (
                <tr key={row.ifThis} className={i > 0 ? "border-t border-border" : ""}>
                  <td className="w-1/2 bg-surface-raised px-4 py-3 align-top font-medium text-foreground">
                    {row.ifThis}
                  </td>
                  <td className="px-4 py-3 align-top text-muted">{row.thenThis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-brand/30 bg-brand-tint p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-strong">
          Why this matters
        </p>
        <p className="mt-2 text-sm text-muted">
          This system handles two things people care about a lot: money (refunds) and privacy
          (photos, receipts, accounts). When something goes wrong, the team can no longer just
          shrug — every claim&apos;s full path can be pulled up on demand, and it&apos;s
          provable, not just claimed, that doing so never exposes anyone&apos;s private
          information. That&apos;s the difference between &quot;we think it&apos;s fine&quot;
          and &quot;we can show you it&apos;s fine.&quot;
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-faint">
          How it got built this week
        </p>
        <ul className="mt-3 space-y-3">
          {timeline.map((t) => (
            <li key={t.label} className="rounded-lg border border-border bg-surface-raised p-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{t.label}</span>
                <span className="text-xs text-faint">{t.date}</span>
              </div>
              <p className="mt-1.5 text-sm text-muted">{t.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted">
        <span className="font-semibold text-foreground">{stats.totalTests} automated tests</span>{" "}
        confirm this behaves exactly as described above — including the failure and privacy
        cases, not just the happy path. Current as of commit{" "}
        <code className="text-xs">{stats.commit}</code>. Full technical writeup:{" "}
        <code className="text-xs">docs/OBSERVABILITY-RUNBOOK.md</code> in the main repo.
      </div>
    </section>
  );
}
