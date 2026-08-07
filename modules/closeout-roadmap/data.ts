// Frozen snapshot compiled 2026-08-07 from es-intern-freshlens:
// merged PR #202 (squash 96b8868), merged PR #229, PR #237 (in freeze review),
// docs/RELEASE-SCORECARD-2026-08-07.md, and the review threads on
// #202/#231/#233. Numbers come from the recorded evidence — nothing projected.
//
// 2026-08-07 rework 2: visual-first. The impact chain is the page; all prose
// is captions. Visible prose (lede + caption + claims + handoff + not-claimed,
// excluding node labels and CHECK lines) is kept under ~150 words.
//
// 2026-08-07 rework 3: anchor the week. Issue #162 ran for weeks; what THIS
// week (Aug 3–7) delivered is now dated — lane 1 shows where last week ended
// (Aug 2), commit hashes sit on the chain nodes, and a merged-vs-in-review
// commit strip lives inside the hero card.
//
// 2026-08-07 rework 4: spell out the packet — the 10 VERIFIED gates named in
// plain English, and the 1 BLOCKED gate explained as by-design.
//
// 2026-08-07 rework 5: cut hard for the manager demo. The claims grid said
// what lane 3 already says — deleted. Caption deleted, glosses ≤4 words.
//
// 2026-08-07 rework 6: visual-first, again. Big-number scoreboard (8/3 →
// 10/1), a week timeline instead of a commit list, and the packet as an
// 11-tile gate wall instead of 11 text rows.

export const story = {
  lede: "Last week: a contract and a draft. This week (Aug 3–7): the release's evidence backbone.",
};

// ─── The impact chain (the hero visual) ──────────────────────────────────────

export type ChainTone = "before" | "machinery" | "now";

export type ChainNode = {
  title: string;
  line: string;
  /** Optional mono tag rendered top-right of the node (a PR / commit ref). */
  tag?: string;
};

export type ChainLane = {
  label: string;
  sub: string;
  tone: ChainTone;
  nodes: ChainNode[];
};

export const lanes: ChainLane[] = [
  {
    label: "Last week — rules and a draft",
    sub: "where the lane stood on Aug 2",
    tone: "before",
    nodes: [
      {
        title: "A contract for one result",
        line: "the rules for a gate result — not the run itself",
        tag: "#186 · Jul 31",
      },
      {
        title: "Orchestrator: draft only",
        line: "8 VERIFIED / 3 BLOCKED — “not a merged result”",
        tag: "#202 draft",
      },
      {
        title: "Manifest: just a template",
        line: "the validator existed; nothing had ever passed it",
      },
      {
        title: "Week 8 was a plan",
        line: "freeze · full matrix · clean-clone repro · scorecards",
      },
    ],
  },
  {
    label: "What this week added",
    sub: "shipped this week · Aug 3–7",
    tone: "machinery",
    nodes: [
      {
        title: "Deterministic gate orchestrator",
        line: "exact commands · real exit codes · byte-addressed artifacts",
        tag: "96b8868 · Aug 6",
      },
      {
        title: "Frozen gate-result contract",
        line: "other lanes emit it — “no new integration”",
      },
      {
        title: "Packet → manifest → validator",
        line: "template → first manifest ever to validate · zero violations",
        tag: "9ae11ff · in review",
      },
      {
        title: "Default-REFUTED review",
        line: "6 false-green findings · 6 fail-first regression tests",
      },
    ],
  },
  {
    label: "What the project can now do",
    sub: "the payoff, one line each",
    tone: "now",
    nodes: [
      {
        title: "VERIFIED is earned, not typed",
        line: "two runs, one hash — or the evidence is rejected",
        tag: "96b8868",
      },
      {
        title: "Lanes plug in, no integration",
        line: "the model-evidence gate emits the contract directly",
      },
      {
        title: "Ship an honest “no”",
        line: "3 VERIFIED / 5 BLOCKED / 11 INCONCLUSIVE — every gap owned + dated",
        tag: "in #237 review",
      },
      {
        title: "Reviews reproduce numbers",
        line: "false 17/18 · stale-zeros deadlock · #221 — all caught this week",
        tag: "ceca06b · Aug 5",
      },
    ],
  },
];

// ─── The scoreboard delta ────────────────────────────────────────────────────
// Packet gate counts: draft run Jul 31 vs final merged run Aug 6.

export const delta = {
  before: { v: 8, b: 3, label: "Last week · draft" },
  after: { v: 10, b: 1, label: "This week · merged" },
  footnote: "Plus: the first manifest ever to validate — in freeze review · #237",
};

// ─── This week in commits (Aug 3–7) — merged vs still in freeze review ──────
// Hashes verified against LawrenceHua/es-intern-freshlens on 2026-08-07.

export type WeekCommit = {
  /** Day of month, 3–7 (Mon–Fri) — drives the timeline column. */
  day: number;
  hash: string;
  label: string;
};

export const thisWeek: { label: string; commits: WeekCommit[] }[] = [
  {
    label: "Merged to main",
    commits: [
      { day: 5, hash: "ceca06b", label: "#229 · Windows-clone fix" },
      { day: 6, hash: "96b8868", label: "#202 · orchestrator" },
    ],
  },
  {
    label: "In freeze review · #237",
    commits: [
      { day: 6, hash: "9ae11ff", label: "freeze artifacts" },
      { day: 6, hash: "648e30b", label: "review round 1" },
      { day: 7, hash: "5a54f33", label: "review round 2" },
    ],
  },
];

// ─── The final packet as a gate wall ─────────────────────────────────────────
// Gate names + statuses verified against
// artifacts/releases/2026-08-07/rc-main/aggregate.normalized.json (10 V / 1 B).

export type Gate = {
  name: string;
  status: "VERIFIED" | "BLOCKED";
  /** Only the blocked gate carries a note — the reason is the story. */
  note?: string;
};

export const gates: Gate[] = [
  { name: "deterministic_core_loop", status: "VERIFIED" },
  { name: "joined_demo", status: "VERIFIED" },
  { name: "full_offline_suite", status: "VERIFIED" },
  { name: "gate_result_contract", status: "VERIFIED" },
  { name: "host_contract", status: "VERIFIED" },
  { name: "ui_api_scorecard", status: "VERIFIED" },
  { name: "release_manifest_contract", status: "VERIFIED" },
  { name: "work_sync", status: "VERIFIED" },
  { name: "lint", status: "VERIFIED" },
  { name: "diff_check", status: "VERIFIED" },
  {
    name: "recipe_serving",
    status: "BLOCKED",
    note: "no approved corpus → refuses to serve (by design, #235)",
  },
];

export const gatesNote =
  "Last week: 8 verified / 3 blocked — the two gates stuck on the Windows env-var limit are green now.";

// ─── Handoff — owner → noun phrase ───────────────────────────────────────────

export const handoff = {
  title: "Handoff — who owns what next",
  rows: [
    {
      owner: "LawrenceHua",
      line: "rulings #226 / #232 · OOD signature · App Review Aug 7–10",
    },
    {
      owner: "MohanLi",
      line: "#231 post-freeze · capture campaign #233 / #234 / #238",
    },
    {
      owner: "Post-internship owner",
      line: "#221 · durable state / anchoring / issuance — fail-closed by design",
    },
  ],
};

// ─── What this does not claim ────────────────────────────────────────────────

export const limitations = [
  "The native shopper pipeline is not live — and was never claimed to be.",
  "What ships: a verified local loop, every gap owned and dated.",
];
