"use client";

import { useState } from "react";

type Tone = "success" | "warning" | "danger" | "muted";

const border: Record<Tone, string> = {
  success: "border-success",
  warning: "border-warning",
  danger: "border-danger",
  muted: "border-border",
};
const txt: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  muted: "text-muted",
};

type Step = {
  tag: string; // who is acting
  tone: Tone;
  title: string;
  body: string;
  banner?: { code: string; text: string; tone: Tone };
  next?: string; // label on the advance button
  backing: string; // which red-team test proves this beat
};

// Each beat is one step. Every banner string is the REAL response our tests observe —
// nothing here is invented. See the credits + evidence links at the bottom.
const STEPS: Step[] = [
  {
    tag: "Reviewer · Sam",
    tone: "success",
    title: "A reviewer approves a $5.00 refund",
    body: "Sam reviews claim #A1 — strawberries, photo shows visible spoilage — and taps Approve. The system starts writing a tamper-proof record of the decision.",
    next: "Approve $5.00  ▶",
    backing: "approve path",
  },
  {
    tag: "System · anchor",
    tone: "warning",
    title: "The tamper-proof write stalls — the claim is parked",
    body: "The record was dispatched but not acknowledged, so the system cannot be sure it took effect. Instead of guessing a final answer, it parks the claim with exactly one pending decision and asks for the SAME request again.",
    banner: {
      code: "HTTP 503",
      text: "anchor acknowledgement is pending; retry this same request",
      tone: "warning",
    },
    next: "An attacker pounces  ▶",
    backing: "P2 anchor-unacked test",
  },
  {
    tag: "Attacker",
    tone: "danger",
    title: "An attacker replays the parked claim — for more money",
    body: "Seeing the stall, an attacker resends the same claim but bumps the amount from $5.00 to $8.00, hoping to slip a second, bigger decision in. A different amount is a different intent — so it is refused.",
    banner: {
      code: "HTTP 409",
      text: "a different review request is awaiting reconciliation",
      tone: "danger",
    },
    next: "The reviewer retries honestly  ▶",
    backing: "R1 changed-amount retry test",
  },
  {
    tag: "Reviewer · Sam",
    tone: "success",
    title: "The honest retry recovers — one decision, confirmed",
    body: "Sam retries the EXACT same $5.00 request. That reconciles the pending anchor and the decision is confirmed. Same parked state, two outcomes: the attacker was refused, the honest retry recovered — never a silent second refund.",
    banner: {
      code: "CONFIRMED",
      text: "one decision recorded · $8.00 never happened",
      tone: "success",
    },
    next: "Then the server restarts  ▶",
    backing: "P2 / R1 (one decision, parked unchanged)",
  },
  {
    tag: "Ops · architecture",
    tone: "muted",
    title: "The one honest limit: a restart drops unfinished claims",
    body: "Live claim state lives in memory (process-local), not in a durable multi-worker store. On a restart, unfinished claims are lost — only the tamper-proof ledger of FINISHED refunds survives and still verifies. We show this line honestly rather than pretend durability.",
    backing: "L1 simulated-restart test",
  },
];

const PRINCIPLES: { rule: string; line: string }[] = [
  {
    rule: "One decision only.",
    line: "A claim can bind exactly one outcome; a second, different retry is refused (409).",
  },
  {
    rule: "A stall recovers, it does not corrupt.",
    line: "A pending anchor returns a named, retryable state (503) — never a silent half-refund.",
  },
  {
    rule: "Restart is honest about loss.",
    line: "Unfinished claims are in-memory and lost on restart; only the tamper-proof ledger is durable. We say so.",
  },
];

