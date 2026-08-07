"use client";

// Week-3 walking skeleton, told as the decision journey it is: one claim walks the
// adjudication ladder and lands on human review. The point of Week 3 wasn't to build the
// smart (auto-approve) path — it was to PROVE the safe default. Every beat here is pinned
// by a test in tests/test_policy.py (#36, PR #51); links are in the footer.

import { useState } from "react";

type Tone = "muted" | "success" | "warning";

const toneDot: Record<Tone, string> = {
  muted: "border-border text-faint",
  success: "border-success/50 bg-success/10 text-success",
  warning: "border-warning/50 bg-warning/10 text-warning",
};

// The three checks the claim clears before the verdict. In Week 1 the gate is closed,
// so the destination is always the same.
const CHECKS: { label: string; detail: string; tone: Tone; test: string }[] = [
  {
    label: "Spending cap",
    detail: "Under the $15 / month cap — room left.",
    tone: "success",
    test: "test_request_above_per_claim_cap_requires_human_review",
  },
  {
    label: "Duplicate check",
    detail: "New photo, new purchase — not a repeat.",
    tone: "success",
    test: "test_week1_default_policy_always_human_review",
  },
  {
    label: "Calibration gate",
    detail: "CLOSED — the model isn't proven yet (RE-SCOPE).",
    tone: "warning",
    test: "test_week1_calibration_gate_closed_human_review",
  },
];

const GUARANTEES: { big: string; small: string; test: string }[] = [
  {
    big: "A human decides",
    small: "Even this 86%-confident claim — the gate stays closed until calibration proves the model.",
    test: "test_week1_high_confidence_still_routes_to_calibration_disabled",
  },
  {
    big: "The machine never declines",
    small: "The engine can route to a person, but it never says “no” on its own.",
    test: "test_engine_never_returns_decline",
  },
  {
    big: "Nothing pays out silently",
    small: "A claim in review carries $0 — money is only attached by a human.",
    test: "test_human_review_always_has_zero_amount",
  },
];

const LAST = CHECKS.length + 1; // step index of the verdict

export default function View() {
  // step 0 = only the claim; 1..3 = checks revealed; LAST = verdict + guarantees
  const [step, setStep] = useState(0);
  const atVerdict = step >= LAST;

  const next = () => setStep((s) => (s >= LAST ? 0 : s + 1));
  const cta =
    step === 0 ? "Run the checks ▶" : step < CHECKS.length ? "Keep going ▶" : atVerdict ? "Run it again ↺" : "See the verdict ▶";

  return (
    <section className="space-y-6">
      <p className="max-w-prose text-sm text-muted">
        My Week-3 task (<span className="text-foreground">#36</span>) was to write the tests that prove
        the walking skeleton&apos;s <span className="text-foreground">safe default</span> — that before any
        automation is trusted, every refund claim routes to a human, the engine never declines on its own,
        and nothing pays out silently. Here is that default as a journey — step through it.
      </p>

      <div className="mx-auto max-w-md space-y-1">
        {/* the claim */}
        <div className="rounded-xl border border-border bg-surface-raised p-4">
          <p className="text-xs uppercase tracking-widest text-faint">Claim submitted</p>
          <p className="mt-1 text-lg font-semibold text-foreground">Strawberries · $5.00</p>
          <p className="text-sm text-muted">Model says: 86% confident it&apos;s spoiled.</p>
        </div>

        {/* the ladder */}
        {CHECKS.map((c, i) => {
          const shown = step > i;
          return (
            <div key={c.label} className="flex flex-col items-center">
              <div className={`h-4 w-px ${shown ? "bg-border-strong" : "bg-border"}`} />
              <div
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
                  shown ? toneDot[c.tone] : "border-dashed border-border opacity-40"
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs">
                  {shown ? (c.tone === "warning" ? "!" : "✓") : i + 1}
                </span>
                <span>
                  <span className="block text-sm font-medium text-foreground">{c.label}</span>
                  <span className="block text-xs text-muted">{shown ? c.detail : "…"}</span>
                </span>
              </div>
            </div>
          );
        })}

        {/* the verdict */}
        <div className="flex flex-col items-center">
          <div className={`h-4 w-px ${atVerdict ? "bg-border-strong" : "bg-border"}`} />
          <div
            className={`w-full rounded-xl border-2 px-4 py-4 text-center transition-all ${
              atVerdict ? "border-info/50 bg-info/10" : "border-dashed border-border opacity-40"
            }`}
          >
            <p className={`text-lg font-bold tracking-wide ${atVerdict ? "text-info" : "text-faint"}`}>
              HUMAN REVIEW
            </p>
            <p className="text-xs text-muted">{atVerdict ? "A person decides. Always, in Week 1." : "…"}</p>
          </div>
        </div>
      </div>

      {/* the three guarantees, revealed at the verdict */}
      {atVerdict && (
        <div className="mx-auto grid max-w-md gap-3 sm:grid-cols-1">
          {GUARANTEES.map((g) => (
            <div key={g.big} className="rounded-lg border border-border bg-surface p-4">
              <p className="text-sm font-semibold text-foreground">{g.big}</p>
              <p className="mt-1 text-xs text-muted">{g.small}</p>
            </div>
          ))}
          <p className="text-center text-sm font-medium text-foreground">
            Before any automation: a human decides, the machine never declines, nothing pays out on its own.
          </p>
        </div>
      )}

      {/* control */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={next}
          className="rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          {cta}
        </button>
      </div>

      {/* honesty footer — the proof lives in a test file + PR, not on the screen */}
      <p className="border-t border-border pt-4 text-center text-xs text-faint">
        Every step above is pinned by a test in{" "}
        <code className="text-muted">tests/test_policy.py</code> —{" "}
        <a
          className="underline hover:text-muted"
          href="https://github.com/LawrenceHua/es-intern-freshlens/pull/51"
          target="_blank"
          rel="noreferrer"
        >
          #36 / PR&nbsp;#51
        </a>
        . The Friday gate that closed the calibration door: RE-SCOPE, human-review-only.
      </p>
    </section>
  );
}
