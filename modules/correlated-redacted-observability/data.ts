// Module-private data. Sourced from src/observability.py, docs/OBSERVABILITY-RUNBOOK.md,
// and tests/test_observability.py on es-intern-freshlens (#161).

export type TraceStep = {
  label: string;
  plain: string;
  tag: "start" | "normal" | "problem" | "recovered";
};

// The real event chain for one claim, in the order src/observability.py emits it.
// claim.anchor_pending / claim.anchor_failed only appear if a retry was needed —
// shown here as the branch that demonstrates the recovery story.
export const happyTrace: TraceStep[] = [
  { label: "Claim submitted", plain: "Shopper submits a photo + receipt.", tag: "start" },
  { label: "Claim scored", plain: "The freshness model gives an advisory score.", tag: "normal" },
  { label: "Decision recorded", plain: "A human reviewer approves or declines.", tag: "normal" },
];

export const failureTrace: TraceStep[] = [
  { label: "Claim submitted", plain: "Shopper submits a photo + receipt.", tag: "start" },
  { label: "Claim scored", plain: "The freshness model gives an advisory score.", tag: "normal" },
  {
    label: "Anchor problem detected",
    plain: "The tamper-evident record-keeping step didn't confirm in time.",
    tag: "problem",
  },
  {
    label: "Recovered automatically",
    plain: "The system retries the exact same request instead of guessing — no data lost, no duplicate claim.",
    tag: "recovered",
  },
];

export const recordedFields = [
  "which claim this event belongs to (a random ID, not a name)",
  "what happened (\"claim submitted\", \"decision recorded\", ...)",
  "the store and item involved",
  "the dollar amount requested / approved",
  "when it happened",
];

export const neverRecordedFields = [
  "the shopper's login token or password",
  "the produce photo or receipt image itself",
  "any account identifier",
  "raw text pulled off a receipt (OCR)",
  "a cryptographic signature or key",
];

export type RecoveryRow = {
  ifThis: string;
  thenThis: string;
};

export const recoveryTable: RecoveryRow[] = [
  {
    ifThis: "The AI scoring service is down or disabled",
    thenThis: "No action needed — the claim still reaches a human reviewer, honestly labeled as such.",
  },
  {
    ifThis: "The tamper-evident record-keeping step doesn't confirm in time",
    thenThis: "Don't undo anything. Retry the exact same request — it lands on the same decision, never a duplicate.",
  },
  {
    ifThis: "Exporting a report fails",
    thenThis: "Safe to just try again — exporting never changes any data, it only reads it.",
  },
  {
    ifThis: "The server itself crashes or runs out of memory",
    thenThis: "Restart it. Any claim that was only in memory at that moment is honestly lost, not silently recovered — this is a known, named limit of today's prototype, not something we paper over.",
  },
];

export const stats = {
  totalTests: 119,
  filesTouched: 3,
  commit: "e4e74b4",
};

export const timeline = [
  {
    date: "2026-07-28",
    label: "First slice — the recorder exists",
    detail:
      "src/observability.py can log an event for a claim, and refuses to log anything that isn't on an explicit allowed list of safe fields.",
  },
  {
    date: "2026-07-29",
    label: "Wired into the real claim flow",
    detail:
      "Every claim now gets logged at submit, scoring, decision, and — critically — both of the two ways the tamper-evident record-keeping step can go wrong.",
  },
  {
    date: "2026-07-30",
    label: "Proved it can't leak, and wrote the recovery guide",
    detail:
      "A test plants two fake secrets and proves neither ever shows up in a logged event, twice, byte-for-byte identically. The recovery guide above shipped alongside it.",
  },
];