export default function View() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const last = STEPS.length - 1;

  const recorded = step >= 1; // a decision exists once the approve is taken
  const confirmed = step >= 3;
  const meterStatus = !recorded ? "" : confirmed ? "confirmed" : "pending — not yet final";

  return (
    <section className="space-y-8">
      <p className="text-muted">
        One refund, walked end to end. A cheat tries to turn it into two; the system refuses. A
        dependency stalls; the claim recovers instead of corrupting. And one honest limit remains.
        Every red or amber line below is a <strong>real response our red-team tests observe</strong>{" "}
        — this is an illustration of proven behavior, not a mockup of a plan. An approval is{" "}
        <em>not</em> a payout.
      </p>

      {/* Money meter — the honest lead number. It never becomes two. */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-border bg-surface-raised px-4 py-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Refunds recorded
        </span>
        <span className="font-mono text-lg font-semibold">
          {recorded ? "1 × $5.00" : "0"}
          {meterStatus ? (
            <span className={`ml-2 text-xs ${confirmed ? "text-success" : "text-warning"}`}>
              ({meterStatus})
            </span>
          ) : null}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2">
        {STEPS.map((st, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i)}
            aria-label={`Go to step ${i + 1}`}
            className={`h-2.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-brand" : "bg-border"
            }`}
          />
        ))}
      </div>

      {/* Current beat */}
      <div className={`space-y-4 rounded-lg border-l-4 ${border[s.tone]} bg-surface-raised p-5`}>
        <span
          className={`inline-block rounded border px-2 py-0.5 font-mono text-xs uppercase tracking-wider ${border[s.tone]} ${txt[s.tone]}`}
        >
          {s.tag}
        </span>
        <h3 className="text-lg font-semibold">{s.title}</h3>
        <p className="text-muted">{s.body}</p>

        {s.banner ? (
          <div className={`rounded border ${border[s.banner.tone]} bg-surface p-3`}>
            <span className={`font-mono text-xs font-semibold ${txt[s.banner.tone]}`}>
              {s.banner.code}
            </span>
            <span className="ml-2 font-mono text-sm">{`"${s.banner.text}"`}</span>
          </div>
        ) : null}

        {/* Restart split panel (final beat) */}
        {step === last ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded border border-danger bg-surface p-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-danger">
                In memory (lost)
              </p>
              <p className="mt-1 text-sm text-muted">
                Pending claims are wiped. A claim still in review disappears; the shopper gets no
                message.
              </p>
            </div>
            <div className="rounded border border-success bg-surface p-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-success">
                On disk (survives)
              </p>
              <p className="mt-1 text-sm text-muted">
                The tamper-proof ledger of finished refunds survives a restart and still verifies.
              </p>
            </div>
          </div>
        ) : null}

        <p className="font-mono text-xs text-faint">proven by: {s.backing}</p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((v) => Math.max(0, v - 1))}
          disabled={step === 0}
          className="rounded border border-border px-3 py-1.5 font-mono text-xs text-muted enabled:hover:bg-surface-raised disabled:opacity-40"
        >
          ◀ Back
        </button>
        {step < last ? (
          <button
            type="button"
            onClick={() => setStep((v) => Math.min(last, v + 1))}
            className="rounded border border-brand bg-brand-tint px-3 py-1.5 font-mono text-xs text-brand-strong hover:opacity-90"
          >
            {s.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="rounded border border-border px-3 py-1.5 font-mono text-xs text-muted hover:bg-surface-raised"
          >
            ↺ Replay
          </button>
        )}
      </div>

      {/* Principle cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <div key={p.rule} className="rounded border border-border bg-surface-raised p-3">
            <p className="text-sm font-semibold">{p.rule}</p>
            <p className="mt-1 text-xs text-muted">{p.line}</p>
          </div>
        ))}
      </div>

      {/* Credits + evidence — the behavior is teammates'; this lane proves it */}
      <div className="space-y-2 border-t border-border pt-4 text-xs text-faint">
        <p>
          <span className="font-semibold text-muted">Behavior credited to:</span> Jinming (#182
          dependency-failure contract — a stalled anchor is recoverable, not final) · Ziyun (#159 —
          maps claim errors to the stable 503/409 recovery states) · Lisa (#157 — binding / replay /
          anchor).
        </p>
        <p>
          <span className="font-semibold text-muted">Red-team proof shown here:</span> Tony (#160) —
          tests P1 / P2 / R1 and the L1 restart test in{" "}
          <code>tests/test_red_team_coverage_YuntongP.py</code>.
        </p>
      </div>
    </section>
  );
}
