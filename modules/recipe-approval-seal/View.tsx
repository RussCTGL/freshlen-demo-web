"use client";

import { useState } from "react";
import { takeaway, scenario, caseActions, type Tone } from "./data";

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

function CaseCard({ action }: { action: (typeof caseActions)[number] }) {
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
      <button
        type="button"
        onClick={run}
        disabled={status === "working"}
        className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "done" ? "Try again" : action.label}
      </button>

      <div className="mt-4 min-h-[6.5rem]">
        {status === "working" ? (
          <p className="text-sm text-faint">{action.workingLabel}</p>
        ) : status === "done" ? (
          <div className={`rounded-xl border p-3 ${TONE_BORDER[action.tone]} ${TONE_BG[action.tone]}`}>
            <p className={`text-sm font-bold ${TONE_TEXT[action.tone]}`}>{action.resultTitle}</p>
            <p className="mt-1 text-sm text-muted">{action.resultBody}</p>
            {action.showsRecipe && action.stepText ? (
              <p className="mt-2 rounded-lg bg-background px-3 py-2 text-xs text-muted">
                &ldquo;{action.stepText}&rdquo;
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function View() {
  return (
    <div className="space-y-10">
      {/* Main message */}
      <div className="rounded-2xl border border-brand/30 bg-brand-tint p-6">
        <p className="text-lg font-semibold leading-snug text-foreground">{takeaway}</p>
      </div>

      {/* The suggestion */}
      <section>
        <SectionTitle>The suggestion</SectionTitle>
        <div className="mt-3 rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-foreground">{scenario.title}</p>
          <p className="mt-1 text-sm text-muted">{scenario.context}</p>
        </div>
      </section>

      {/* Try it */}
      <section>
        <SectionTitle>Try it</SectionTitle>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {caseActions.map((action) => (
            <CaseCard key={action.id} action={action} />
          ))}
        </div>
      </section>
    </div>
  );
}
