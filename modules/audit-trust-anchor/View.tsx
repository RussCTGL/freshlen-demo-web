"use client";

import { useMemo, useState } from "react";

type Tone = "success" | "warning" | "danger" | "info";
type StepId = "genuine" | "rewrite" | "plain-verify" | "hmac-verify";

type AuditEvent = {
  id: string;
  actor: string;
  type: string;
  payload: string;
  hash: string;
  sig: string;
};

type DemoStep = {
  id: StepId;
  eyebrow: string;
  title: string;
  action: string;
  explanation: string;
  verifier: "none" | "plain hash only" | "server HMAC";
  badge: string;
  brokenAt: string;
  chainKind: "genuine" | "forged";
  tone: Tone;
};

const genuineEvents: AuditEvent[] = [
  {
    id: "evt_4af2",
    actor: "system",
    type: "assessed",
    payload: "freshness_score: 82",
    hash: "4af2...9c10",
    sig: "server:a8d7",
  },
  {
    id: "evt_c891",
    actor: "system",
    type: "decided",
    payload: "outcome: human_review",
    hash: "c891...44be",
    sig: "server:32bb",
  },
];

const forgedEvents: AuditEvent[] = [
  {
    id: "evt_91dd",
    actor: "system",
    type: "assessed",
    payload: "freshness_score: 5",
    hash: "91dd...02ef",
    sig: "attacker:77aa",
  },
  {
    id: "evt_b640",
    actor: "reviewer:evil",
    type: "decided",
    payload: "outcome: auto_approve",
    hash: "b640...e2a1",
    sig: "attacker:19cd",
  },
];

const steps: DemoStep[] = [
  {
    id: "genuine",
    eyebrow: "Step 1",
    title: "Start with the real audit trail",
    action: "Show the genuine chain",
    explanation:
      "This is a normal two-event audit history: the model assessed the claim, then policy routed it to human review. Hashes and signatures were created with the server secret.",
    verifier: "none",
    badge: "Original",
    brokenAt: "—",
    chainKind: "genuine",
    tone: "info",
  },
  {
    id: "rewrite",
    eyebrow: "Step 2",
    title: "Now simulate the real attack",
    action: "Rewrite the whole chain",
    explanation:
      "The attacker does not edit one event. They replace the entire history and recompute every hash so prev_hash linkage still looks internally consistent.",
    verifier: "none",
    badge: "Rewritten",
    brokenAt: "—",
    chainKind: "forged",
    tone: "warning",
  },
  {
    id: "plain-verify",
    eyebrow: "Step 3",
    title: "Plain hash verification gets fooled",
    action: "Run the old verifier",
    explanation:
      "Before #57, verify_audit_chain only recomputed hashes and checked prev_hash linkage. The forged chain passes that narrow check because the attacker recomputed all hashes consistently.",
    verifier: "plain hash only",
    badge: "Accepted by old verifier",
    brokenAt: "None",
    chainKind: "forged",
    tone: "warning",
  },
  {
    id: "hmac-verify",
    eyebrow: "Step 4",
    title: "The HMAC trust anchor catches it",
    action: "Run the #57 verifier",
    explanation:
      "After #57, the verifier also recomputes HMAC(server secret, event.hash). The forged chain was signed with an attacker key, so it fails immediately at event 0.",
    verifier: "server HMAC",
    badge: "Blocked by HMAC",
    brokenAt: "0",
    chainKind: "forged",
    tone: "danger",
  },
];

const shipped = [
  {
    label: "Trust root",
    value: "RECEIPT_SECRET",
    detail: "The audit chain now shares the same server-side HMAC root as provenance receipts.",
  },
  {
    label: "Signed field",
    value: "event.hash",
    detail: "Each event carries sig = HMAC(secret, hash), committing to the canonical event payload.",
  },
  {
    label: "Verifier",
    value: "compare_digest",
    detail: "verify_audit_chain recomputes the hash and checks the HMAC in constant time.",
  },
];

