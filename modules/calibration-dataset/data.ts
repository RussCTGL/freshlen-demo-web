// Module-private data. Snapshot of data/calibration/index.csv (issue #29).
import type { StatRow } from "@/components/StatBars";

export const total = 154;

export const produceTypes: StatRow[] = [
  { name: "apple", count: 23 },
  { name: "banana", count: 21 },
  { name: "orange", count: 18 },
  { name: "bellpepper", count: 18 },
  { name: "broccoli", count: 17 },
  { name: "tomato", count: 16 },
  { name: "strawberry", count: 16 },
  { name: "cucumber", count: 14 },
  { name: "cilantro", count: 11 },
];

export const trueState: StatRow[] = [
  { name: "borderline", count: 57 },
  { name: "fresh", count: 52 },
  { name: "spoiled", count: 45 },
];

export const source: StatRow[] = [
  { name: "phone", count: 67 },
  { name: "web", count: 62 },
  { name: "ai_fake", count: 20 },
  { name: "sample_images", count: 5 },
];
