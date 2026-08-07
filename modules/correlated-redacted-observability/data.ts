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
  { actor: "system", label: "Send decision\n(id r_8f21)", tag: "normal" },
  { actor: "service", label: "Confirmed", tag: "recovered" },
];

export const missingConfirmationFlow: FlowStep[] = [
  { actor: "system", label: "Send decision\n(id r_9a44)", tag: "normal" },
  { actor: "service", label: "No response", tag: "problem" },
  { actor: "system", label: "Retry\nsame id", tag: "normal" },
  { actor: "service", label: "Same result\nno duplicate", tag: "recovered" },
];

export const escalationNote =
  "If the retry doesn't confirm either, it isn't retried forever — a human gets flagged instead of the claim being left in limbo.";

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
    ifThis: "AI scoring is down",
    thenThis: "No action — still reaches a human reviewer, honestly labeled.",
  },
  {
    ifThis: "Anchoring doesn't confirm",
    thenThis: "Don't undo. Retry the same request — same decision, never a duplicate.",
  },
  {
    ifThis: "Report export fails",
    thenThis: "Just retry — exporting only reads data, it never changes any.",
  },
  {
    ifThis: "Server crashes / OOM",
    thenThis: "Restart. In-memory claims are honestly lost — a known limit, not hidden.",
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
    label: "Recorder built",
    detail: "Logs safe fields only, by an explicit allow-list.",
  },
  {
    date: "2026-07-29",
    label: "Wired into claims",
    detail: "Every submit, score, decide, and anchor-failure logged.",
  },
  {
    date: "2026-07-30",
    label: "Proved leak-free",
    detail: "Two fake secrets, never once in a logged event.",
  },
];
