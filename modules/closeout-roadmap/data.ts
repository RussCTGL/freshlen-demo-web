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

export const story = {
  lede: "Last week this lane had a contract and a draft. This week, Aug 3–7, it became the release's evidence backbone — four things changed for the whole project.",
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
    sub: "each node = one numbered claim below",
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

export const chainCaption =
  "Where last week ended, what this week added, what the project can now do.";

// ─── This week in commits (Aug 3–7) — merged vs still in freeze review ──────
// Hashes verified against LawrenceHua/es-intern-freshlens on 2026-08-07.

export type WeekCommit = {
  date: string;
  hash: string;
  label: string;
};

export const thisWeek: { label: string; commits: WeekCommit[] }[] = [
  {
    label: "Merged to main",
    commits: [
      { date: "Aug 5", hash: "ceca06b", label: "#229 · LF pin — Windows-clone fix" },
      { date: "Aug 6", hash: "96b8868", label: "#202 · gate orchestrator + handoffs" },
    ],
  },
  {
    label: "In freeze review · #237",
    commits: [
      { date: "Aug 6", hash: "9ae11ff", label: "freeze artifacts: manifest · packet · scorecard" },
      { date: "Aug 6", hash: "648e30b", label: "review round 1 findings applied" },
      { date: "Aug 7", hash: "5a54f33", label: "review round 2 · device matrix" },
    ],
  },
];

// ─── The four claims (one sentence each) ─────────────────────────────────────

export type ImpactClaim = {
  title: string;
  line: string;
  check: string;
};

export const claims: ImpactClaim[] = [
  {
    title: "Release truth stopped being prose.",
    line: "One orchestrator decides VERIFIED: real commands, real exit codes, two runs hashing identically.",
    check:
      "main 96b8868 · packet 8 V / 3 B draft last week → 10 V / 1 B final · 2633 tests, 0 failed · aggregate sha256 7599b67b4f867af126e6ea7631229e658eae76a1d5fad4b42ba6a7aa4996eea7, byte-identical across two runs",
  },
  {
    title: "It became the program's evidence backbone.",
    line: "Other lanes emit its frozen contract; the release manifest binds to its packet.",
    check:
      "PR #237 · first candidate-mode-VALID manifest in program history · zero validator violations · bound to 96b8868",
  },
  {
    title: "It made “no” shippable.",
    line: "3 VERIFIED / 5 BLOCKED / 11 INCONCLUSIVE — every gap owned and dated.",
    check:
      "docs/RELEASE-SCORECARD-2026-08-07.md · the orchestrator's own final run exits 1, by design",
  },
  {
    title: "It changed how the team reviews.",
    line: "Reviews now reproduce numbers, not PR bodies — starting inside this lane's own code.",
    check:
      "review threads #202 · #231 · #233 · caught: a false 17/18 · a stale-zeros deadlock · #221 → #229 (Windows clones)",
  },
];

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
