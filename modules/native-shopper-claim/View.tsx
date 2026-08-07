"use client";

import { useState } from "react";

const steps = [
  {
    label: "Capture",
    eyebrow: "Step 1 of 4",
    title: "Photograph the item",
    body: "Capture the produce in-app. A clear retake path keeps unsupported evidence out of the decision flow.",
    action: "Use sample banana",
    icon: "◎",
  },
  {
    label: "Receipt",
    eyebrow: "Step 2 of 4",
    title: "Add purchase evidence",
    body: "Attach the receipt, then confirm item, store, price, and date before creating the claim.",
    action: "Attach demo receipt",
    icon: "▤",
  },
  {
    label: "Review",
    eyebrow: "Step 3 of 4",
    title: "Review and create once",
    body: "The model may advise on condition; a person reviews and decides. No refund or payout is promised.",
    action: "Create claim",
    icon: "✓",
  },
  {
    label: "Pending",
    eyebrow: "Accessible pending state",
    title: "Waiting for human review",
    body: "The feature-flagged design announces a stable pending state and preserves the evidence summary for review.",
    action: "Restart walkthrough",
    icon: "…",
  },
];

const statusRows = [
  ["Receipt → Inventory", "VERIFIED", "4.3.1 persists one banana as Unverified."],
  ["Native claim entry", "VERIFIED", "The three-step form is reachable from Inventory."],
  ["Pending-state design", "CODE-SHIPPED-NOT-VERIFIED", "Feature-flagged UX; live service did not return it."],
  ["End-to-end submission", "BLOCKED", "Exact build returned Claim not submitted."],
];

export default function View() {
  const [step, setStep] = useState(0);
  const current = steps[step];

  function advance() {
    setStep((value) => (value === steps.length - 1 ? 0 : value + 1));
  }

  return (
    <section className="space-y-10">
      <header className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border bg-brand-tint px-6 py-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Week 8 · Owner Ziyun · #159 · #177 · #179
          </p>
        </div>
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Shopper path, shown at iPhone scale
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
              Capture the item and receipt, review the claim, then land in an accessible
              human-review state. The walkthrough shows the feature-flagged native UX; the
              evidence below separately records what exact TestFlight build 4.3.1 actually did.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm">
            <p className="font-mono text-[11px] uppercase tracking-widest text-faint">Exact build</p>
            <p className="mt-1 font-mono font-semibold text-foreground">4.3.1 (2026080601)</p>
            <p className="mt-1 font-mono text-xs text-muted">source bce80116</p>
          </div>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[23rem_1fr] lg:items-start">
        <div className="mx-auto w-full max-w-[23rem] rounded-[3rem] border-[10px] border-slate-950 bg-slate-950 p-2 shadow-2xl">
          <div className="min-h-[42rem] overflow-hidden rounded-[2.25rem] bg-[#f7f2e7] text-slate-950">
            <div className="mx-auto mt-3 h-6 w-28 rounded-full bg-slate-950" />
            <div className="px-6 pb-7 pt-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-900/10 px-3 py-1 text-xs font-semibold text-emerald-900">
                  Claim feature ON
                </span>
                <span className="font-mono text-xs text-slate-500">{step + 1}/4</span>
              </div>
              <div aria-live="polite" className="mt-14 text-center">
                <p className="text-sm font-semibold text-emerald-800">{current.eyebrow}</p>
                <div className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-900 text-5xl text-white">
                  {current.icon}
                </div>
                <h2 className="mt-7 text-3xl font-bold tracking-tight">{current.title}</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{current.body}</p>
              </div>
              {step >= 1 && (
                <dl className="mt-8 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
                  <div><dt className="text-slate-500">Item</dt><dd className="font-semibold">banana</dd></div>
                  <div><dt className="text-slate-500">Price</dt><dd className="font-semibold">$3.30</dd></div>
                  <div><dt className="text-slate-500">Store</dt><dd className="font-semibold">store 42</dd></div>
                  <div><dt className="text-slate-500">Evidence</dt><dd className="font-semibold">2 photos</dd></div>
                </dl>
              )}
              <button
                type="button"
                onClick={advance}
                className="mt-10 w-full rounded-2xl bg-emerald-800 px-5 py-4 text-lg font-semibold text-white transition hover:bg-emerald-900 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-emerald-500"
              >
                {current.action}
              </button>
              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                Advisory only · a human reviewer decides
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <article className="rounded-3xl border border-border bg-surface p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Live demo order
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              Four taps, one sentence each
            </h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-2">
              {steps.map((item, index) => (
                <li
                  key={item.label}
                  className={`rounded-2xl border p-4 ${index === step ? "border-brand bg-brand-tint" : "border-border bg-background"}`}
                >
                  <p className="font-mono text-xs font-semibold text-brand">0{index + 1}</p>
                  <p className="mt-1 font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 text-sm leading-5 text-muted">
                    {index === 0 && "One in-app item photo."}
                    {index === 1 && "Receipt plus purchase fields."}
                    {index === 2 && "Advisory copy before submit."}
                    {index === 3 && "Stable, announced human-review state."}
                  </p>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-3xl border border-border bg-surface p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Evidence boundary
            </p>
            <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border">
              {statusRows.map(([area, status, proof]) => (
                <div key={area} className="grid gap-2 bg-background p-4 sm:grid-cols-[11rem_12rem_1fr]">
                  <p className="font-semibold text-foreground">{area}</p>
                  <span className="h-fit w-fit rounded-full bg-surface px-2.5 py-1 font-mono text-[10px] font-semibold text-brand">
                    {status}
                  </span>
                  <p className="text-sm leading-5 text-muted">{proof}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Physical-device proof
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-foreground">What 4.3.1 actually returned</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {[
            ["1", "Receipt persistence fixed", "Inventory shows one retained banana, explicitly marked Unverified."],
            ["!", "Submission fails closed", "The live build says Claim not submitted because the review service is disabled."],
          ].map(([mark, title, caption]) => (
            <article key={title} className="rounded-3xl border border-border bg-surface p-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-tint font-mono text-4xl font-semibold text-brand">
                {mark}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{caption}</p>
              <p className="mt-4 font-mono text-xs font-semibold text-brand">
                Physical-device observation · 4.3.1 (2026080601)
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-warning/40 bg-warning/10 p-6 sm:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-warning">
          Honest close
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">The UX is ready to explain; the service is not live</h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-muted">
          The feature-flagged native surface defines capture, receipt, review, and pending states.
          Exact-build evidence verifies persistence and entry, but not queue arrival or reviewer
          resolution. Scanner, review-service, idempotency, and server-derived amount remain with
          their backend/model owners; no screenshot here claims a refund, payout, or completed claim.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="https://github.com/LawrenceHua/es-intern-freshlens/issues/159" target="_blank" rel="noreferrer" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">Issue #159</a>
          <a href="https://github.com/LawrenceHua/es-intern-freshlens/issues/179" target="_blank" rel="noreferrer" className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground">Claim entry #179</a>
          <a href="https://github.com/LawrenceHua/es-intern-freshlens/pull/242" target="_blank" rel="noreferrer" className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-foreground">Automation PR #242</a>
        </div>
      </section>
    </section>
  );
}
