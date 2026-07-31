// #157 — signed decision binding, replay resistance, anchor reconciliation.
// Evidence below reflects PR #191 (merged), based on PR #188 (merged).

export const evidenceLabels = ["Tamper rejected", "Replay rejected", "Anchor reconciled"];

export type Tone = "success" | "danger" | "warning";

export const resultCards: {
  title: string;
  status: string;
  tone: Tone;
  caption: string;
}[] = [
  {
    title: "Immutable binding",
    status: "VERIFIED",
    tone: "success",
    caption: "Modified decision content fails verification.",
  },
  {
    title: "Replay defense",
    status: "REJECTED",
    tone: "danger",
    caption: "A previously valid signed request cannot be reused.",
  },
  {
    title: "Anchor reconciliation",
    status: "MATCHED",
    tone: "success",
    caption: "The decision is accepted only for the expected anchor.",
  },
];

export const flowSteps = [
  "Decision payload",
  "Canonical bytes",
  "Signature verification",
  "Replay check",
  "Anchor reconciliation",
  "Accepted / rejected",
];

export const caseRows: {
  label: string;
  input: string;
  result: "REJECTED" | "ACCEPTED";
}[] = [
  {
    label: "Tamper case",
    input: "Signed payload modified after signing",
    result: "REJECTED",
  },
  {
    label: "Replay case",
    input: "Previously accepted signed request reused",
    result: "REJECTED",
  },
  {
    label: "Valid case",
    input: "Original payload + valid signature + expected anchor",
    result: "ACCEPTED",
  },
];

export const evidenceRows: { label: string; value: string; tone: Tone }[] = [
  { label: "PR #188 dependency", value: "MERGED", tone: "success" },
  { label: "PR #191", value: "APPROVED", tone: "success" },
  { label: "Required CI checks", value: "5 / 5 PASS", tone: "success" },
  { label: "CI result", value: "2180 passed, 23 skipped, 0 failed", tone: "success" },
  { label: "Merged/base validation", value: "COMPLETE", tone: "success" },
];

export const takeaway =
  "Accepted decisions are authentic, untampered, non-replayed, and bound to the correct anchor.";
