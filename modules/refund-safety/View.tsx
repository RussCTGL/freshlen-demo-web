"use client";

import { useMemo, useState } from "react";

type Tone = "success" | "warning" | "danger" | "muted" | "info";

const toneText: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  muted: "text-muted",
  info: "text-info",
};
const toneBg: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  muted: "bg-muted",
  info: "bg-info",
};
const toneBorder: Record<Tone, string> = {
  success: "border-success",
  warning: "border-warning",
  danger: "border-danger",
  muted: "border-border",
  info: "border-info",
};
const toneChip: Record<Tone, string> = {
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  muted: "border-border bg-surface-raised text-muted",
  info: "border-info/30 bg-info/10 text-info",
};

type Step = {
  tab: string; // short label on the step chip
  tag: string; // who is acting
  tone: Tone;
  title: string;
  body: string;
  actor: string; // metric: who acts
  httpState: string; // metric: HTTP / state
  decision: string; // metric: decision state
  banner?: { code: string; text: string; tone: Tone };
  ledger: { text: string; tone: Tone }; // appended to the live claim log
  next?: string; // label on the advance button
  backing: string; // which red-team test proves this beat
};

// Each beat is one step. Every banner string is the REAL response our tests observe —
// nothing here is invented. See the credits + evidence links at the bottom.
const STEPS: Step[] = [
  {
    tab: "1 · Approve",
    tag: "Reviewer · Sam",
    tone: "success",
    title: "A reviewer approves a $5.00 refund",
    body: "Sam reviews claim #A1 — strawberries, photo shows visible spoilage — and taps Approve. The system starts writing a tamper-proof record of the decision.",
    actor: "Reviewer",
    httpState: "writing…",
    decision: "1 pending",
    ledger: { text: "approve $5.00 — decision write dispatched", tone: "success" },
    next: "Approve $5.00  ▶",
    backing: "approve path",
  },
  {
    tab: "2 · Stall",
    tag: "System · anchor",
    tone: "warning",
    title: "The tamper-proof write stalls — the claim is parked",
    body: "The record was dispatched but not acknowledged, so the system cannot be sure it took effect. Instead of guessing a final answer, it parks the claim with exactly one pending decision and asks for the SAME request again.",
    actor: "System",
    httpState: "HTTP 503",
    decision: "1 parked",
    banner: {
      code: "HTTP 503",
      text: "anchor acknowledgement is pending; retry this same request",
      tone: "warning",
    },
    ledger: { text: "503 anchor pending — claim parked, one decision held", tone: "warning" },
    next: "An attacker pounces  ▶",
    backing: "P2 anchor-unacked test",
  },
  {
    tab: "3 · Attack",
    tag: "Attacker",
    tone: "danger",
    title: "An attacker replays the parked claim — for more money",
    body: "Seeing the stall, an attacker resends the same claim but bumps the amount from $5.00 to $8.00, hoping to slip a second, bigger decision in. A different amount is a different intent — so it is refused.",
    actor: "Attacker",
    httpState: "HTTP 409",
    decision: "refused",
    banner: {
      code: "HTTP 409",
      text: "a different review request is awaiting reconciliation",
      tone: "danger",
    },
    ledger: { text: "409 amount changed $5→$8 — refused, nothing written", tone: "danger" },
    next: "The reviewer retries honestly  ▶",
    backing: "R1 changed-amount retry test",
  },
  {
    tab: "4 · Recover",
    tag: "Reviewer · Sam",
    tone: "success",
    title: "The honest retry recovers — one decision, confirmed",
    body: "Sam retries the EXACT same $5.00 request. That reconciles the pending anchor and the decision is confirmed. Same parked state, two outcomes: the attacker was refused, the honest retry recovered — never a silent second refund.",
    actor: "Reviewer",
    httpState: "CONFIRMED",
    decision: "1 final",
    banner: {
      code: "CONFIRMED",
      text: "one decision recorded · $8.00 never happened",
      tone: "success",
    },
    ledger: { text: "same $5.00 retried — anchor reconciled, one decision confirmed", tone: "success" },
    next: "Then the server restarts  ▶",
    backing: "P2 / R1 (one decision, parked unchanged)",
  },
  {
    tab: "5 · Limit",
    tag: "Ops · architecture",
    tone: "muted",
    title: "The one honest limit: a restart drops unfinished claims",
    body: "Live claim state lives in memory (process-local), not in a durable multi-worker store. On a restart, unfinished claims are lost — only the tamper-proof ledger of FINISHED refunds survives and still verifies. We show this line honestly rather than pretend durability.",
    actor: "Ops",
    httpState: "restart",
    decision: "in-memory lost",
    ledger: { text: "restart — pending claims wiped; finished-refund ledger survives + verifies", tone: "muted" },
    backing: "L1 simulated-restart test",
  },
];

