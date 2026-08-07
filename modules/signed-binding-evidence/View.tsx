"use client";

import { useState } from "react";
import {
  takeaway,
  scenario,
  bindingBadges,
  demoActions,
  reconciliationRecords,
  type Tone,
} from "./data";

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
  neutral: "text-muted",
};

const TONE_BG: Record<Tone, string> = {
  success: "bg-success/10",
  danger: "bg-danger/10",
  warning: "bg-warning/10",
  neutral: "bg-surface",
};

function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${TONE_BORDER[tone]} ${TONE_TEXT[tone]} ${TONE_BG[tone]}`}
    >
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
      {children}
    </h3>
  );
}

type Status = "idle" | "working" | "done";

/** One interactive attack card: idle → working (brief) → result. Click again to reset. */
function ActionCard({
  action,
}: {
  action: (typeof demoActions)[number];
}) {
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
      <p className="text-sm font-semibold text-foreground">{action.label}</p>
      <p className="mt-1 text-sm text-muted">{action.setup}</p>

      <button
        type="button"
        onClick={run}
        className="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        disabled={status === "working"}
      >
        {status === "done" ? "Try again" : action.buttonLabel}
      </button>

      <div className="mt-4 min-h-[4.5rem]">
        {status === "working" ? (
          <p className="text-sm text-faint">{action.workingLabel}</p>
        ) : status === "done" ? (
          <div
            className={`rounded-xl border p-3 ${TONE_BORDER[action.tone]} ${TONE_BG[action.tone]}`}
          >
            <p className={`text-sm font-bold ${TONE_TEXT[action.tone]}`}>
              {action.resultTitle}
            </p>
            <p className="mt-0.5 text-sm text-muted">{action.resultBody}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RecordBox({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <SectionTitle>{title}</SectionTitle>
      <dl className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="text-sm text-muted">{row.label}</dt>
            <dd className="text-sm font-semibold text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function AnchorReconciliation() {
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
    <section>
      <SectionTitle>Anchor reconciliation</SectionTitle>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <RecordBox title="Claim record" rows={reconciliationRecords.claim} />
        <RecordBox title="Receipt record" rows={reconciliationRecords.receipt} />
      </div>
      <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={run}
          disabled={status === "working"}
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {status === "done" ? "Check again" : "Check records"}
        </button>
        {status === "working" ? (
          <p className="text-sm text-faint">Comparing…</p>
        ) : status === "done" ? (
          <Badge tone="success">Records match ✓</Badge>
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

      {/* A. The claim — established, bound state */}
      <section>
        <SectionTitle>The claim</SectionTitle>
        <div className="mt-3 rounded-2xl border border-border bg-surface p-5">
          <div className="grid gap-3 text-sm sm:grid-cols-4">
            <div>
              <p className="text-faint">Product</p>
              <p className="mt-0.5 font-semibold text-foreground">{scenario.product}</p>
            </div>
            <div>
              <p className="text-faint">Store</p>
              <p className="mt-0.5 font-semibold text-foreground">{scenario.store}</p>
            </div>
            <div>
              <p className="text-faint">Purchase</p>
              <p className="mt-0.5 font-semibold text-foreground">{scenario.purchaseAmount}</p>
            </div>
            <div>
              <p className="text-faint">Claim</p>
              <p className="mt-0.5 font-semibold text-foreground">{scenario.claimAmount}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {bindingBadges.map((label) => (
              <Badge key={label} tone="success">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* B, C, D. Interactive attack attempts */}
      <section>
        <SectionTitle>Try to break it</SectionTitle>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {demoActions.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
        </div>
      </section>

      {/* E. Anchor reconciliation */}
      <AnchorReconciliation />
    </div>
  );
}
