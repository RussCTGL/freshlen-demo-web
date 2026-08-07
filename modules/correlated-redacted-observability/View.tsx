"use client";

import { useState } from "react";
import {
  confirmedFlow,
  missingConfirmationFlow,
  escalationNote,
  mixedStream,
  claimLabels,
  claimSwatch,
  recordedFields,
  neverRecordedFields,
  recoveryTable,
  stats,
  timeline,
  type FlowStep,
  type ClaimTag,
} from "./data";

const flowTagStyle: Record<FlowStep["tag"], string> = {
  normal: "border-border bg-surface-raised text-foreground",
  problem: "border-warning/40 bg-warning/10 text-warning",
  recovered: "border-success/40 bg-success/10 text-success",
};

const claimTags: ClaimTag[] = ["A", "B", "C"];

export default function View() {
  const [showMissingConfirmation, setShowMissingConfirmation] = useState(false);
  const flowSteps = showMissingConfirmation ? missingConfirmationFlow : confirmedFlow;
  const [pulledClaim, setPulledClaim] = useState<ClaimTag | null>(null);
  const pulledEvents = pulledClaim
    ? mixedStream.filter((e) => e.claim === pulledClaim)
    : [];

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
        <p className="text-xs font-semibold uppercase tracking-widest text-faint">
          Part 1 — Why one ID matters
        </p>
        <p className="mt-2 text-sm text-muted">
          In real life, lots of claims are being logged at the same time. Here&apos;s what that
          actually looks like as it&apos;s written down — three different claims, all logging at
          once, in the order it really happens:
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {mixedStream.map((entry, i) => (
            <span
              key={i}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${claimSwatch[entry.claim]} ${
                pulledClaim && pulledClaim !== entry.claim ? "opacity-25" : ""
              }`}
            >
              {entry.claim} · {entry.event}
            </span>
          ))}
        </div>

        <p className="mt-4 text-sm text-muted">
          Messy — but every single entry is tagged with its own claim&apos;s ID. Pick one below,
          and its full story pulls right out of the noise, already in order:
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {claimTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setPulledClaim(pulledClaim === tag ? null : tag)}
              aria-pressed={pulledClaim === tag}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${claimSwatch[tag]} ${
                pulledClaim === tag ? "ring-2 ring-brand" : "opacity-70 hover:opacity-100"
              }`}
            >
              {claimLabels[tag]}
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-[3rem] rounded-lg border border-dashed border-border bg-surface-raised p-3">
          {pulledClaim ? (
            <div className="flex flex-wrap items-center gap-2">
              {pulledEvents.map((entry, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${claimSwatch[entry.claim]}`}>
                    {claimLabels[entry.claim]} · {entry.event}
                  </span>
                  {i < pulledEvents.length - 1 && <span className="text-faint">→</span>}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-faint">
              Nothing pulled out yet — click one of the three claims above.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-faint">
            Part 2 — What happens when decision anchoring fails
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowMissingConfirmation(false)}
              aria-pressed={!showMissingConfirmation}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                !showMissingConfirmation
                  ? "border-brand bg-brand-tint font-medium text-brand"
                  : "border-border bg-background text-muted hover:border-brand hover:text-foreground"
              }`}
            >
              Confirmed normally
            </button>
            <button
              type="button"
              onClick={() => setShowMissingConfirmation(true)}
              aria-pressed={showMissingConfirmation}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                showMissingConfirmation
                  ? "border-brand bg-brand-tint font-medium text-brand"
                  : "border-border bg-background text-muted hover:border-brand hover:text-foreground"
              }`}
            >
              Confirmation doesn&apos;t come back
            </button>
          </div>
        </div>

        <p className="mt-2 text-sm text-muted">
          Separate from the recorder above: whenever a human reviewer makes a decision, the
          system also has to write a tamper-evident record of it — the &quot;anchor&quot; step —
          and needs a confirmation back that it worked.
        </p>

        <div className="mt-4 space-y-2">
          {flowSteps.map((step, i) => (
            <div key={i} className={`flex ${step.actor === "system" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[85%] rounded-lg border px-3 py-2 ${flowTagStyle[step.tag]}`}>
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                  {step.actor === "system" ? "System →" : "Anchor service →"}
                </p>
                <p className="text-sm">{step.label}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-faint">
          {showMissingConfirmation
            ? "The same request id is what makes a safe retry possible — proven by a test, not just described."
            : "Toggle above to see what happens when that confirmation doesn't come back."}
        </p>

        {showMissingConfirmation && (
          <p className="mt-3 rounded-lg border border-border bg-surface-raised p-3 text-xs text-muted">
            {escalationNote}
          </p>
        )}
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
