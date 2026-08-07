"use client";

import { useState } from "react";
import { takeaway, scenario, photoChecks, scanResult, type Tone } from "./data";

const TONE_BORDER: Record<Tone, string> = {
  success: "border-success/40",
  danger: "border-danger/40",
  warning: "border-warning/40",
  neutral: "border-border",
};

const TONE_TEXT: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning",
  neutral: "text-foreground",
};

const TONE_BG: Record<Tone, string> = {
  success: "bg-success/10",
  danger: "bg-danger/10",
  warning: "bg-warning/10",
  neutral: "bg-background",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
      {children}
    </h3>
  );
}

type Status = "idle" | "working" | "done";

function PhotoCheckCard({ check }: { check: (typeof photoChecks)[number] }) {
  const [status, setStatus] = useState<Status>("idle");

  function run() {
    if (status === "working") return;
    if (status === "done") {
      setStatus("idle");
      return;
    }
    setStatus("working");
    window.setTimeout(() => setStatus("done"), 550);
  }

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-5">
      <p className="text-sm font-semibold text-foreground">{check.photoLabel}</p>
      <p className="mt-1 text-sm text-muted">
        Claim: {scenario.product} — {scenario.claimReason}
      </p>

      <button
        type="button"
        onClick={run}
        disabled={status === "working"}
        className="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "done" ? "Try again" : check.label}
      </button>

      <div className="mt-4 min-h-[5rem]">
        {status === "working" ? (
          <p className="text-sm text-faint">Reading photo…</p>
        ) : status === "done" ? (
          <div className={`rounded-xl border p-3 ${TONE_BORDER[check.tone]} ${TONE_BG[check.tone]}`}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold text-foreground">{check.freshnessRead}</p>
              <span className={`font-mono text-sm font-semibold ${TONE_TEXT[check.tone]}`}>
                {check.confidence}% confident
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted">{check.note}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FraudScan() {
  const [status, setStatus] = useState<Status>("idle");

  function run() {
    if (status === "working") return;
    if (status === "done") {
      setStatus("idle");
      return;
    }
    setStatus("working");
    window.setTimeout(() => setStatus("done"), 700);
  }

  return (
    <section>
      <SectionTitle>Fraud-safety scan</SectionTitle>
      <div className="mt-3 rounded-2xl border border-border bg-surface p-5">
        <p className="text-sm text-muted">
          Tests {scanResult.samplesTested} known AI-generated photos against the same
          confidence check — a guardrail behind the scenes, separate from any one claim.
        </p>
        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={run}
            disabled={status === "working"}
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {status === "done" ? "Run again" : scanResult.buttonLabel}
          </button>
          {status === "working" ? (
            <p className="text-sm text-faint">{scanResult.workingLabel}</p>
          ) : status === "done" ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${TONE_BORDER[scanResult.tone]} ${TONE_TEXT[scanResult.tone]} ${TONE_BG[scanResult.tone]}`}
            >
              {scanResult.resultTitle}
            </span>
          ) : null}
        </div>
        {status === "done" ? (
          <div className="mt-4 rounded-xl border border-success/40 bg-success/10 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium text-foreground">{scanResult.resultBody}</p>
              <p className="font-mono text-2xl font-bold text-success">
                {scanResult.slippedThroughPct}%
              </p>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-success"
                style={{ width: `${scanResult.slippedThroughPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-faint">Safety limit: {scanResult.limit}%</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function View() {
  return (
    <div className="space-y-10">
      {/* Main message */}
      <div className="rounded-2xl border border-brand/30 bg-brand-tint p-6">
        <p className="text-lg font-semibold leading-snug text-foreground">{takeaway}</p>
      </div>

      {/* Real vs fake photo, side by side */}
      <section>
        <SectionTitle>Try it — real photo vs. fake photo</SectionTitle>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {photoChecks.map((check) => (
            <PhotoCheckCard key={check.id} check={check} />
          ))}
        </div>
      </section>

      {/* Aggregate fraud-safety scan */}
      <FraudScan />
    </div>
  );
}
