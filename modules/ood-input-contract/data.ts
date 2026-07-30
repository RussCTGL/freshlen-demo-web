// Module-private data. Every number here was printed by a command in the main
// repo (issue #163) and re-run before the demo — nothing is illustrative.
//   scripts/make_ood_fixtures.py --seed 42
//   scripts/ood_manifest.py check --manifest data/ood/index.csv
//   scripts/make_evidence_fixtures.py --seed 42 --output "$A" (twice, diff -ru)
//   eval/recipe_eval.py
//   docs/CALIBRATION.md (committed, produced with FRESHNESS_BACKEND=es_api)
import type { StatRow } from "@/components/StatBars";

/** Categories this generator builds from a seed alone — no photo, no network. */
export const synthesized: StatRow[] = [
  { name: "receipt", count: 3 },
  { name: "qr_barcode", count: 3 },
  { name: "blank_low_variance", count: 3 },
  { name: "blur", count: 3 },
  { name: "screen_replay", count: 3 },
  { name: "altered_adversarial", count: 3 },
];

/** Left at zero rows on purpose: no honest way to synthesize these. */
export const unfilled = [
  "packaging",
  "hands",
  "shelf",
  "non_produce_food",
  "unsupported_produce",
] as const;

/** Three of the six are proxies, labelled PROXY: in the manifest and test-pinned. */
export const proxies = [
  {
    category: "qr_barcode",
    is: "a deterministic block pattern",
    isNot: "a scannable code",
  },
  {
    category: "screen_replay",
    is: "a synthetic pixel grid",
    isNot: "a real recapture",
  },
  {
    category: "altered_adversarial",
    is: "a composited patch",
    isNot: "an attack against any model",
  },
] as const;

/** `ood_manifest.py check` on the tracked manifest. Exit 1 is the correct result. */
export const gateCheck = {
  passed: 14,
  total: 16,
  exitCode: 1,
  failing: [
    {
      check: "contract_approved",
      why: "the approval block is unfilled and its status is BLOCKED — no dated evaluator decision exists",
    },
    {
      check: "category_coverage",
      why: "five categories have zero support until authorized photos arrive",
    },
  ],
} as const;

/** Digests are content identities, not file identities: hashed after CRLF → LF. */
export const digests = [
  {
    artifact: "data/ood/index.csv",
    sha256: "050fc9933462588231cd1952712e41cba4467e86d3147b2a3e7205e63b8daa1f",
    note: "18 synthetic rows, each binding its image with image_sha256",
  },
  {
    artifact: "evidence manifest (seed 42)",
    sha256: "4d7b2f0e003f975b7231faed2752df108c16dcc7222f2acc121c73c61293ae8e",
    note: "reproduced independently on Windows 11 / CPython 3.12 — same 64 hex characters. Hashed over raw bytes: the generator writes LF, so two generated trees agree, but a Windows checkout of the tracked file can still differ.",
  },
] as const;

/** The generation identity is only as stable as its encoder. */
export const encoderRuntime = "Pillow 12.1.1";

export const testCounts = { manifest: 23, fixtures: 13 };

/** Recipe serving, from eval/recipe_eval.py. Two numbers, and only one is a result. */
export const recipe = {
  approvedRows: 0,
  gatingCoverageAt1: 0.0,
  draftCoverageAt1: 1.0,
  coverageFloor: 0.8,
  corpusRows: 10,
  corpusFingerprint: "dc98f16f1dab4869",
  scenesVersion: "0.2.0-week6-interim",
  sceneCount: 16,
  exitCode: 1,
} as const;

/** Named weak class, from the committed es-api calibration run (154 rows). */
export const weakClass = {
  bin: "high confidence (0.85–1.0)",
  freshAccuracy: 0.396,
  spoiledAccuracy: 0.0,
  goBar: 0.8,
  rows: 154,
  verdict: "GATE: RE-SCOPE (human-review-only)",
  detail:
    "The mechanism is one bucket: quality_category never took the value waste across all 154 rows. A spoiled item needs that bucket to be scored correctly, so spoiled accuracy is 0% at every confidence level.",
  consequence:
    "The same bucket drives everything downstream — auto-approve is 0.0% at all three thresholds, escalate is 100%, costly errors are 0, and 0 of 20 ai_fake rows got a confident bad-freshness verdict. Nothing can wrongly pay out because nothing auto-approves at all.",
  openQuestion:
    "Whether the cause is model capability or how the bucket is derived is not settled here, and this module does not claim either.",
} as const;