const proofRows = [
  { label: "genuine", result: "{'valid': True, 'broken_at': None}", tone: "success" },
  { label: "forged under attacker key", result: "{'valid': True, 'broken_at': None}", tone: "warning" },
  { label: "forged under server key", result: "{'valid': False, 'broken_at': 0}", tone: "danger" },
] as const;

const toneText: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

const toneBg: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

const toneChip: Record<Tone, string> = {
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  info: "border-info/30 bg-info/10 text-info",
};

const toneBorder: Record<Tone, string> = {
  success: "border-success",
  warning: "border-warning",
  danger: "border-danger",
  info: "border-info",
};

const toneSoftBorder: Record<Tone, string> = {
  success: "border-success/40",
  warning: "border-warning/40",
  danger: "border-danger/40",
  info: "border-info/40",
};

function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest ${toneChip[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${toneBg[tone]}`} aria-hidden />
      {label}
    </span>
  );
}

function EventCard({
  event,
  index,
  signed,
}: {
  event: AuditEvent;
  index: number;
  signed: boolean;
}) {
  const sigIsServer = event.sig.startsWith("server:");
  return (
    <li className="rounded-lg border border-border bg-surface-raised p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-faint">
            event {index} · {event.id}
          </p>
          <h4 className="mt-1 font-semibold">{event.type}</h4>
        </div>
        <span className="rounded-full bg-background px-2 py-1 font-mono text-[10px] text-muted">
          {event.actor}
        </span>
      </div>

      <dl className="mt-3 grid gap-2 text-xs">
        <div className="flex justify-between gap-3">
          <dt className="text-faint">payload</dt>
          <dd className="font-mono text-muted">{event.payload}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-faint">hash</dt>
          <dd className="font-mono text-muted">{event.hash}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-faint">sig</dt>
          <dd
            className={`font-mono ${
              signed ? (sigIsServer ? "text-success" : "text-danger") : "text-faint"
            }`}
          >
            {signed ? event.sig : "ignored by old verifier"}
          </dd>
        </div>
      </dl>
    </li>
  );
}

export default function View() {
  const [active, setActive] = useState<StepId>("genuine");
  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === active),
  );
  const step = steps[activeIndex] ?? steps[0];
  const events = step.chainKind === "genuine" ? genuineEvents : forgedEvents;
  const signed = step.id === "hmac-verify";

  const terminalLine = useMemo(() => {
    if (step.id === "plain-verify") {
      return "old verifier: {'valid': True, 'broken_at': None}";
    }
    if (step.id === "hmac-verify") {
      return "new verifier: {'valid': False, 'broken_at': 0}";
    }
    if (step.id === "rewrite") {
      return "forged chain staged: hashes recomputed";
    }
    return "genuine chain loaded: ready to verify";
  }, [step.id]);

  function nextStep() {
    const next = steps[Math.min(activeIndex + 1, steps.length - 1)];
    setActive(next.id);
  }

  return (
    <section className="space-y-8">
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              Interactive demo · Issue #57
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Catch a forged audit rewrite</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              Use the controls below during your demo. First show the normal audit chain, then
              rewrite the entire history, then compare the old hash-only verifier with the new
              HMAC-anchored verifier you shipped.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActive("genuine")}
              className="rounded-full border border-border px-3 py-1.5 text-sm text-muted transition hover:border-brand hover:text-foreground"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={nextStep}
              disabled={activeIndex === steps.length - 1}
              className="rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next step
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {steps.map((candidate, index) => {
            const isActive = candidate.id === step.id;
            return (
              <button
                key={candidate.id}
                type="button"
                onClick={() => setActive(candidate.id)}
                aria-pressed={isActive}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "border-brand bg-brand-tint font-medium text-brand"
                    : "border-border bg-background text-muted hover:border-brand hover:text-foreground"
                }`}
              >
                {index + 1}. {candidate.action}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className={`rounded-lg border border-l-4 bg-surface p-5 ${toneBorder[step.tone]}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className={`font-mono text-xs font-semibold uppercase tracking-widest ${toneText[step.tone]}`}>
                {step.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted">{step.explanation}</p>
            </div>
            <StatusBadge label={step.badge} tone={step.tone} />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface-raised p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">chain shown</p>
              <p className="mt-1 font-semibold">{step.chainKind}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-raised p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">verifier</p>
              <p className="mt-1 font-semibold">{step.verifier}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-raised p-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">broken_at</p>
              <p className="mt-1 font-mono text-lg font-semibold">{step.brokenAt}</p>
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-border bg-black p-4 font-mono text-xs text-zinc-100">
            <div className="mb-2 text-zinc-500">$ verify_audit_chain(events)</div>
            <span className={toneText[step.tone]}>{terminalLine}</span>
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
                Audit events
              </p>
              <h3 className="mt-1 font-semibold">
                {step.chainKind === "genuine" ? "Genuine server history" : "Forged replacement history"}
              </h3>
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 font-mono text-[10px] ${
                signed ? "border-brand text-brand" : "border-border text-faint"
              }`}
            >
              {signed ? "sig checked" : "hash only"}
            </span>
          </div>
          <ul className="mt-4 space-y-3">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} signed={signed} />
            ))}
          </ul>
        </aside>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-warning/40 border-l-4 border-l-warning bg-surface p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
            Before #57
          </p>
          <h3 className="mt-2 font-semibold">Hash linkage only</h3>
          <p className="mt-2 text-sm text-muted">
            Good at catching edits to one event. Weak against a full replacement history.
          </p>
        </div>

        <div className="rounded-lg border border-brand/40 border-l-4 border-l-brand bg-brand-tint p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
            What changed
          </p>
          <h3 className="mt-2 font-semibold">HMAC each event hash</h3>
          <p className="mt-2 text-sm text-muted">
            Each event stores <code>sig</code>, keyed by <code>RECEIPT_SECRET</code>. The secret
            stays outside the repo.
          </p>
        </div>

        <div className="rounded-lg border border-success/40 border-l-4 border-l-success bg-surface p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-success">
            After #57
          </p>
          <h3 className="mt-2 font-semibold">Whole rewrite fails</h3>
          <p className="mt-2 text-sm text-muted">
            The attacker can recompute hashes, but cannot produce server-keyed signatures.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            Shipped implementation
          </p>
          <ul className="mt-4 space-y-3">
            {shipped.map((item) => (
              <li key={item.label} className="rounded border border-border bg-surface-raised p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{item.label}</span>
                  <code className="font-mono text-xs text-brand">{item.value}</code>
                </div>
                <p className="mt-1.5 text-xs text-muted">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            Proof from PR #67
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-border bg-black p-4 font-mono text-xs text-zinc-100">
            <div className="mb-3 text-zinc-500">$ python issue_57_demo.py</div>
            <div className="space-y-2">
              {proofRows.map((row) => (
                <div
                  key={row.label}
                  className={`rounded border bg-zinc-950/80 px-3 py-2 ${toneSoftBorder[row.tone]}`}
                >
                  <span className="text-zinc-400">{row.label}: </span>
                  <span className={toneText[row.tone]}>{row.result}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm text-faint">
            The final row is the headline: the forged chain is rejected under the real server key.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-success/30 border-l-4 border-l-success bg-success/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-success">
          One-minute talk track
        </p>
        <p className="mt-2 text-muted">
          The hash chain catches edits. The signed anchor catches wholesale rewrites. We did not
          change any endpoint, did not write secrets, and kept the diff scoped to{" "}
          <code>src/audit.py</code> plus <code>tests/test_audit.py</code>.
        </p>
      </div>
    </section>
  );
}
