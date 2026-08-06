// All figures are from the two merged PRs this card covers:
// PR #46 (issue #30, adjudication ladder) and PR #50 (issue #35, walking skeleton).

export const stats = [
  { label: "Routes shipped", value: "4" },
  { label: "Ladder tests", value: "29" },
  { label: "Suite after merge", value: "552 passed" },
];

/** AGENTS.md non-negotiable #4: the model call is step 5, never step 1. */
export const order = [
  { step: "Atomic cap", note: "re-read under a lock at the moment of approval" },
  { step: "Duplicate photo hash", note: "" },
  { step: "Duplicate purchase key", note: "" },
  { step: "Capture metadata", note: "server-side validation" },
  { step: "Model call", note: "LAST — everything cheap and deterministic runs first" },
  { step: "adjudicate()", note: "pure function, no IO" },
];

export const bands = [
  {
    band: "1",
    condition: "confidence is None",
    outcome: "human_review",
    code: "low_confidence_escalate",
  },
  {
    band: "2",
    condition: "min_confidence_for_auto > 1.0",
    outcome: "human_review",
    code: "calibration_disabled",
  },
  {
    band: "3",
    condition: "score >= 70 AND confidence >= floor AND amount <= $5.00 AND within cap",
    outcome: "auto_approve",
    code: "obvious_defect_under_cap",
  },
  {
    band: "4",
    condition: "fallback",
    outcome: "human_review",
    code: "gray_zone_escalate",
  },
];

/** Both found by running the guardrail checklists against the final diff, before the PR. */
export const races = [
  {
    title: "The cap check was not atomic",
    detail:
      "Two concurrent requests on one account could each read a stale remaining cap and jointly overspend it. The cap is now re-read and the decision saved under one lock. Proved with a multi-threaded test.",
  },
  {
    title: "evaluate_claim was not idempotent under concurrency",
    detail:
      "Two concurrent calls on one claim could both pass the submitted guard and both run the pipeline. Now locked; the loser gets 409 instead of a null decision or a double charge.",
  },
];

export const deferred =
  "remaining_cap_cents is computed but not surfaced in any HTTP response yet (SPEC §6 disclosure). Named as deferred rather than quietly dropped — it lands in week 6.";
