// Module-private data. Sourced from src/observability.py, docs/OBSERVABILITY-RUNBOOK.md,
// and tests/test_observability.py on es-intern-freshlens (#161).

export type ClaimTag = "A" | "B" | "C";

export type StreamEntry = {
  claim: ClaimTag;
  event: string;
};

// Illustrates the flight-recorder idea itself: several claims logging at the same time,
// interleaved in the order they'd actually be written — before anyone filters by claim_id.
export const mixedStream: StreamEntry[] = [
  { claim: "A", event: "submitted" },
  { claim: "B", event: "submitted" },
  { claim: "A", event: "scored" },
  { claim: "C", event: "submitted" },
  { claim: "B", event: "scored" },
  { claim: "A", event: "decided" },
  { claim: "C", event: "scored" },
  { claim: "B", event: "decided" },
  { claim: "C", event: "decided" },
];

export const claimLabels: Record<ClaimTag, string> = {
  A: "Claim A",
  B: "Claim B",
  C: "Claim C",
};

export const claimSwatch: Record<ClaimTag, string> = {
  A: "border-brand/40 bg-brand-tint text-brand-strong",
  B: "border-warning/40 bg-warning/10 text-warning",
  C: "border-border-strong bg-surface-raised text-foreground",
};

export type FlowStep = {
  actor: "system" | "service";
  label: string;
  tag: "normal" | "problem" | "recovered";
};

// What happens when a human reviewer's decision gets anchored (tamper-evident recorded).
// Sourced from the AnchorReconciliationRequired recovery row in docs/OBSERVABILITY-RUNBOOK.md:
// "Do not roll back. The anchor already accepted the digest. Retry the exact same request;
// review_claim reconciles idempotently to the same decision/anchor."
export const confirmedFlow: FlowStep[] = [
  { actor: "system", label: "Send decision-record request (id: r_8f21)", tag: "normal" },
  { actor: "service", label: "Confirmed — recorded", tag: "normal" },
];

export const missingConfirmationFlow: FlowStep[] = [
  { actor: "system", label: "Send decision-record request (id: r_9a44)", tag: "normal" },
  {
    actor: "service",
    label: "No confirmation comes back — e.g. a network hiccup",
    tag: "problem",
  },
  {
    actor: "system",
    label: "Retry — the exact same request, same id: r_9a44",
    tag: "normal",
  },
  {
    actor: "service",
    label: "Recognizes id r_9a44 as already seen — returns the same result, does not record it twice",
    tag: "recovered",
  },
];

export const escalationNote =
  "And if the retry itself doesn't confirm either? The system doesn't just keep silently retrying forever — repeated failures get flagged to a human as a possible problem with the recording service itself, not papered over. Either way, the claim is never left in a broken state.";

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
