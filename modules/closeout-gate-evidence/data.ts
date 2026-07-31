// Frozen snapshot compiled 2026-07-31 from es-intern-freshlens:
// PR #186 (merged Jul 31, main a98e6217), draft PR #202 (head b866f91), and the
// #162 closeout lane's posted gate records. Numbers are from the recorded
// evidence, not re-measured here.

export const story = {
  lede: "A release scorecard is only worth something if it cannot lie. This week froze the contract for one gate observation — what a command ran, what it returned, and what that is allowed to claim — then wrapped the existing closeout commands in a deterministic runner that produces one mixed-status packet. The honest result today is 8 verified gates, 3 blocked ones, and a nonzero exit. That exit code is the feature.",
};

export const contract = {
  title: "#186 — the gate-result v1 contract (merged Jul 31)",
  files: [
    { name: "schema (JSON)", count: 42 },
    { name: "validator / CLI", count: 248 },
    { name: "tests", count: 190 },
  ],
  rules: [
    {
      rule: "VERIFIED must earn it",
      detail:
        "A VERIFIED record requires the full source commit plus an artifact path and its exact SHA-256. False VERIFIED, missing, unknown, malformed, and nondeterministic inputs all fail validation.",
    },
    {
      rule: "A timeout is never VERIFIED",
      detail:
        "The record carries timed_out and duration_ms; a timed-out command cannot claim success, and command results require an integer exit code.",
    },
    {
      rule: "Four statuses, no fifth",
      detail:
        "Exactly VERIFIED / CODE-SHIPPED-NOT-VERIFIED / BLOCKED / INCONCLUSIVE. Unknowns stay INCONCLUSIVE; source without proof stays CODE-SHIPPED-NOT-VERIFIED.",
    },
    {
      rule: "The schema is executable",
      detail:
        "After the mutation review, the validator reads the schema's vocabularies, patterns, bounds, and conditional rules at runtime — editing the schema changes behavior and trips committed negative tests instead of drifting beside a hand-kept copy.",
    },
  ],
  reviewNote:
    "Two review rounds, every finding dispositioned: seconds-precision UTC timestamps with a committed date-only negative case (round 1), then the schema-becomes-executable hardening after an independent mutation review (round 2). Approval came only after the reviewer reran the negative cases against the final head.",
};

export const orchestrator = {
  title: "#202 (draft) — the 11-gate orchestrator built on that contract",
  points: [
    "Runs the existing closeout commands — core loop, joined demo, UI/API scorecard, host contract, work-sync, recipes, manifests, full suite, lint, diff check — in frozen order. It calls them; it does not fork their logic.",
    "Bounded on purpose: executable allowlist (git / python / ruff only), per-gate timeouts, no shell, secrets stripped from the child environment, freshness backend forced to the offline placeholder.",
    "Every record is validated against the #186 schema as it is generated, and the finished packet is read back and re-verified — gate set, order, artifact hashes, summary counts — before the runner will return it.",
    "A dirty working tree downgrades an otherwise-green gate to CODE-SHIPPED-NOT-VERIFIED, and the runner refuses the packet outright if the commit changes while gates are running.",
  ],
  determinism:
    "Two complete runs on a clean checkout produced byte-identical normalized packets (same SHA-256), with only four documented volatile things normalized: timestamps, durations, runtime addresses, and generated claim IDs mapped by first-seen order. A changed test count or a new failure still changes the digest — the normalization cannot hide a regression.",
};

export type GateStatus = "VERIFIED" | "BLOCKED";

export const gateBoard: { status: GateStatus; count: number; gates: string }[] = [
  {
    status: "VERIFIED",
    count: 8,
    gates:
      "gate-result contract · core loop · joined demo · UI/API scorecard · host contract · work-sync · release-manifest template · lint + diff check",
  },
  {
    status: "BLOCKED",
    count: 3,
    gates:
      "deterministic core loop on Windows (oversized env-var limit) · recipe serving (expected fail-closed: no approved corpus) · full offline suite (same Windows env-var class)",
  },
];

export const blockedNote =
  "The three blocked gates are preserved, not hidden: two are a known Windows environment-variable size limit owned by another lane, and one is the recipe evaluator doing exactly what it should with no approved serving corpus — a fail-closed exit 1 that the orchestrator records as BLOCKED and refuses to promote. The full registry run therefore exits 1, and that is the correct, quotable release observation today.";

export const week8 = {
  title: "What this sets up for Week 8 (Aug 3–7)",
  steps: [
    "Aug 3, noon ET — feature freeze: bind the orchestrator to one exact candidate commit; reject 'latest', abbreviated hashes, and dirty-tree ambiguity.",
    "Aug 4 — run the complete gate matrix; rerun after every accepted repair, keeping command, exit, duration, and artifact hash.",
    "A non-owner clean-clone reproduction, timed, with every setup blocker recorded.",
    "Aug 7 — freeze the machine-readable and one-page human scorecards on current evidence only. No status is promoted by prose.",
  ],
};

export const limitations = [
  "This packet records local, offline command evidence on one machine. It does not prove — and does not claim — native release, production readiness, model or OOD quality, durable multi-worker operation, or managed deployment.",
  "The freshness model remains advisory and the calibration gate remains RE-SCOPE (human-review-only): no automatic approval, no automatic model-based denial. An approved amount is not issuance.",
  "The orchestrator (#202) is a draft under review; the numbers above are its recorded clean-run evidence, not a merged result.",
];
