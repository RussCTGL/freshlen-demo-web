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
  doorsStats,
  beforeError,
  afterError,
  type ClaimTag,
} from "./data";
import { TraceDiagram, FlowDiagram } from "./Diagrams";
import { DoorsDiagram } from "./DoorsDiagram";

const claimTags: ClaimTag[] = ["A", "B", "C"];

export default function View() {
  const [showMissingConfirmation, setShowMissingConfirmation] = useState(false);
  const flowSteps = showMissingConfirmation ? missingConfirmationFlow : confirmedFlow;
  const [pulledClaim, setPulledClaim] = useState<ClaimTag | null>(null);
  const pulledEvents = pulledClaim
    ? mixedStream.filter((e) => e.claim === pulledClaim)
    : [];
  const [doorsAfter, setDoorsAfter] = useState(false);

  return (
    <section className="space-y-8">
      <p className="text-muted">
        Every refund claim gets a flight recorder — one ID traces it end to end, and
        sensitive fields can never be logged, by construction.
      </p>

      <div className="rounded-lg border border-border bg-surface p-5">
        <TraceDiagram />

        <p className="mt-3 text-center text-xs text-faint">
          Real logs interleave many claims at once — pick one to pull its story out of the noise:
        </p>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
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

        <div className="mt-3 min-h-[3rem] rounded-lg border border-dashed border-border bg-surface-raised p-3">
          {pulledClaim ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {pulledEvents.map((entry, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${claimSwatch[entry.claim]}`}>
                    {entry.event}
                  </span>
                  {i < pulledEvents.length - 1 && <span className="text-faint">→</span>}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-faint">click a claim above</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-center gap-2">
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
            Normal
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
            Confirmation lost
          </button>
        </div>

        <FlowDiagram steps={flowSteps} />

        {showMissingConfirmation && (
          <p className="mt-1 rounded-lg border border-border bg-surface-raised p-3 text-center text-xs text-muted">
            {escalationNote}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-success/30 border-l-4 border-l-success bg-success/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-success">
            Recorded
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
            Never recorded
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
            Proven, not promised — a test plants two fake secrets and checks neither leaks.
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-faint">
          If something breaks
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {recoveryTable.map((row) => (
            <div
              key={row.ifThis}
              className="rounded-lg border border-border border-l-4 border-l-info bg-surface-raised p-3"
            >
              <p className="text-sm font-semibold text-foreground">{row.ifThis}</p>
              <p className="mt-1 text-sm text-muted">{row.thenThis}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-brand/30 bg-brand-tint p-5 text-center">
        <p className="text-sm text-muted">
          &quot;We think it&apos;s fine&quot; → <span className="font-semibold text-brand-strong">&quot;we can show you it&apos;s fine.&quot;</span>
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-faint">
          How it got built
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          {timeline.map((t, i) => (
            <div key={t.label} className="flex-1 rounded-lg border border-border bg-surface-raised p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand-strong">
                  {i + 1}
                </span>
                <span className="text-xs font-semibold text-foreground">{t.label}</span>
              </div>
              <p className="mt-1 text-xs text-faint">{t.date}</p>
              <p className="mt-1.5 text-sm text-muted">{t.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 text-center text-sm text-muted">
        <span className="font-semibold text-foreground">{stats.totalTests} tests</span> confirm
        this — happy path, failures, and privacy alike. Commit <code className="text-xs">{stats.commit}</code>.
      </div>

      <hr className="border-border" />

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-faint">
          Also this week — #196: the safe door, by default
        </p>
        <p className="mt-2 text-muted">
          Connecting to the freshness model has two doors. The system used to try the wrong one first.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setDoorsAfter(false)}
            aria-pressed={!doorsAfter}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              !doorsAfter
                ? "border-warning bg-warning/10 font-medium text-warning"
                : "border-border bg-background text-muted hover:border-warning hover:text-foreground"
            }`}
          >
            Before
          </button>
          <button
            type="button"
            onClick={() => setDoorsAfter(true)}
            aria-pressed={doorsAfter}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              doorsAfter
                ? "border-brand bg-brand-tint font-medium text-brand"
                : "border-border bg-background text-muted hover:border-brand hover:text-foreground"
            }`}
          >
            After
          </button>
        </div>

        <DoorsDiagram after={doorsAfter} />

        <p className="mt-1 text-center text-xs text-faint">
          {doorsAfter
            ? "Official door first, by default. The raw-host door needs a manual switch — off by default, and safely falls back rather than attempting it."
            : "The unadvertised raw-host door was tried first — ahead of the recommended, advertised door."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-danger/30 border-l-4 border-l-danger bg-danger/5 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-danger">Before</p>
          <p className="mt-2 text-xs text-muted">{beforeError.heading}</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{beforeError.message}</p>
          <p className="mt-2 text-xs text-faint">same message, whatever actually went wrong</p>
        </div>
        <div className="rounded-lg border border-success/30 border-l-4 border-l-success bg-success/5 p-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-success">After</p>
          <p className="mt-2 text-xs text-muted">{afterError.heading}</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{afterError.message}</p>
          <p className="mt-2 text-xs text-faint">caught in review, fixed same PR</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4 text-center text-sm text-muted">
        <span className="font-semibold text-foreground">{doorsStats.totalTests} tests</span>{" "}
        confirm the default, the switch, and the honest error. Commit{" "}
        <code className="text-xs">{doorsStats.commit}</code>.
      </div>
    </section>
  );
}
