// Frozen snapshot compiled 2026-08-07 from es-intern-freshlens:
// merged PR #202 (squash 96b8868), merged PR #229, PR #237 (in freeze review),
// docs/RELEASE-SCORECARD-2026-08-07.md, and the review threads on
// #202/#231/#233. Numbers come from the recorded evidence — nothing projected.
//
// 2026-08-07 rework 2: visual-first. The impact chain is the page; all prose
// is captions. Visible prose (lede + caption + claims + handoff + not-claimed,
// excluding node labels and CHECK lines) is kept under ~150 words.

export const story = {
  lede: "Four things changed for the whole project because this lane existed.",
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
    label: "Before — release truth was prose",
    sub: "closeout without this lane",
    tone: "before",
    nodes: [
      {
        title: "Eleven commands, run by hand",
        line: "statuses typed into markdown; stale numbers copied forward",
      },
      {
        title: "Every lane its own format",
        line: "release claims = trusting each PR body separately",
      },
      {
        title: "Pressure to call it green",
        line: "demo-week closeouts default to “done”",
      },
      {
        title: "Reviews read, not reran",
        line: "a number in a PR body was taken at its word",
      },
    ],
  },
  {
    label: "The machinery",
    sub: "what this lane shipped into main",
    tone: "machinery",
    nodes: [
      {
        title: "Deterministic gate orchestrator",
        line: "exact commands · real exit codes · byte-addressed artifacts",
        tag: "PR #202",
      },
      {
        title: "Frozen gate-result contract",
        line: "other lanes emit it — “no new integration”",
      },
      {
        title: "Packet → manifest → validator",
        line: "one bound chain · zero validator violations",
        tag: "PR #237",
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
      },
      {
        title: "Reviews reproduce numbers",
        line: "false 17/18 · stale-zeros deadlock · #221 — all caught this week",
      },
    ],
  },
];

export const chainCaption =
  "What got replaced, what replaced it, what the project can now do.";

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
      "main 96b8868 · 2633 tests, 0 failed · aggregate sha256 7599b67b4f867af126e6ea7631229e658eae76a1d5fad4b42ba6a7aa4996eea7, byte-identical across two runs",
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
