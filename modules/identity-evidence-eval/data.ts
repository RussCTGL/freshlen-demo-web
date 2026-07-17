// Module-private data for the #81 identity-evidence eval page.
// Primary result: the 2026-07-17 run of scripts/evidence_eval.py with the Claude
// tier live (post-#103 fence fix + working key) — real outcomes at the shipped
// 0.50 floor. The Jul-15 CLIP-only snapshot is kept as compressed history.
// Fail-closed accounting throughout: match=None is unmeasured, never correct.

/** Headline metrics, phrased as the question each one answers. */
export const headline = [
  {
    question: "When it says “match” — is it right?",
    value: "100%",
    metric: "precision",
    detail: "23/23 committed matches were genuine · 0 mismatches or fraud fixtures slipped through",
  },
  {
    question: "Of honest claims — how many get through?",
    value: "48%",
    metric: "recall",
    detail: "23/48 genuine claims matched · 13 of the 25 misses are one fixable string bug (#76)",
  },
  {
    question: "Does it answer at all?",
    value: "232/236",
    metric: "commit rate at the 0.50 floor",
    detail: "was 0/236 on the CLIP-only backend · answered rows sit at 0.85–1.0 confidence",
  },
];

/** The 82 ground-truthed Pass-2 cases, grouped by what the right answer was.
 *  This ledger IS the result — every case appears exactly once. */
export type LedgerRow = {
  glyph: "✓" | "✗" | "⚠";
  label: string;
  count: number;
  tone: "good" | "miss" | "fraud" | "watch";
  note: string;
};
export type LedgerGroup = {
  name: string;
  total: number;
  meaning: string;
  rows: LedgerRow[];
};
export const ledger: LedgerGroup[] = [
  {
    name: "Genuine claims",
    total: 48,
    meaning: "photo really does match the receipt — the right answer is match=True. Recall lives here and only here: 23/48 = 48%.",
    rows: [
      { glyph: "✓", label: "correctly matched", count: 23, tone: "good", note: "the recall numerator — all 23 also clear the 0.80 auto-approve confidence floor" },
      { glyph: "✗", label: "vision misread the photo", count: 12, tone: "miss", note: "classifier predicted the wrong produce" },
      { glyph: "✗", label: "phrasing failed to normalize", count: 13, tone: "miss", note: "produce RIGHT — receipt strings like “green apple” aren’t in NORMALIZE_MAP (#76). The largest fixable class." },
    ],
  },
  {
    name: "Mismatched claims",
    total: 20,
    meaning: "photo does NOT match the receipt — the right answer is match=False.",
    rows: [
      { glyph: "✓", label: "correctly caught", count: 20, tone: "good", note: "every deliberate mismatch was flagged" },
      { glyph: "✗", label: "slipped through (false match)", count: 0, tone: "fraud", note: "fraud exposure — zero, in both the CLIP and Claude runs" },
    ],
  },
  {
    name: "Uncertain cases",
    total: 14,
    meaning: "ground truth itself says “can’t tell” — the right behavior is to abstain. Not part of recall or precision.",
    rows: [
      { glyph: "⚠", label: "answered anyway", count: 10, tone: "watch", note: "NEW with the confident tier — over-commitment to review before Week 6 (none passed a fraud fixture)" },
      { glyph: "✓", label: "correctly withheld", count: 4, tone: "good", note: "match=None where no definite answer exists" },
    ],
  },
];

/** The two passes = two different questions asked of the same comparison. */
export const passes = [
  {
    name: "Pass 1 — can we trust the classifier?",
    setup: "154 calibration photos where the “receipt” is a copy of the human label, so photo and receipt agree by construction. Pixels in, produce name out — any mismatch is the classifier misreading the photo.",
    result: "119/154 (77%) agree with the human label, at 0.85–1.0 confidence (153/154 rows in the top band). Good — but 1-in-4 disagreement is why a mismatch flag means “look closely”, never auto-decline.",
  },
  {
    name: "Pass 2 — can we trust the evidence?",
    setup: "82 gold-set cases (#85) with real receipt phrasing and labeled ground truth: genuine, mismatched, fraud, and uncertain. The comparison can fail every way it fails in production.",
    result: "The ledger above. Separating the passes is what makes it readable: Pass 1 isolates classifier reliability so Pass 2’s failures can be attributed to evidence quality.",
  },
];

/** What to do about it, in order. */
export const fixes = [
  {
    title: "1 · Extend NORMALIZE_MAP (#76)",
    body: "13 of 25 genuine-claim misses are receipt phrasing, not vision — and it was observed live: “green apple” @ 0.95 vs receipt “apple” wrongly mismatched during the Jul-17 demo dry run. A string-map fix that raises recall with zero added fraud risk.",
  },
  {
    title: "2 · Review the 10 over-commitments",
    body: "The confident tier almost never abstains (4/236). On 10 unanswerable cases it committed anyway. Precision held — but the safety margin narrowed; decide the desired abstention behavior before Week 6.",
  },
  {
    title: "3 · Re-run, then talk thresholds",
    body: "After the normalization fix, re-run this eval. Any floor discussion starts from fresh numbers — and from the snapshot’s agreement cliff, not the current 0.50 line.",
  },
];

/** Compressed history — the essential numbers from the earlier phases. */
export const history = [
  {
    date: "Jul 15",
    what: "CLIP-only report (the committed #81 artifact): all 236 calls below the 0.50 floor — 0 answered, 100% routed fail-closed to a human. Sub-floor diagnostic found the agreement cliff: 36% in the 0.2–0.3 band vs 89% in 0.3–0.4 (110/154 rows) — the anchor for any future floor discussion.",
  },
  {
    date: "Jul 16–17 overnight",
    what: "Demo dry run surfaced why the Claude tier was silent: the ES proxy key was sitting in ANTHROPIC_API_KEY (every call 401’d), and Claude’s JSON replies arrived in a markdown fence the parser rejected — fixed by #103. Both found by exercising the eval’s pipeline.",
  },
  {
    date: "Jul 17",
    what: "Live claim-flow verification on the seeded demo server: banana photo vs “strawberry” receipt caught at 0.99 → human_review / gray_zone_escalate; a verified matching claim still routes to a human (calibration_disabled — no auto-pay without the calibration gate); duplicate photos/purchase keys declined before the model runs. Then this re-run: same script, real outcomes.",
  },
];

export const totals = { calls: 236, pass1Rows: 154, pass2Rows: 82 };
