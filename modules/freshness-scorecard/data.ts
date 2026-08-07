// Freshness scorecard + CI regression floor — Week 2 (issue #8).
// Content verified 2026-08-07 against LawrenceHua/es-intern-freshlens:
// PR #14 (Jun 25, closed) → integrated via PR #26 (Jun 28), and a live re-run
// of `python eval/freshness_eval.py` on Aug 7 (numbers below are that run).

export const story = {
  lede: "Week 2 shipped the program's first quality gate: a scorecard that grades the freshness scorer, and a CI floor that turns the build red if scoring silently degrades. It still guards main today — the numbers below are a live re-run from Aug 7.",
};

// ─── Headline numbers (live re-run, 2026-08-07) ─────────────────────────────

export const stats = [
  { value: "0.80", label: "pass-rate — exactly at the 0.80 floor" },
  { value: "8/10", label: "color buckets HIT" },
  { value: "14.10", label: "MAE vs bucket midpoints" },
  { value: "PASS", label: "direction gate" },
];

// ─── The case wall: 10 synthetic produce images, scored ─────────────────────

export type CaseRow = {
  name: string;
  score: number;
  expected: "green" | "amber" | "red";
  actual: "green" | "amber" | "red";
  hit: boolean;
  /** Only the two misses carry a direction note — direction is the story. */
  note?: string;
  tone: "hit" | "safe-miss" | "unsafe-miss";
};

export const cases: CaseRow[] = [
  { name: "vivid_green_solid", score: 21, expected: "green", actual: "green", hit: true, tone: "hit" },
  { name: "vivid_orange_solid", score: 23, expected: "green", actual: "green", hit: true, tone: "hit" },
  { name: "green_spots_30", score: 44, expected: "amber", actual: "amber", hit: true, tone: "hit" },
  { name: "green_spots_35", score: 48, expected: "amber", actual: "amber", hit: true, tone: "hit" },
  { name: "green_spots_40", score: 52, expected: "amber", actual: "amber", hit: true, tone: "hit" },
  { name: "green_spots_65", score: 72, expected: "red", actual: "red", hit: true, tone: "hit" },
  { name: "brown_solid", score: 94, expected: "red", actual: "red", hit: true, tone: "hit" },
  { name: "dark_grey_solid", score: 100, expected: "red", actual: "red", hit: true, tone: "hit" },
  {
    name: "vivid_red_solid", score: 30, expected: "green", actual: "amber", hit: false, tone: "safe-miss",
    note: "safe miss — reads more spoiled than labeled",
  },
  {
    name: "green_spots_70", score: 21, expected: "red", actual: "green", hit: false, tone: "unsafe-miss",
    note: "unsafe miss — reads fresher; documented, gated by name",
  },
];

// ─── Why the floor matters ───────────────────────────────────────────────────

export const floorProof = {
  title: "The floor bites",
  line: "Simulate a regression — pin the scorer to a constant — and pass-rate drops to 0.30–0.40, far below the 0.80 floor: CI goes red. A silent degradation cannot ship.",
};

// ─── What it caught (kept visible, not fixed quietly) ───────────────────────

export const findings = [
  "Monotonicity inversion: at 65% spots the score reads 72; at 68% it reads 21 — 51 points fresher with MORE spoilage. Documented, not hidden.",
  "The unsafe miss (green_spots_70) may only stay green in CI by name, in a committed allowlist — adding a name is the freshness owner's decision, not a quick fix.",
];

// ─── Provenance ──────────────────────────────────────────────────────────────

export const provenance =
  "Built as PR #14 (Jun 25) · landed via the Week-2 integration PR #26 (Jun 28) · re-run live on Aug 7 — still guarding main.";
