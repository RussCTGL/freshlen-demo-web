// Module-private data.
//
// `scored` is REAL output of POST /api/scan/detect (mode=after) on green-apples.jpg
// (12 apples, one rotten) from es-intern-freshlens (issue #53) — nothing is mocked.
// `bands` and `testRows` mirror src/freshness.py (quality_for) and the assertions in
// tests/test_scan_verdicts.py exactly. Regenerate by re-running the endpoint / the test.
// Scene: ./green-apples.jpg — a shopper-style tray of green apples with one rotten (the red item).

export const image = { width: 1920, height: 1080 };

export type Color = "green" | "amber" | "red";
export type Tone = "success" | "warning" | "danger";
export type Mode = "shopper" | "store";

/** Canonical colour -> design-token tone (green=fresh, amber=soon, red=urgent). */
export const colorTone: Record<Color, Tone> = {
  green: "success",
  amber: "warning",
  red: "danger",
};

export type ScoredItem = {
  rank: number; // 1 = eat me first
  n: number; // display number so a list row maps to a box on the photo (Apple 1, Apple 2…)
  label: string;
  freshness: number; // 0 = fresh … 100 = urgent
  color: Color;
  verdict: string; // shopper-facing label
  storeVerdict: string; // same score, store-facing action (mode toggle)
  advice: string; // what to do
  box: [number, number, number, number]; // [x, y, w, h] on the original photo
};

/** The 12 items /api/scan/detect (mode=after) actually returns for this tray, worst-first.
 *  One rotten apple lands in the red "waste" band; the rest cluster amber (the placeholder
 *  scorer reads healthy greens as one band — the real ES model spreads them out). */
export const scored: ScoredItem[] = [
  { rank: 1, n: 1, label: "apple", freshness: 74, color: "red", verdict: "Use today", storeVerdict: "Remove off shelf / Donate", advice: "Eat today, or cook / freeze it", box: [496, 313, 430, 486] },
  { rank: 2, n: 2, label: "apple", freshness: 46, color: "amber", verdict: "Eat soon", storeVerdict: "Cook & sell / Larger discount", advice: "Use in 1-2 days", box: [955, 273, 512, 509] },
  { rank: 3, n: 3, label: "apple", freshness: 46, color: "amber", verdict: "Eat soon", storeVerdict: "Cook & sell / Larger discount", advice: "Use in 1-2 days", box: [429, 0, 517, 337] },
  { rank: 4, n: 4, label: "apple", freshness: 44, color: "amber", verdict: "Eat this week", storeVerdict: "Small discount", advice: "Use within a few days", box: [486, 795, 460, 281] },
  { rank: 5, n: 5, label: "apple", freshness: 43, color: "amber", verdict: "Eat this week", storeVerdict: "Small discount", advice: "Use within a few days", box: [953, 0, 521, 280] },
  { rank: 6, n: 6, label: "apple", freshness: 42, color: "amber", verdict: "Eat this week", storeVerdict: "Small discount", advice: "Use within a few days", box: [0, 299, 483, 531] },
  { rank: 7, n: 7, label: "apple", freshness: 42, color: "amber", verdict: "Eat this week", storeVerdict: "Small discount", advice: "Use within a few days", box: [0, 827, 487, 248] },
  { rank: 8, n: 8, label: "apple", freshness: 42, color: "amber", verdict: "Eat this week", storeVerdict: "Small discount", advice: "Use within a few days", box: [949, 784, 506, 290] },
  { rank: 9, n: 9, label: "apple", freshness: 40, color: "amber", verdict: "Eat this week", storeVerdict: "Small discount", advice: "Use within a few days", box: [1464, 324, 454, 508] },
  { rank: 10, n: 10, label: "apple", freshness: 40, color: "amber", verdict: "Eat this week", storeVerdict: "Small discount", advice: "Use within a few days", box: [1459, 0, 459, 334] },
  { rank: 11, n: 11, label: "apple", freshness: 38, color: "amber", verdict: "Eat this week", storeVerdict: "Small discount", advice: "Use within a few days", box: [0, 1, 430, 314] },
  { rank: 12, n: 12, label: "apple", freshness: 38, color: "amber", verdict: "Eat this week", storeVerdict: "Small discount", advice: "Use within a few days", box: [1454, 835, 465, 237] },
];

/** The colour + verdict bands, derived from freshness.quality_for (one source of truth).
 *  Each band carries BOTH audiences: the shopper word and the store action for the same score. */
export const bands: { range: string; color: Color; verdict: string; storeVerdict: string; advice: string }[] = [
  { range: "0 – 25", color: "green", verdict: "Fresh", storeVerdict: "Full price", advice: "Good for now" },
  { range: "26 – 45", color: "amber", verdict: "Eat this week", storeVerdict: "Small discount", advice: "Use within a few days" },
  { range: "46 – 70", color: "amber", verdict: "Eat soon", storeVerdict: "Cook & sell / Larger discount", advice: "Use in 1–2 days" },
  { range: "71 – 100", color: "red", verdict: "Use today", storeVerdict: "Remove off shelf / Donate", advice: "Eat today, or cook / freeze it" },
];

/** The real end-to-end test (tests/test_scan_verdicts.py): three known scores go through
 *  /api/scan/detect and the exact rank, colour and verdict are asserted. */
export const testRows: { score: number; rank: number; color: Color; verdict: string }[] = [
  { score: 90, rank: 1, color: "red", verdict: "Use today" },
  { score: 50, rank: 2, color: "amber", verdict: "Eat soon" },
  { score: 10, rank: 3, color: "green", verdict: "Fresh" },
];
