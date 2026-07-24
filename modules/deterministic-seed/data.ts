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

/** Boundary fixtures I added to the #129 contract (PR #148). */
export const boundaryFixtures = [
  {
    name: "valid_score_at_waste_boundary",
    what: "freshness_score 71 → quality_category waste",
    why: "71 is the first score in the waste band; nothing sat on the edge before",
  },
  {
    name: "valid_score_below_waste_boundary",
    what: "freshness_score 70 → quality_category conversion",
    why: "score 70 remains conversion — pins the other side of the same edge",
  },
  {
    name: "valid_approval_at_per_claim_ceiling",
    what: "approved_amount_cents exactly 1000",
    why: "the engine denies >1000 with `>`; nothing proved ==1000 is accepted",
  },
  {
    name: "valid_policy_write_at_immutable_ceilings",
    what: "monthly 1500 / per-claim 1000 accepted",
    why: "the ceilings themselves were never shown to be settable",
  },
];

export const testCounts = {
  contractBefore: 37,
  contractAfterBoundary: 44,
  contractNow: 48,
  demoSeed: 12,
};

/** Observed on a physical iPhone 13 Pro Max, Xpired 3.4.5. Redacted. */
export const deviceFinding = {
  result: "FAIL",
  severity: "high",
  subject: "a beverage can, photographed with deliberate motion blur",
  classified: "Produce",
  daysUntilExpiry: 1,
  xfsScore: 10,
  xfsMinimumPreference: 70,
  recommendation: "Skip / Use Immediately",
  storageAdvice: "refrigerator crisper drawer · wash before consuming",
  observations: [
    "no blur or image-quality warning appeared",
    "no retake or try-again path was offered",
    "progression was not blocked — Save to Inventory was available",
    "a confident expiry date was produced from an unreadable image",
  ],
};
