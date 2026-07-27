// Week 6 — Lisa — #108 identity advisory + nutrition reference (PR #139, merged dcbe8d7).
//
// Every state below is the ACTUAL mapping in src/classify.py::identity_advisory() and
// static/identity_advisory.js — not illustrative. Shopper copy is quoted verbatim from
// the merged source's _IDENTITY_SHOPPER_COPY dict.

export type IdentityState = {
  key: "matched" | "mismatch" | "uncertain" | "unavailable" | "unknown";
  label: string;
  tone: "brand" | "danger" | "warning" | "muted";
  /** The exact identity_result fields that produce this state. */
  match: "true" | "false" | "null";
  predicted?: string;
  expected?: string;
  confidence?: string;
  reason?: string;
  /** Verbatim shopper_text from src/classify.py (None means the panel is omitted). */
  shopperText: string | null;
  /** What actually triggers this state — the nuance worth saying out loud. */
  note: string;
};

export const states: IdentityState[] = [
  {
    key: "matched",
    label: "Matched",
    tone: "brand",
    match: "true",
    predicted: "banana",
    expected: "banana",
    confidence: "0.90",
    shopperText: "The photo appears to show the item on your receipt.",
    note: "Only a strict match === true ever produces this — never a truthy non-boolean.",
  },
  {
    key: "mismatch",
    label: "Mismatch",
    tone: "danger",
    match: "false",
    predicted: "apple",
    expected: "banana",
    confidence: "0.90",
    shopperText:
      "The photo doesn't appear to match the item on your receipt. A reviewer will take a look.",
    note: "Only a strict match === false ever produces this.",
  },
  {
    key: "uncertain",
    label: "Uncertain",
    tone: "warning",
    match: "null",
    predicted: "banana",
    expected: "banana",
    confidence: "0.40",
    reason: "low_confidence",
    shopperText:
      "We couldn't confidently verify the item in the photo. A reviewer will take a look.",
    note: "Also covers any unrecognized/future reason code — fails closed to this SAME state, never a new one.",
  },
  {
    key: "unavailable",
    label: "Unavailable",
    tone: "muted",
    match: "null",
    reason: "classifier_unavailable",
    shopperText:
      "We couldn't run item verification on this photo. A reviewer will take a look.",
    note: "The classifier backend didn't respond at all — distinct from low confidence.",
  },
  {
    key: "unknown",
    label: "Unknown",
    tone: "muted",
    match: "null",
    shopperText: null,
    note: "The real trigger is no identity_result at all (e.g. declined pre-evaluation, or an idempotent replay) — NOT an unrecognized reason code, that's Uncertain above. Panel is omitted, never shown empty.",
  },
];

export const failClosedLines = [
  "Uncertain evidence stays uncertain.",
  "The advisory fails closed instead of overclaiming identity.",
];

/** src/nutrition_advisory.py::NUTRITION_DISCLAIMER, verbatim. */
export const NUTRITION_DISCLAIMER =
  "General nutrition reference only — not medical advice, a personalized recommendation, or claim evidence.";

/** Allowlisted view-model fields (src/nutrition_advisory.py) — field NAMES only, no
 *  invented numbers: no live nutrition schema capture is committed evidence yet. */
export const nutritionFields = [
  "calories",
  "serving_size",
  "protein_g",
  "carbs_g",
  "fat_g",
  "fiber_g",
];

/** Every one of these fails closed to "panel omitted", never a guessed value
 *  (src/nutrition_advisory.py::nutrition_view, all covered by tests). */
export const nutritionFailureModes = [
  "capability absent",
  "capability disabled",
  "timeout",
  "401 / 429",
  "transport error",
  "malformed body",
  "200 with no recognizable field",
];

export const takeaways = [
  {
    title: "Explainable identity state",
    body: "Five deterministic states, one pure mapping — the same raw result always explains the same way, to shopper and reviewer alike.",
  },
  {
    title: "Explicit uncertainty",
    body: "Low confidence and unrecognized reasons are named as Uncertain, out loud — never quietly rounded up to a match.",
  },
  {
    title: "Safe nutrition boundary",
    body: "Reference only, capability-gated, and it never touches the claim decision — silent, honest omission beats a guessed value.",
  },
];

export const statusRows: Array<[string, string, "brand" | "danger" | "warning"]> = [
  ["PR #139 — identity advisory mapping", "MERGED — dcbe8d7", "brand"],
  ["tests/test_identity_advisory.py + test_nutrition_advisory.py", "24 passed", "brand"],
  ["static/identity_advisory.test.js (Node, no framework)", "10/10 passed", "brand"],
  ["static/claim.js integration (build-plan step 4)", "VERIFIED — shopper advisory rendered alongside raw fields", "brand"],
  [
    "Nutrition UI panel (browser-facing endpoint)",
    "NOT_PRESENT — no route exposes nutrition_view() to the browser yet",
    "warning",
  ],
];
