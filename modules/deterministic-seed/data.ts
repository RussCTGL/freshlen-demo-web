// Week 6 — Mohan Li — #110 deterministic fixture CLI + in-process seed helper,
// plus the #129 boundary contribution and the Xpired device finding.
//
// Every number below was produced by a command that is written next to it, so a
// reviewer can re-run it. Nothing here is illustrative.

/** `python scripts/make_evidence_fixtures.py --seed 42 --output /tmp/ev1` */
export const manifest = {
  rows: 82,
  match: { count: 40, min: 40 },
  mismatch: { count: 20, min: 20 },
  fraud: { count: 22, min: 20 },
  shaPrefix: "4d7b2f0e003f975b",
  retailVariants: { covered: 38, total: 38, required: 15 },
  filesInOutputTree: 17,
};

/** Determinism cuts both ways: same seed → identical, different seed → different.
 *  `--seed 42` twice = 4d7b2f0e… ; `--seed 43` = a99940dc… at the SAME floors. */
export const seedDivergence = {
  seed42Sha: "4d7b2f0e003f975b",
  seed43Sha: "a99940dccd086e0e",
  sharedFloors: "82 rows · 40/20/22 · 38/38 variants",
};

export const fraudByType = [
  { name: "ai_fake", count: 6 },
  { name: "blur", count: 4 },
  { name: "exif_stripped", count: 4 },
  { name: "screenshot", count: 4 },
  { name: "uniform_background", count: 4 },
];

/** The immutable platform ceilings (docs/WEEK-06-SECURITY-CONTRACT.md). */
export const PER_CLAIM_CEILING_CENTS = 1000;
export const MONTHLY_CEILING_CENTS = 1500;

/** Canonical FreshLens scale: 0 = fresh … 100 = waste. 71–100 is the waste band. */
export const WASTE_BAND_MIN = 71;

/** What `scripts/demo_seed.py` derives from a seed, verbatim from the source:
 *  price_cents = 500 + (seed % 5) * 50 ; requested = min(price, 1000). */
export function scenarioForSeed(seed: number) {
  const priceCents = 500 + (seed % 5) * 50;
  return {
    seed,
    priceCents,
    requestedCents: Math.min(priceCents, PER_CLAIM_CEILING_CENTS),
    itemLabel: "bell pepper",
    receiptVariant: "PEPPER BELL RED",
    freshnessScore: 84,
    quality: "waste",
    confidence: null as null,
    terminalStatus: "human_review",
  };
}

/** The chain `seed_demo_state()` writes, in order, inside one interpreter. */
export const seedChain = [
  { step: "account", note: "cap 1500c / 30d, bearer contains 'test-only'" },
  { step: "receipt", note: "store_demo_0001, synthetic sha256 digest" },
  { step: "claim", note: "requested ≤ 1000c per-claim ceiling" },
  { step: "evidence", note: "produce_photo, captured_in_app=true" },
  { step: "assessment", note: "score 84 (waste band), confidence=None" },
  { step: "human_review", note: "terminal — RE-SCOPE, never auto-approved" },
];

export const testCounts = {
  contractBefore: 37,
  contractAfterBoundary: 44,
  contractNow: 48,
  demoSeed: 22,
};

/** The #110 stretch shipped tonight (PR against LawrenceHua/es-intern-freshlens):
 *  a read-only `check` subcommand for #113's evaluator — validates an existing
 *  manifest tree without writing, non-zero exit on any failed check. */
export const checkMode = {
  command: "python scripts/make_evidence_fixtures.py check --output /tmp/ev1 --json",
  checks: [
    "manifest_present",
    "manifest_readable",
    "schema_columns",
    "expected_match_vocab",
    "fraud_type_vocab",
    "captured_in_app_vocab",
    "min_match",
    "min_mismatch",
    "min_fraud",
    "required_retail_variants",
    "no_blank_key_fields",
    "manifest_sha256",
  ],
  passOn42: "OK: 12/12 · exit 0",
  failClosed: "any broken invariant → exit 1 (usable as a CI gate)",
  tests: 6,
  writesNothing: true,
};

/** Observed on a physical iPhone 13 Pro Max, Xpired 3.4.5 (2026072201). Redacted.
 *  Assigned #119 scenario was "blurry/partial image + retake guidance"; the same
 *  sealed can was scanned three ways. Two distinct failures surfaced. */
export const deviceFinding = {
  device: "iPhone 13 Pro Max · iOS 26.5.2 · Xpired 3.4.5 (2026072201)",
  scenarioResult: "NOT_PRESENT",
  scenarioNote:
    "no image-quality gate or retake path exists to exercise — every frame is accepted and scored",
  subject: "one sealed canned beverage, scanned clean / blurry / partial",
  xfsMinimumPreference: 70,
  recommendation: "Skip / Use Immediately",
  storageAdvice: "refrigerator crisper drawer · wash before consuming",
  /** Three scans of the same object → three confident, inconsistent verdicts. */
  frames: [
    {
      frame: "clean",
      classified: "Produce",
      xfsScore: 10,
      note: "baseline — sealed can labelled produce, 1 day to expiry",
    },
    {
      frame: "heavy motion blur",
      classified: "Produce",
      xfsScore: 10,
      note: "an unreadable smear scored identically — no blur warning, no retake",
    },
    {
      frame: "partial (cropped can)",
      classified: "Mango",
      xfsScore: 9,
      note: "relabelled to a specific fruit with mango handling tips — likely from the strawberry artwork",
    },
  ],
  blocking: {
    result: "FAIL",
    severity: "high",
    what: "no non-produce rejection — the classifier confidently labels anything",
    evidence: [
      "a sealed can was priced by the pound ($2.27/lb, 24% off)",
      'a recipe was generated: "Simple Produce Salad — wash and prepare Produce"',
      'storage advice told the shopper to "wash before consuming" a sealed can',
      "scanning the paper receipt instead returned the same template, different score",
    ],
  },
  correctionGap:
    'the "Improve Accuracy" form pre-fills Produce Type = Produce with only a freshness slider — a tester cannot say "this is not produce", so corrections can only confirm the wrong category',
};
