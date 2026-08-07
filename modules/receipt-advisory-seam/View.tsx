"use client";

import { useState } from "react";

type Scenario = "available" | "unavailable";

const contributions = [
  {
    label: "Lifecycle",
    title: "Kept both photos together for a safe retry",
    detail:
      "The produce and receipt images enter one bounded in-memory entry. A temporary dependency failure keeps both available instead of making the shopper start again.",
  },
  {
    label: "Advisory",
    title: "Added OCR and date-label hints without changing policy",
    detail:
      "Optional services can contribute structured context when available. Their output never approves or declines a claim and never creates a new decision reason.",
  },
  {
    label: "Privacy",
    title: "Removed raw evidence when its job was done",
    detail:
      "Terminal completion, expiry, or reset clears the staged images. Raw pixels and OCR text do not enter durable records, audit events, logs, or responses.",
  },
] as const;

const flow = [
  { step: "01", title: "Capture", detail: "Produce photo, receipt photo, and bounded metadata" },
  { step: "02", title: "Stage together", detail: "One temporary entry with account and process limits" },
  { step: "03", title: "Add advice", detail: "OCR and date label only through an available capability" },
  { step: "04", title: "Human review", detail: "The policy route remains human_review" },
] as const;

const scenarioContent = {
  available: {
    status: "ADVISORY AVAILABLE",
    tone: "success",
    title: "Validated hints are added to the evidence",
    explanation:
      "FreshLens keeps only the small, expected fields it understands. Extra echoed text and unknown fields are discarded.",
    rows: [
      ["OCR item", "banana"],
      ["Date-label hint", "best before: 2026-07-25"],
      ["Confidence", "0.88"],
      ["Policy route", "human_review"],
    ],
  },
  unavailable: {
    status: "SAFE FALLBACK",
    tone: "warning",
    title: "The claim continues with clear uncertainty",
    explanation:
      "If the optional service is disabled, times out, is unauthorized, or returns a malformed result, the normalized shopper input remains the fallback.",
    rows: [
      ["Advisory status", "unavailable"],
      ["Reason", "capability_disabled"],
      ["Shopper date", "2026-07-20"],
      ["Policy route", "human_review"],
    ],
  },
} as const;

