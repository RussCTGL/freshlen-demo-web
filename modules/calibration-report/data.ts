// Module-private data. Sourced from docs/CALIBRATION.md history (es-intern-freshlens, issue
// #33, PR #49) and scripts/calibration_report.py — the Week 3 (build Week 1) gate experiment.
// Same source numbers as modules/calibration-gate's "before" column (issue #55 re-ran the same
// dataset later); this module covers the run itself, not the re-run comparison.
import type { StatRow } from "@/components/StatBars";

export const scored = 154;
export const backend = "es-api";
export const gate = "RE-SCOPE";

export type MetricRow = {
  metric: string;
  value: string;
};

export const metric1: MetricRow[] = [
  { metric: "0.7–0.85 confidence bin accuracy", value: "83.3% (15/18)" },
  { metric: "0.85–1.0 confidence bin accuracy", value: "66.9% (91/136)" },
  { metric: "High-confidence (0.85+), fresh accuracy", value: "93.8%" },
  { metric: "High-confidence (0.85+), spoiled accuracy", value: "0.0%" },
];

export const metric2: MetricRow[] = [
  { metric: "Auto-approve %, threshold 0.80", value: "0.0%" },
  { metric: "Auto-approve %, threshold 0.85", value: "0.0%" },
  { metric: "Auto-approve %, threshold 0.90", value: "0.0%" },
];

export const metric3: MetricRow[] = [
  { metric: "AI-fake rows in dataset", value: "20" },
  { metric: "Confident (>=0.80) bad-freshness verdict", value: "0 (0.0%)" },
  { metric: "...of those, specifically waste-bucketed", value: "0 (0.0%)" },
];

export const quality: StatRow[] = [
  { name: "fresh", count: 96 },
  { name: "markdown", count: 58 },
  { name: "conversion", count: 0 },
  { name: "waste", count: 0 },
];

export type ReviewCatch = {
  title: string;
  detail: string;
};

export const reviewCatches: ReviewCatch[] = [
  {
    title: "GO WITH MITIGATION bypass",
    detail:
      "determine_gate()'s GO WITH MITIGATION branch could clear the gate without actually meeting the required >=80%-accuracy-on-both-fresh-and-spoiled bar. Both the claim-reviewer and reviewer subagents flagged the same bug independently — fixed and regression-tested before the report shipped.",
  },
  {
    title: "Unverified \"0 error rows\" claim",
    detail:
      "The report asserted \"0 error rows\" without actually computing it — a hardcoded string, not a real tally. Replaced with compute_backend_summary(), which counts non-es-api-backend and missing-confidence/quality_category rows for real.",
  },
];

export const openQuestion =
  "The handoff doc that supplied the dataset flagged a possibility that was never confirmed: the ES proxy available to the program may be a demo/stub tuned to score fresh-leaning, rather than the eventual production model. If so, RE-SCOPE reflects the proxy's behavior today, not necessarily a ceiling on the real model.";
