// Module-private data. Snapshot of data/calibration/results.csv (issue #32).
import type { StatRow } from "@/components/StatBars";

export const scored = 154;
export const backend = "es-api";

export const confidence = { min: 0.716, max: 1.0, mean: 0.937 };

export const quality: StatRow[] = [
  { name: "fresh", count: 96 },
  { name: "markdown", count: 58 },
];

// Canonical scale: 0 = fresh … 100 = urgent. Bucket edges match the app.
export const canonicalBuckets: StatRow[] = [
  { name: "fresh (0–45)", count: 153 },
  { name: "markdown (46–70)", count: 1 },
  { name: "waste (71–100)", count: 0 },
];
