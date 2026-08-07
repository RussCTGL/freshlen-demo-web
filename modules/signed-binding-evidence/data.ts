// #157 — signed decision binding, replay resistance, anchor reconciliation.
// Told through one concrete grocery claim, audience-facing (no crypto, no PR/CI detail).

export type Tone = "success" | "danger" | "warning" | "neutral";

export const takeaway =
  "One purchase → one receipt → one decision. Once bound, they cannot be silently swapped or reused.";

export const scenario = {
  product: "Strawberries",
  store: "Fresh Market",
  purchaseAmount: "$5.99",
  claimAmount: "$5.99",
};

export const bindingBadges = ["Receipt matched", "Decision bound", "Approved"];

export type DemoAction = {
  id: string;
  label: string; // card heading, e.g. "Replay attempt"
  setup: string; // one short line of context
  buttonLabel: string;
  workingLabel: string; // shown briefly after click, before the result
  resultTitle: string; // e.g. "Blocked"
  resultBody: string; // e.g. "This receipt was already used."
  tone: Tone; // tone of the result badge
};

export const demoActions: DemoAction[] = [
  {
    id: "replay",
    label: "Replay attempt",
    setup: "Try to submit the same receipt a second time.",
    buttonLabel: "Use this receipt again",
    workingLabel: "Checking receipt…",
    resultTitle: "Blocked",
    resultBody: "This receipt was already used.",
    tone: "danger",
  },
  {
    id: "duplicate",
    label: "Duplicate claim",
    setup: "A second claim tries to use the same purchase.",
    buttonLabel: "Submit duplicate claim",
    workingLabel: "Checking purchase…",
    resultTitle: "Duplicate detected",
    resultBody: "This purchase already has a claim.",
    tone: "danger",
  },
  {
    id: "swap",
    label: "Changed receipt",
    setup: "Try to attach the decision to a different receipt.",
    buttonLabel: "Swap receipt",
    workingLabel: "Comparing receipts…",
    resultTitle: "Rejected",
    resultBody: "Receipt does not match the original claim.",
    tone: "danger",
  },
];

export const reconciliationRecords = {
  claim: [
    { label: "Product", value: scenario.product },
    { label: "Amount", value: scenario.claimAmount },
  ],
  receipt: [
    { label: "Store", value: scenario.store },
    { label: "Amount", value: scenario.purchaseAmount },
  ],
};
