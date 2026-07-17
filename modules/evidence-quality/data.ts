// Module-private data. Numbers printed by scripts/make_evidence_fixtures.py
// (main repo, issue #85) after the seeded build (`all`, seed 85) — re-paste
// the block it prints if the seed or calibration set changes.
import type { StatRow } from "@/components/StatBars";

export const totalCases = 82;
export const matchCases = 40;
export const mismatchCases = 20;
export const fraudCases = 22;

export const fraudByType: StatRow[] = [
  { name: "ai_fake", count: 6 },
  { name: "blur", count: 4 },
  { name: "exif_stripped", count: 4 },
  { name: "screenshot", count: 4 },
  { name: "uniform_background", count: 4 },
];

export const manifestSha = "b77cdf0d1724dc77…";

// The manifest schema — frozen with Yizhou (#81) and Tony (#79) before
// Wednesday office hours. Renames after that require all three sign-offs.
export const schema = [
  { col: "case_id", meaning: "unique, stable row id (ev_0001…)" },
  { col: "image_path", meaning: "repo-relative path to the evidence photo" },
  {
    col: "receipt_item_label",
    meaning:
      "receipt string as printed — plurals, synonyms, SKU text — so the #76 NORMALIZE_MAP faces real strings",
  },
  { col: "true_item", meaning: "what the photo actually shows (or none / unknown)" },
  { col: "expected_match", meaning: "identity ground truth: true | false | uncertain" },
  { col: "fraud_type", meaning: "none or one of five fraud signals" },
  { col: "captured_in_app", meaning: "provenance: did this come from our capture flow?" },
  { col: "notes", meaning: "row provenance (which calibration photo it reuses)" },
];

export const fraudSignals = [
  {
    type: "uniform_background",
    simulates: "a blank frame submitted instead of the produce",
    detector: "near-zero pixel variance",
  },
  {
    type: "blur",
    simulates: "a photo too degraded to verify anything",
    detector: "Laplacian variance forced below 25",
  },
  {
    type: "exif_stripped",
    simulates: "provenance deliberately removed",
    detector: "zero EXIF metadata on a claimed phone capture",
  },
  {
    type: "screenshot",
    simulates: "re-submitting a screenshot of an old photo",
    detector: "phone-UI chrome, recapture artifacts (approximation)",
  },
  {
    type: "ai_fake",
    simulates: "generated produce that never existed",
    detector: "reuses the Week-3/4 ai_fake calibration photos",
  },
] as const;

// Example receipt strings the identity check must survive (all appear in
// real manifest rows).
export const labelExamples = [
  { raw: "bananas", canonical: "banana" },
  { raw: "gala apple", canonical: "apple" },
  { raw: "TOMATO ROMA", canonical: "tomato" },
  { raw: "STRAWBERRIES 1LB", canonical: "strawberry" },
  { raw: "english cucumber", canonical: "cucumber" },
];

export const produceTypes = [
  "apple",
  "banana",
  "bellpepper",
  "broccoli",
  "cucumber",
  "orange",
  "strawberry",
  "tomato",
] as const;
