// Module-private data.
//
// Everything here is REAL recorded output from es-intern-freshlens (issue #61, PR #73),
// captured on sample_images/multi_fruit.jpg — nothing is invented:
//   * `items` (boxes, fast scores) = POST /api/scan/detect (mode=after), recorded 2026-07-09.
//   * each item's deep results     = POST /api/produce/analyze on THAT item's crop (cut from
//     the clean original at its box, JPEG q90 — exactly what the app's cropCanvasToBlob sends):
//       - `deepOffline` recorded 2026-07-09 with NO ES key  (backend "placeholder")
//       - `deepReal`    recorded 2026-07-10 with a real intern key via the read-only proxy
//         (backend "es-api" — including one genuine misclassification, kept as-is).
// The replay toggle switches between those two recorded sessions.

export const image = { width: 1099, height: 400 };

export type Color = "green" | "amber" | "red";
export type Tone = "success" | "warning" | "danger";

export const colorTone: Record<Color, Tone> = {
  green: "success",
  amber: "warning",
  red: "danger",
};

/** The recorded deep-check response fields the Verify tab actually reads. */
export type DeepResult = {
  score: number;
  color: Color;
  backend: "es-api" | "placeholder" | "es-api-fallback";
  confidence: number | null;
  /** What the model called the crop ("produce" = placeholder can't identify). */
  produceType: string;
  /** True when the response routed to human review (e.g. confidence under the 0.80 floor). */
  humanReview: boolean;
};

export type ScannedItem = {
  rank: number; // 1 = worst by the fast triage, tap this one first
  label: string;
  fast: number; // the quick placeholder estimate from the scan (0 = fresh … 100 = urgent)
  color: Color;
  verdict: string;
  box: [number, number, number, number]; // [x, y, w, h] on the original photo
  deepOffline: DeepResult; // recorded response, server WITHOUT a key
  deepReal: DeepResult; // recorded response, server WITH a real intern key
};

/** Real scan output + the real deep-check response recorded for each crop, both sessions. */
export const items: ScannedItem[] = [
  {
    rank: 1, label: "banana", fast: 45, color: "amber", verdict: "Eat this week",
    box: [685, 141, 328, 175],
    deepOffline: { score: 45, color: "amber", backend: "placeholder", confidence: null, produceType: "produce", humanReview: true },
    deepReal: { score: 26, color: "amber", backend: "es-api", confidence: 0.7433, produceType: "banana", humanReview: true },
  },
  {
    rank: 2, label: "apple", fast: 37, color: "amber", verdict: "Eat this week",
    box: [314, 64, 234, 235],
    deepOffline: { score: 37, color: "amber", backend: "placeholder", confidence: null, produceType: "produce", humanReview: true },
    deepReal: { score: 8, color: "green", backend: "es-api", confidence: 0.9981, produceType: "apple", humanReview: false },
  },
  {
    rank: 3, label: "apple", fast: 36, color: "amber", verdict: "Eat this week",
    box: [77, 74, 241, 233],
    deepOffline: { score: 36, color: "amber", backend: "placeholder", confidence: null, produceType: "produce", humanReview: true },
    deepReal: { score: 26, color: "amber", backend: "es-api", confidence: 0.8538, produceType: "apple", humanReview: false },
  },
  {
    rank: 4, label: "apple", fast: 29, color: "amber", verdict: "Eat this week",
    box: [0, 221, 233, 153],
    deepOffline: { score: 29, color: "amber", backend: "placeholder", confidence: null, produceType: "produce", humanReview: true },
    // The real model genuinely called this apple crop "dill" — kept honestly: the model
    // ADVISES, it does not decide. This is why the loop keeps a human in it.
    deepReal: { score: 39, color: "amber", backend: "es-api", confidence: 0.8073, produceType: "dill", humanReview: false },
  },
];

/** The gate the UI applies before claiming a verdict is real (static/app.js deepIsReal):
 *  only `backend === "es-api"` AND a confidence counts. Everything else says so honestly. */
export const gateRows: {
  backend: string;
  confidence: string;
  meaning: string;
  shows: string;
  real: boolean;
}[] = [
  {
    backend: "es-api",
    confidence: "0.74",
    meaning: "the real ES model answered",
    shows: "deep score + “confidence: 74%”",
    real: true,
  },
  {
    backend: "placeholder",
    confidence: "null",
    meaning: "no key configured",
    shows: "estimate + “DEEP CHECK UNAVAILABLE”",
    real: false,
  },
  {
    backend: "es-api-fallback",
    confidence: "null",
    meaning: "key set, proxy unreachable",
    shows: "estimate + “DEEP CHECK UNAVAILABLE”",
    real: false,
  },
];

/** The 4 offline tests guarding this path (tests/test_deep_verify.py, PR #73) —
 *  they run with no network and no key, and all pass (repo suite: 577 green). */
export const testRows: { name: string; pins: string }[] = [
  {
    name: "deep_check_scores_the_crop_not_the_scene",
    pins: "a rotten crop scores worse than the scene it came from — the tap judges THAT item",
  },
  {
    name: "offline_crop_analyze_has_the_unavailable_signals",
    pins: "no key → backend placeholder + null confidence + a note (the fields the UI gate reads)",
  },
  {
    name: "es_api_selected_but_unreachable_degrades_not_crashes",
    pins: "es_api with no proxy still returns 200 + es-api-fallback — the demo never breaks",
  },
  {
    name: "real_es_verdict_reaches_the_verify_tab_fields",
    pins: "mocked raw ES response: raw 8 (HIGH=fresh) arrives inverted as canonical 92/red — never re-inverted",
  },
];
