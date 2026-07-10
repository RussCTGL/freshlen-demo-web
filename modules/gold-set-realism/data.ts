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

// Phone-only photos on hand per type (fresh, borderline, spoiled) — from
// scripts/evaluation_realism.py section [3], phone column.
export const phoneOnHand: {
  type: string;
  fresh: number;
  borderline: number;
  spoiled: number;
}[] = [
  { type: "apple", fresh: 3, borderline: 5, spoiled: 0 },
  { type: "banana", fresh: 3, borderline: 0, spoiled: 0 },
  { type: "bellpepper", fresh: 4, borderline: 0, spoiled: 0 },
  { type: "broccoli", fresh: 3, borderline: 11, spoiled: 0 },
  { type: "cilantro", fresh: 0, borderline: 0, spoiled: 1 },
  { type: "cucumber", fresh: 5, borderline: 4, spoiled: 0 },
  { type: "orange", fresh: 4, borderline: 1, spoiled: 0 },
  { type: "strawberry", fresh: 6, borderline: 5, spoiled: 0 },
  { type: "tomato", fresh: 9, borderline: 0, spoiled: 3 },
];

// Coverage floor for non-certification buckets (fresh/borderline): enough to
// exercise threshold behavior near the boundary, not a statistical guarantee.
export const coverageFloor = 10;

// Gold-set verification status (from gold_set_manifest.py runs, Jul 8).
// The GPS row is NOT produced by the manifest: it comes from the one-time
// preprocessing run of data/calibration/strip_gps.py (main repo, PR #72),
// which found and removed location EXIF from 66 of the 154 photos.
export const verification = [
  { label: "photos matched to index.csv", value: "154 / 154", ok: true },
  { label: "SHA-256 pinned per file", value: "154 files", ok: true },
  { label: "verified: local working copy", value: "154 / 154", ok: true },
  { label: "verified: shared-drive copy", value: "154 / 154", ok: true },
  {
    label: "GPS EXIF removed via strip_gps.py",
    value: "66 / 154 photos",
    ok: true,
  },
  { label: "resolutions recorded", value: "all files", ok: true },
];

// Resolution by source — the confound is mechanical (from the manifest).
export const resolutionBySource = [
  { source: "phone", headline: "87% are \u2265 10 MP", share: "87%" },
  { source: "web (scraped)", headline: "63% are < 1 MP", share: "63%" },
  { source: "ai_fake", headline: "100% are 1\u20134 MP", share: "100%" },
];
