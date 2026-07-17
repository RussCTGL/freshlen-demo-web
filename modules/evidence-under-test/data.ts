// Module-private data for #79 "Evidence, Under Test".
// Snapshot of the offline test suite merged in es-intern-freshlens PRs #98 + #100.
// Real counts: `pytest -q` is green offline; the #79 slice is 20 test cases.

export const suite = {
  offlineTests: 20, // 12 core (#98) + 8 fraud-net cases (#100)
  fraudFixtures: { caught: 8, total: 8 }, // uniform_background 4 + blur 4
  needsKeyOrNetwork: false, // conftest strips ES_API_* / ANTHROPIC_API_KEY
};

/** Each new test group, and the gate promise it guards. */
export type Guard = { label: string; count: number; test: string };
export const guards: Guard[] = [
  { label: "identity match", count: 4, test: "test_matches_receipt_item_*" },
  { label: "receipt sanity", count: 4, test: "test_parse_*" },
  { label: "fraud signals", count: 3, test: "test_fraud_signals_*" },
  { label: "end-to-end journey", count: 1, test: "real matcher -> human_review" },
  { label: "fraud regression net", count: 8, test: "test_evidence_fixtures (#85 gold set)" },
];

/** Promises already proven by #78 — #79 verifies, does not duplicate. */
export const verified = [
  { label: "cap / duplicate ordering", note: "gates fire before evidence (covered by #78)" },
  { label: "audit evidence block", note: "fraud_risk / identity_match / receipt_parse_ok logged" },
];

/** The honest boundary: which fakes the pixel detector catches (and this suite tests)
 *  vs. which are the capture layer's job by design (in-app capture + metadata). */
export type FakeRow = {
  fake: string;
  caughtBy: "image" | "capture";
  tested: boolean;
  note: string;
};
export const fakeTable: FakeRow[] = [
  { fake: "solid-color", caughtBy: "image", tested: true, note: "-> HIGH risk" },
  { fake: "blurry", caughtBy: "image", tested: true, note: "blur signal" },
  { fake: "no camera info", caughtBy: "capture", tested: false, note: "missing EXIF" },
  { fake: "photo too old", caughtBy: "capture", tested: false, note: "timestamp check" },
  { fake: "screenshot", caughtBy: "capture", tested: false, note: "in-app capture rule" },
  { fake: "AI-made", caughtBy: "capture", tested: false, note: "in-app capture rule" },
];
