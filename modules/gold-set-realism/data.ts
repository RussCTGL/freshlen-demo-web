// Module-private data. Numbers computed by scripts/evaluation_realism.py
// (main repo, issue #59) against data/calibration/index.csv @ 154 rows.
import type { StatRow } from "@/components/StatBars";

export const total = 154;
export const webRows = 62; // 40% of a set meant to validate PHONE photos
export const spoiledPhoneTotal = 4; // in the ENTIRE dataset

// Phone-vs-web mix per ground-truth label (the confound).
export const confound = [
  { state: "fresh", phone: 37, web: 13, other: 2, webShare: "25%" },
  { state: "borderline", phone: 26, web: 18, other: 13, webShare: "32%" },
  { state: "spoiled", phone: 4, web: 31, other: 10, webShare: "69%" },
];

// Spoiled phone photos on hand per produce type (need >= 16 per bucket to
// certify precision >= 0.80 at the Wilson 95% lower bound on a perfect run).
export const spoiledPhonePerType: StatRow[] = [
  { name: "tomato", count: 3 },
  { name: "cilantro", count: 1 },
  { name: "apple", count: 0 },
  { name: "banana", count: 0 },
  { name: "bellpepper", count: 0 },
  { name: "broccoli", count: 0 },
  { name: "cucumber", count: 0 },
  { name: "orange", count: 0 },
  { name: "strawberry", count: 0 },
];

export const certifyBar = 16; // n needed per bucket, perfect observed run
export const collectAsk =
  "~140 spoiled + ~40 borderline phone photos (~22 per intern)";

export const hygiene = [
  {
    item: "lighting=TODO row (orange_fresh_006)",
    status: "FIXED",
    note: "set to 'unknown'",
  },
  {
    item: "source vocab: ai_fake vs ai_generated",
    status: "DECIDED",
    note: "canonical = ai_fake (all 20 AI rows already use it)",
  },
  {
    item: "lighting vocab drift (10 raw values)",
    status: "FLAGGED",
    note: "grouped to indoor | outdoor | unknown for analysis",
  },
  {
    item: "62/154 scraped web images",
    status: "FLAGGED",
    note: "keep for smoke tests; exclude from threshold certification",
  },
];
