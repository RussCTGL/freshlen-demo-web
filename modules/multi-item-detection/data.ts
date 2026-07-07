// Module-private data. Every number here is REAL yolov8n.pt output on
// sample_images/multi_fruit.jpg from es-intern-freshlens (issue #52) — nothing is mocked.
// Regenerate: run detect_items() / the raw model in the main repo and paste the output.

export const image = { width: 1099, height: 400 };

export type DetectedItem = {
  label: string;
  confidence: number;
  /** [x, y, w, h] in pixels on the original photo. */
  box: [number, number, number, number];
  /** Canonical FreshLens scale, 0 = fresh … 100 = urgent. Placeholder heuristic
   *  for now — issue #53 swaps in the real per-item scores. */
  freshness: number;
  tone: "success" | "warning" | "danger";
};

/** The 4 items /api/scan/detect (mode=after) actually returns for this photo. */
export const kept: DetectedItem[] = [
  { label: "banana", confidence: 0.75, box: [685, 141, 328, 175], freshness: 45, tone: "warning" },
  { label: "apple", confidence: 0.79, box: [314, 64, 234, 235], freshness: 37, tone: "warning" },
  { label: "apple", confidence: 0.46, box: [77, 74, 241, 233], freshness: 36, tone: "warning" },
  { label: "apple", confidence: 0.55, box: [0, 221, 233, 153], freshness: 29, tone: "success" },
];

/** Raw detections the pipeline discarded, and the rule that discarded each. */
export const dropped = [
  { label: "person", confidence: 0.75, reason: "not in PRODUCE_LABELS" },
  { label: "person", confidence: 0.51, reason: "not in PRODUCE_LABELS" },
  { label: "person", confidence: 0.34, reason: "not in PRODUCE_LABELS" },
  { label: "apple", confidence: 0.36, reason: "confidence < 0.40" },
  { label: "apple", confidence: 0.28, reason: "confidence < 0.40" },
];

/** How After mode behaved across varied real photos (fallback-honesty check):
 *  real YOLO boxes whenever it finds ≥ 2 items, the generic grid only below that. */
export const fallbackMatrix = [
  { photo: "multi_fruit.jpg", found: "3× apple + 1× banana", result: "real boxes" },
  { photo: "apples.jpg", found: "2× apple", result: "real boxes" },
  { photo: "bananas.jpg (overlapping pile)", found: "2× banana", result: "real boxes" },
  { photo: "banana_spoiled_003.jpg", found: "2× banana", result: "real boxes" },
  { photo: "orange_fresh_001.jpg", found: "1× orange", result: "generic grid" },
  { photo: "broccoli_borderline_001.jpg", found: "1× broccoli", result: "generic grid" },
  { photo: "cilantro_spoiled_001.jpg", found: "none (not a COCO class)", result: "generic grid" },
  { photo: "sample.png", found: "none", result: "generic grid" },
];
