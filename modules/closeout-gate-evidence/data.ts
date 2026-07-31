// Frozen snapshot compiled 2026-07-31 from es-intern-freshlens:
// PR #186 (merged Jul 31, main a98e6217), draft PR #202, and the #162 closeout
// lane's posted gate records. Numbers come from the recorded evidence.
// 2026-07-31 revision (#63): plainer copy + BPMN-style flow diagram.

export const story = {
  lede: "Before release, every closeout claim has to come from a command that actually ran. This week shipped two things: a contract that defines what one gate result may claim (#186, merged), and an orchestrator that runs all 11 closeout gates and produces one signed-by-hashes evidence packet (#202, draft). Today's honest packet: 8 gates verified, 3 blocked, exit code 1 — and that nonzero exit is correct.",
};

export const contract = {
  title: "#186 — the rules for one gate result (merged Jul 31)",
  files: [
    { name: "schema (JSON)", count: 42 },
    { name: "validator / CLI", count: 248 },
    { name: "tests", count: 190 },
  ],
  rules: [
    {
      rule: "VERIFIED needs proof",
      detail: "Exact commit + artifact file + its SHA-256, or the record fails validation.",
    },
    {
      rule: "A timeout never verifies",
      detail: "Timed-out work is BLOCKED, full stop.",
    },
    {
      rule: "Four statuses only",
      detail: "VERIFIED, CODE-SHIPPED-NOT-VERIFIED, BLOCKED, INCONCLUSIVE. Unknowns stay INCONCLUSIVE.",
    },
    {
      rule: "The schema runs",
      detail: "The validator executes the schema's rules at runtime, so editing the schema trips tests instead of drifting.",
    },
  ],
  reviewNote:
    "Two review rounds; approval came only after the reviewer reran the negative cases against the final head.",
};

export const flow = {
  title: "One orchestrator run (BPMN-style)",
  caption:
    "Three ways out, all labeled: exit 0 means every gate verified; exit 1 means the packet honestly contains blocked or unverified gates (today's state); exit 2 means the run itself was invalid — bad registry, source changed mid-run, or a packet that failed its own re-validation — so nothing is quotable.",
};

export const orchestrator = {
  title: "#202 (draft) — how the runner stays honest",
  points: [
    "It runs the existing commands (tests, demo, lint, manifests). It re-implements none of them.",
    "Only git / python / ruff may run, with no shell, per-gate timeouts, and secrets stripped from the environment.",
    "Every record is checked against #186 as it is written; the finished packet is read back and re-verified before the runner returns it.",
    "A dirty working tree downgrades green results; a commit change mid-run throws the whole packet away.",
  ],
  determinism:
    "Two full runs on a clean checkout gave byte-identical normalized packets (same SHA-256). Only timestamps, durations, memory addresses, and generated claim IDs are normalized — a changed test count or new failure still changes the hash.",
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
      "core loop on Windows (env-var size limit) · recipe serving (no approved corpus — fail-closed on purpose) · full offline suite (same Windows limit)",
  },
];

export const blockedNote =
  "The three blocked gates are shown, not hidden. Two are a known Windows environment-variable limit owned by another lane; one is the recipe evaluator correctly refusing to serve without an approved corpus. The orchestrator records them as BLOCKED and exits 1 — the accurate summary of where the release actually stands.";

export const week8 = {
  title: "Week 8 (Aug 3–7)",
  steps: [
    "Aug 3, noon ET — freeze: pin the orchestrator to one exact candidate commit.",
    "Aug 4 — run the full matrix; rerun after every accepted repair.",
    "A non-owner reproduces the run from a clean clone, timed.",
    "Aug 7 — freeze the final scorecards on current evidence only.",
  ],
};

export const limitations = [
  "This is local, offline command evidence from one machine. It does not claim native release, production readiness, model or OOD quality, durable multi-worker operation, or managed deployment.",
  "The UI/API gate is the offline structural scorecard only. The orchestrator does not validate or aggregate the all-eight physical-device matrix — device participation, app build, and native source-linkage records are separate, separately-owned evidence and are never counted among this packet's verified gates.",
  "The freshness model remains advisory and the calibration gate remains RE-SCOPE (human-review-only): no automatic approval, no automatic model-based denial. An approved amount is not issuance.",
  "The orchestrator (#202) is a draft under review; its numbers are recorded clean-run evidence, not a merged result.",
];
