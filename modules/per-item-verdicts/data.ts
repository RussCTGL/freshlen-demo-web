// Module-private data.
//
// `scored` is REAL output of POST /api/scan/detect (mode=after) on
// sample_images/multi_fruit.jpg from es-intern-freshlens (issue #53) — nothing is mocked.
// `bands` and `testRows` mirror src/freshness.py (quality_for) and the assertions in
// tests/test_scan_verdicts.py exactly. Regenerate by re-running the endpoint / the test.

export const image = { width: 1099, height: 400 };

export type Color = "green" | "amber" | "red";
export type Tone = "success" | "warning" | "danger";

/** Canonical colour -> design-token tone (green=fresh, amber=soon, red=urgent). */
export const colorTone: Record<Color, Tone> = {
  green: "success",
  amber: "warning",
  red: "danger",
};

export type ScoredItem = {
  rank: number; // 1 = eat me first
  label: string;
  freshness: number; // 0 = fresh … 100 = urgent
  color: Color;
  verdict: string; // shopper-facing label
  advice: string; // what to do
  box: [number, number, number, number]; // [x, y, w, h] on the original photo
};

/** The 4 items /api/scan/detect (mode=after) actually returns for this basket, worst-first. */
export const scored: ScoredItem[] = [
  { rank: 1, label: "banana", freshness: 45, color: "amber", verdict: "Eat this week", advice: "Use within a few days", box: [685, 141, 328, 175] },
  { rank: 2, label: "apple", freshness: 37, color: "amber", verdict: "Eat this week", advice: "Use within a few days", box: [314, 64, 234, 235] },
  { rank: 3, label: "apple", freshness: 36, color: "amber", verdict: "Eat this week", advice: "Use within a few days", box: [77, 74, 241, 233] },
  { rank: 4, label: "apple", freshness: 29, color: "amber", verdict: "Eat this week", advice: "Use within a few days", box: [0, 221, 233, 153] },
];

/** The colour + verdict bands, derived from freshness.quality_for (one source of truth). */
export const bands: { range: string; color: Color; verdict: string; advice: string }[] = [
  { range: "0 – 25", color: "green", verdict: "Fresh", advice: "Good for now" },
  { range: "26 – 45", color: "amber", verdict: "Eat this week", advice: "Use within a few days" },
  { range: "46 – 70", color: "amber", verdict: "Eat soon", advice: "Use in 1–2 days" },
  { range: "71 – 100", color: "red", verdict: "Use today", advice: "Eat today, or cook / freeze it" },
];

/** The real end-to-end test (tests/test_scan_verdicts.py): three known scores go through
 *  /api/scan/detect and the exact rank, colour and verdict are asserted. */
export const testRows: { score: number; rank: number; color: Color; verdict: string }[] = [
  { score: 90, rank: 1, color: "red", verdict: "Use today" },
  { score: 50, rank: 2, color: "amber", verdict: "Eat soon" },
  { score: 10, rank: 3, color: "green", verdict: "Fresh" },
];