const PRINCIPLES: { rule: string; line: string; tone: Tone }[] = [
  {
    rule: "One decision only.",
    line: "A claim can bind exactly one outcome; a second, different retry is refused (409).",
    tone: "danger",
  },
  {
    rule: "A stall recovers, it does not corrupt.",
    line: "A pending anchor returns a named, retryable state (503) — never a silent half-refund.",
    tone: "warning",
  },
  {
    rule: "Restart is honest about loss.",
    line: "Unfinished claims are in-memory and lost on restart; only the tamper-proof ledger is durable. We say so.",
    tone: "muted",
  },
];

// The proof panel: the exact responses our red-team tests observe against source.
const PROOF_ROWS: { label: string; result: string; tone: Tone }[] = [
  {
    label: "attacker retry, amount changed",
    result: "409 'a different review request is awaiting reconciliation'",
    tone: "danger",
  },
  {
    label: "honest retry, same request",
    result: "reconciled · exactly one decision recorded",
    tone: "success",
  },
  {
    label: "anchor unacked, same request",
    result: "503 'anchor acknowledgement is pending; retry this same request'",
    tone: "warning",
  },
  {
    label: "simulated restart",
    result: "pending claim lost · anchor ledger still verifies",
    tone: "muted",
  },
];

function Chip({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest ${toneChip[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${toneBg[tone]}`} aria-hidden />
      {label}
    </span>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: Tone }) {
  return (
    <div className="rounded-lg border border-border bg-surface-raised p-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-faint">{label}</p>
      <p className={`mt-1 font-mono text-sm font-semibold ${tone ? toneText[tone] : ""}`}>{value}</p>
    </div>
  );
}

export default function View() {
  const [step, setStep] = useState(0);
  const s = STEPS[step];
  const last = STEPS.length - 1;

  const recorded = step >= 1; // a decision exists once the approve is taken
  const confirmed = step >= 3;
  const meterStatus = !recorded ? "" : confirmed ? "confirmed" : "pending — not yet final";

  // Live claim log accumulates each beat as you advance.
  const log = useMemo(() => STEPS.slice(0, step + 1).map((st) => st.ledger), [step]);

  return (
    <section className="space-y-8">
      {/* Header card — controls + step tabs */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              Interactive demo · Red-team #160
            </p>
            <h2 className="mt-2 text-2xl font-semibold">The refund that cannot be doubled</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              Walk one refund end to end. An attacker tries to turn it into two — the system refuses.
              A dependency stalls — the claim recovers instead of corrupting. And one honest limit
              remains. Every red or amber banner below is a <strong>real response our red-team tests
              observe</strong>; this illustrates proven behavior, not a mockup of a plan. An approval
              is <em>not</em> a payout.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-full border border-border px-3 py-1.5 text-sm text-muted transition hover:border-brand hover:text-foreground"
            >
              ↺ Reset
            </button>
            <button
              type="button"
              onClick={() => setStep((v) => Math.min(last, v + 1))}
              disabled={step === last}
              className="rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next step
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {STEPS.map((st, i) => {
            const isActive = i === step;
            return (
              <button
                key={st.tab}
                type="button"
                onClick={() => setStep(i)}
                aria-pressed={isActive}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "border-brand bg-brand-tint font-medium text-brand"
                    : "border-border bg-background text-muted hover:border-brand hover:text-foreground"
                }`}
              >
                {st.tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Money meter — the honest lead number. It never becomes two. */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-surface-raised px-4 py-3">
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

      {/* Two columns: current beat + live claim state */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
        {/* Current beat */}
        <div className={`rounded-lg border border-l-4 ${toneBorder[s.tone]} bg-surface p-5`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`font-mono text-xs font-semibold uppercase tracking-widest ${toneText[s.tone]}`}>
                Step {step + 1} of {STEPS.length}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </div>
            <Chip label={s.tag} tone={s.tone} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="actor" value={s.actor} />
            <Metric label="response / state" value={s.httpState} tone={s.tone} />
            <Metric label="decisions bound" value={s.decision} tone={s.tone} />
          </div>

          {/* Terminal-style banner quoting the real response */}
          <div className="mt-5 overflow-hidden rounded-lg border border-border bg-black p-4 font-mono text-xs text-zinc-100">
            <div className="mb-2 text-zinc-500">$ POST /claims/A1/review</div>
            {s.banner ? (
              <p>
                <span className={`font-semibold ${toneText[s.banner.tone]}`}>{s.banner.code}</span>
                <span className="ml-2 text-zinc-300">{`"${s.banner.text}"`}</span>
              </p>
            ) : step === last ? (
              <p className="text-zinc-400">process restarted — in-memory claim table cleared</p>
            ) : (
              <p className="text-success">200 decision accepted — writing tamper-proof record…</p>
            )}
          </div>

          {/* Restart split panel (final beat) */}
          {step === last ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded border border-danger/40 border-l-4 border-l-danger bg-surface-raised p-3">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-danger">
                  In memory (lost)
                </p>
                <p className="mt-1 text-sm text-muted">
                  Pending claims are wiped. A claim still in review disappears; the shopper gets no
                  message.
                </p>
              </div>
              <div className="rounded border border-success/40 border-l-4 border-l-success bg-surface-raised p-3">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-success">
                  On disk (survives)
                </p>
                <p className="mt-1 text-sm text-muted">
                  The tamper-proof ledger of finished refunds survives a restart and still verifies.
                </p>
              </div>
            </div>
          ) : null}

          <p className="mt-4 font-mono text-xs text-faint">proven by: {s.backing}</p>

          {/* Navigation */}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
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
        </div>

        {/* Live claim state */}
        <aside className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
                Claim #A1
              </p>
              <h3 className="mt-1 font-semibold">Strawberries 1lb · $5.00</h3>
            </div>
            <Chip label={s.decision} tone={s.tone} />
          </div>

          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-faint">
            Decision log
          </p>
          <ol className="mt-2 space-y-2">
            {log.map((entry, i) => (
              <li
                key={i}
                className={`rounded-md border border-l-4 ${toneBorder[entry.tone]} bg-surface-raised p-2.5`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${toneBg[entry.tone]}`} aria-hidden />
                  <span className="font-mono text-[10px] text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{entry.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 border-t border-border pt-3 text-xs text-faint">
            The log grows as you advance. Notice it never records a second, larger refund — the money
            meter above stays at one.
          </p>
        </aside>
      </div>

      {/* Same pending state, two outcomes — the crux */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-warning/40 border-l-4 border-l-warning bg-surface p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
            One parked state
          </p>
          <h3 className="mt-2 font-semibold">Anchor pending (503)</h3>
          <p className="mt-2 text-sm text-muted">
            The write stalled. Exactly one decision is held; the same request is asked for again.
          </p>
        </div>
        <div className="rounded-lg border border-danger/40 border-l-4 border-l-danger bg-surface p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-danger">
            Malicious retry
          </p>
          <h3 className="mt-2 font-semibold">Different amount → refused (409)</h3>
          <p className="mt-2 text-sm text-muted">
            $5 → $8 is a different intent. Refused; nothing is written. The refund stays at one.
          </p>
        </div>
        <div className="rounded-lg border border-success/40 border-l-4 border-l-success bg-surface p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-success">
            Honest retry
          </p>
          <h3 className="mt-2 font-semibold">Same request → recovers</h3>
          <p className="mt-2 text-sm text-muted">
            The exact $5.00 reconciles the anchor and confirms one decision — never a silent second
            refund.
          </p>
        </div>
      </div>

      {/* Proof from the red-team tests */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Proof — responses observed by the red-team tests
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-border bg-black p-4 font-mono text-xs text-zinc-100">
          <div className="mb-3 text-zinc-500">$ pytest tests/test_red_team_coverage_YuntongP.py -q</div>
          <div className="space-y-2">
            {PROOF_ROWS.map((row) => (
              <div
                key={row.label}
                className={`rounded border ${toneBorder[row.tone]}/60 bg-zinc-950/80 px-3 py-2`}
              >
                <span className="text-zinc-400">{row.label}: </span>
                <span className={toneText[row.tone]}>{row.result}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm text-faint">
          The headline is the pair: a changed-amount retry is refused, an identical retry recovers —
          one decision either way.
        </p>
      </div>

      {/* Principle cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <div
            key={p.rule}
            className={`rounded-lg border border-l-4 ${toneBorder[p.tone]} bg-surface-raised p-3`}
          >
            <p className="text-sm font-semibold">{p.rule}</p>
            <p className="mt-1 text-xs text-muted">{p.line}</p>
          </div>
        ))}
      </div>

      {/* One-minute talk track */}
      <div className="rounded-lg border border-success/30 border-l-4 border-l-success bg-success/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-success">
          One-minute talk track
        </p>
        <p className="mt-2 text-muted">
          One refund, walked end to end. A cheat tries to make it two and is refused (409). A
          dependency stalls and the claim recovers instead of corrupting (503 → confirmed). One
          honest limit stays: unfinished claims are in-memory and lost on restart, while the
          tamper-proof ledger survives. Every banner is a real tested response — an approval is not a
          payout.
        </p>
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
