// Module-private data for #76 — Item Identity + Fraud Signals.
// Everything below is a representative example curated for this demo, NOT an
// aggregate evaluation result. For graded results over the full evidence set,
// see #81's Item-Identity Evidence Eval (modules/identity-evidence-eval).

/** matches_receipt_item's own min_confidence floor — below it the matcher answers None. */
export const matcherFloor = 0.5;

export type IdentityOutcome = "match" | "mismatch" | "unknown";

export type MatchExample = {
  key: string;
  outcome: IdentityOutcome;
  receiptLabel: string;
  normalizedLabel: string;
  predictedLabel: string;
  confidence: number | null;
  note: string;
};

/** One representative example per identity outcome — not a sample of graded rows. */
export const matchExamples: MatchExample[] = [
  {
    key: "normalized-match",
    outcome: "match",
    receiptLabel: "Bananas, Organic",
    normalizedLabel: "banana",
    predictedLabel: "banana",
    confidence: 0.91,
    note: "Receipt phrasing normalizes to the same produce label the classifier predicts.",
  },
  {
    key: "confident-mismatch",
    outcome: "mismatch",
    receiptLabel: "Avocado",
    normalizedLabel: "avocado",
    predictedLabel: "mango",
    confidence: 0.88,
    note: "Confident prediction disagrees with the normalized receipt label.",
  },
  {
    key: "low-confidence-unknown",
    outcome: "unknown",
    receiptLabel: "Heirloom Tomato",
    normalizedLabel: "tomato",
    predictedLabel: "tomato",
    confidence: 0.34,
    note: "Confidence falls below the 0.50 floor, so the matcher withholds an answer (match=None).",
  },
];

export type RiskLevel = "low" | "medium" | "high";

export type RiskSignal = {
  key: string;
  level: RiskLevel;
  description: string;
};

/** Advisory photo-risk signals. None of these decide anything on their own. */
export const riskSignals: RiskSignal[] = [
  {
    key: "missing_metadata",
    level: "medium",
    description: "Photo carries no EXIF metadata block at all.",
  },
  {
    key: "exif_ts_mismatch",
    level: "medium",
    description: "EXIF capture time is inconsistent with the claim submission time.",
  },
  {
    key: "uniform_background",
    level: "high",
    description: "Background is unusually flat and uniform — a common staged-photo tell.",
  },
  {
    key: "blur_score",
    level: "low",
    description: "Image sharpness falls below the reference threshold.",
  },
];

export type HighRiskExample = {
  identityOutcome: IdentityOutcome;
  triggeredSignals: string[];
  riskLevel: RiskLevel;
  route: string;
};

/** A single representative high-risk result — not an aggregate rate. */
export const highRiskExample: HighRiskExample = {
  identityOutcome: "mismatch",
  triggeredSignals: ["exif_ts_mismatch", "uniform_background"],
  riskLevel: "high",
  route: "Human review",
};
