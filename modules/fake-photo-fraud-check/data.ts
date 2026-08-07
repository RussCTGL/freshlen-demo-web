// #34 — AI-fake detection probe: a fraud-safety scan over known AI-generated
// "fake damage" photos, checking how many would confidently fool a
// confidence-based approval. Told through one grocery claim, audience-facing.

export type Tone = "success" | "danger" | "warning" | "neutral";

export const takeaway =
  "The AI can't tell a real photo from a fake one by looking. So a separate safety scan checks how often a fake would slip through anyway.";

export const scenario = {
  product: "Blueberries",
  claimReason: "Arrived spoiled",
};

export type PhotoCheck = {
  id: string;
  label: string; // button label
  photoLabel: string; // e.g. "Real photo"
  freshnessRead: string; // e.g. "Spoiled"
  confidence: number; // 0-100
  note: string; // short honest takeaway line
  tone: Tone;
};

export const photoChecks: PhotoCheck[] = [
  {
    id: "real",
    label: "Try a real photo",
    photoLabel: "Real photo",
    freshnessRead: "Spoiled",
    confidence: 91,
    note: "Still goes to a person for the final call.",
    tone: "neutral",
  },
  {
    id: "fake",
    label: "Try an AI-generated fake photo",
    photoLabel: "AI-generated photo",
    freshnessRead: "Spoiled",
    confidence: 87,
    note: "Reads almost the same as the real one — the model can't tell it's fake just by looking.",
    tone: "warning",
  },
];

export const scanResult = {
  buttonLabel: "Run the fraud-safety scan",
  workingLabel: "Scanning known fake photos…",
  samplesTested: 20,
  slippedThrough: 3,
  slippedThroughPct: 15,
  limit: 30, // percent
  resultTitle: "Safety scan: PASS",
  resultBody:
    "3 of 20 known fake photos would have confidently fooled the check — well under the 30% safety limit.",
  tone: "success" as Tone,
};
