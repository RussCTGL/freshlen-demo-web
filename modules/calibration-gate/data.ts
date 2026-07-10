// Module-private data. Snapshot of docs/CALIBRATION.md (es-intern-freshlens, issue #55, PR #68).
import type { StatRow } from "@/components/StatBars";

export const scored = 154;
export const backend = "es-api";
export const gate = "RE-SCOPE";

export type ChangeRow = {
  metric: string;
  before: string;
  after: string;
  change: "worse" | "much worse" | "unchanged";
};

// Week 3 (pre-upgrade, PR #49) vs Issue #55 re-run (post fail-safe-serving upgrade, 2026-07-09).
export const beforeAfter: ChangeRow[] = [
  {
    metric: "0.7–0.85 confidence bin accuracy",
    before: "83.3% (15/18)",
    after: "61.1% (11/18)",
    change: "worse",
  },
  {
    metric: "0.85–1.0 confidence bin accuracy",
    before: "66.9% (91/136)",
    after: "47.8% (65/136)",
    change: "worse",
  },
  {
    metric: "High-confidence (0.85+), fresh accuracy",
    before: "93.8%",
    after: "39.6%",
    change: "much worse",
  },
  {
    metric: "High-confidence (0.85+), spoiled accuracy",
    before: "0.0%",
    after: "0.0%",
    change: "unchanged",
  },
  {
    metric: "Auto-approve % (any threshold, 0.80/0.85/0.90)",
    before: "0.0%",
    after: "0.0%",
    change: "unchanged",
  },
  {
    metric: "AI-fake rows flagged confident-bad (of 20)",
    before: "0 (0.0%)",
    after: "0 (0.0%)",
    change: "unchanged",
  },
  {
    metric: "Gate decision",
    before: "RE-SCOPE",
    after: "RE-SCOPE",
    change: "unchanged",
  },
];

// Post-upgrade quality_category distribution (computed from data/calibration/results.csv,
// the Issue #55 re-run) — contrast with the Week 3 pre-upgrade split (fresh 96 / markdown 58).
export const quality: StatRow[] = [
  { name: "fresh", count: 33 },
  { name: "markdown", count: 121 },
  { name: "conversion", count: 0 },
  { name: "waste", count: 0 },
];

export const qualityBefore: StatRow[] = [
  { name: "fresh", count: 96 },
  { name: "markdown", count: 58 },
  { name: "conversion", count: 0 },
  { name: "waste", count: 0 },
];

export const dataQualityAnomaly = {
  rows: 6,
  total: 154,
  example: {
    id: "bellpepper_spoiled_005",
    canonicalScore: 70,
    bucket: "conversion",
    reportedCategory: "fresh",
  },
};