export default function View() {
  const [scenario, setScenario] = useState<Scenario>("available");
  const selected = scenarioContent[scenario];
  const success = selected.tone === "success";

  return (
    <section className="space-y-10">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="border-b border-brand/20 bg-brand-tint px-6 py-3">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Week 6 / Lezhi / Issue #109
          </span>
        </div>
        <div className="grid gap-7 px-6 py-8 lg:grid-cols-[1.35fr_0.65fr] lg:px-9">
          <div>
            <p className="text-sm font-medium text-muted">My Week 6 goal</p>
            <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Make receipt evidence survive a retry - without letting it decide a claim.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              I built the bounded bridge between receipt capture and claim evaluation. Optional OCR and date-label results add context, while the shopper&apos;s normalized input remains the fallback and a person remains the decision maker.
            </p>
          </div>
          <div className="rounded-xl border border-success/30 bg-success/10 p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-success">Result</p>
            <p className="mt-3 text-2xl font-semibold">Merged in PR #134</p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Safe retry window</dt>
                <dd className="font-mono font-semibold">15 minutes</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Automatic decisions added</dt>
                <dd className="font-mono font-semibold">0</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Final route</dt>
                <dd className="font-mono font-semibold">human_review</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-faint">What I delivered</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {contributions.map((item) => (
            <article key={item.label} className="rounded-xl border border-border bg-surface p-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">{item.label}</p>
              <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
        <p className="font-mono text-xs uppercase tracking-widest text-faint">The flow I changed</p>
        <h3 className="mt-2 text-2xl font-semibold">One bounded path from capture to human review</h3>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {flow.map((item, index) => (
            <div key={item.step} className="contents">
              <article className="rounded-xl border border-border bg-surface-raised p-4">
                <span className="font-mono text-xs font-semibold text-brand">{item.step}</span>
                <h4 className="mt-3 font-semibold">{item.title}</h4>
                <p className="mt-2 text-sm leading-5 text-muted">{item.detail}</p>
              </article>
              {index < flow.length - 1 ? (
                <div className="flex items-center justify-center font-mono text-xs text-faint">
                  <span className="hidden lg:inline">-&gt;</span>
                  <span className="lg:hidden">down</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">Retryable failure</p>
            <p className="mt-2 text-sm leading-6 text-muted">Keep the paired images briefly, return structured uncertainty, and allow a safe retry.</p>
          </div>
          <div className="rounded-xl border border-success/30 bg-success/10 p-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-success">Terminal, expired, or reset</p>
            <p className="mt-2 text-sm leading-6 text-muted">Clear both images and retain no raw receipt pixels in durable records.</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-faint">Behavior demo</p>
            <h3 className="mt-2 text-2xl font-semibold">The optional service may change; the decision boundary does not.</h3>
          </div>
          <div className="flex gap-2" role="group" aria-label="Receipt advisory state">
            <button
              type="button"
              onClick={() => setScenario("available")}
              aria-pressed={scenario === "available"}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                scenario === "available"
                  ? "border-success bg-success text-white"
                  : "border-border bg-surface-raised text-muted hover:border-success/50 hover:text-foreground"
              }`}
            >
              Capability available
            </button>
            <button
              type="button"
              onClick={() => setScenario("unavailable")}
              aria-pressed={scenario === "unavailable"}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                scenario === "unavailable"
                  ? "border-warning bg-warning text-white"
                  : "border-border bg-surface-raised text-muted hover:border-warning/50 hover:text-foreground"
              }`}
            >
              Dependency unavailable
            </button>
          </div>
        </div>

        <div className="grid gap-7 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <span
              className={`inline-flex rounded-full border px-3 py-1 font-mono text-xs font-semibold tracking-widest ${
                success
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-warning/30 bg-warning/10 text-warning"
              }`}
            >
              {selected.status}
            </span>
            <h4 className="mt-4 text-2xl font-semibold">{selected.title}</h4>
            <p className="mt-3 leading-7 text-muted">{selected.explanation}</p>
            <div className="mt-6 rounded-xl border border-info/30 bg-info/5 p-4">
              <p className="font-mono text-xs uppercase tracking-widest text-info">Unchanged rule</p>
              <p className="mt-2 text-sm font-semibold">The model advises, policy routes, and a human decides.</p>
            </div>
          </div>
          <dl className="divide-y divide-border rounded-xl border border-border bg-surface-raised px-5">
            {selected.rows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[0.9fr_1.1fr] gap-4 py-4 text-sm">
                <dt className="text-muted">{label}</dt>
                <dd className="break-words font-mono font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-info/30 bg-info/5 p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-info">Privacy and capacity boundary</p>
          <h3 className="mt-3 text-xl font-semibold">Enough time to retry, not indefinite storage.</h3>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-muted">
            <li>15-minute expiry for the paired images.</li>
            <li>Per-image, per-account, and whole-process memory limits.</li>
            <li>Only app version, platform, capture time, and EXIF presence survive metadata filtering.</li>
            <li>No GPS, account ID, device ID, token, raw image, or OCR text is echoed.</li>
          </ul>
        </article>

        <article className="rounded-xl border border-warning/30 bg-warning/5 p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-warning">Week 6 coordination</p>
          <h3 className="mt-3 text-xl font-semibold">Eight device results, one honest conclusion.</h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            I coordinated the device matrix, owned camera-permission recovery, and published the final readiness synthesis. The offline demo was ready, but the installed iOS build did not contain the complete item + receipt to claim to human-review journey.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-border bg-surface p-3">
              <dt className="text-faint">Device rows</dt>
              <dd className="mt-1 font-mono font-semibold">8 / 8</dd>
            </div>
            <div className="rounded-lg border border-border bg-surface p-3">
              <dt className="text-faint">Native full journey</dt>
              <dd className="mt-1 font-mono font-semibold text-warning">NOT_PRESENT</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}
