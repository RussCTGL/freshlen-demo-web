// Frozen snapshot compiled 2026-08-07 from es-intern-freshlens:
// merged PR #202 (squash 96b8868, Aug 7), merged PR #229, PR #237 (in freeze
// review), docs/RELEASE-SCORECARD-2026-08-07.md, and the review threads on
// #202/#231/#233. Numbers come from the recorded evidence — nothing projected.
//
// Framing (2026-08-07 rework): not a chronology of the lane's activity, but
// what changed for the whole project because the lane existed — four impact
// claims, each with a before, an after, and one checkable fact.

export const story = {
  lede:
    "This is not a list of what the closeout lane did in its final week. It is what changed for the whole project because the lane existed — four claims, each with a before, an after, and one fact an engineer can go check.",
};

// ─── The impact chain (the visual) ───────────────────────────────────────────

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
    sub: "how closeout worked without this lane",
    tone: "before",
    nodes: [
      {
        title: "Eleven commands, run by hand",
        line: "statuses typed into markdown; numbers copied forward from stale runs",
      },
      {
        title: "Every lane its own format",
        line: "release claims meant trusting each PR body separately",
      },
      {
        title: "Pressure to call it green",
        line: "a demo-week closeout defaults to declaring things done",
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
        line: "exact commands, real exit codes, byte-addressed artifacts",
        tag: "PR #202",
      },
      {
        title: "Frozen gate-result contract",
        line: "one record format any lane can emit into",
      },
      {
        title: "Packet → manifest → validator",
        line: "one bound chain, zero validator violations",
        tag: "PR #237",
      },
      {
        title: "Default-REFUTED review",
        line: "six false-green findings, six fail-first regression tests",
      },
    ],
  },
  {
    label: "What the project can now do",
    sub: "the after — each node expands into a claim below",
    tone: "now",
    nodes: [
      {
        title: "VERIFIED is earned, not typed",
        line: "two runs must hash identically or the evidence is rejected",
        tag: "96b8868",
      },
      {
        title: "Lanes plug in, no integration",
        line: "the model-evidence gate emits the contract directly",
      },
      {
        title: "Ship an honest no",
        line: "3 VERIFIED / 5 BLOCKED / 11 INCONCLUSIVE, every gap owned and dated",
      },
      {
        title: "Reviews reproduce numbers",
        line: "a false 17/18, a stale-zeros deadlock, and #221 all caught this week",
      },
    ],
  },
];

export const chainCaption =
  "Read top to bottom: the prose-verified world this lane replaced, the machinery that replaced it, and what the project can now do because of it. Each node in the bottom lane expands into one of the four numbered claims below.";

// ─── The four impact claims ──────────────────────────────────────────────────

export type ImpactClaim = {
  title: string;
  before: string;
  after: string;
  check: string;
};

export const claims: ImpactClaim[] = [
  {
    title: "The project's release truth stopped being prose.",
    before:
      "Closeout meant eleven commands run by hand, statuses typed into markdown, and numbers copied forward from stale runs. The program's own docs warned that no status is promoted by prose alone — and prose was exactly how statuses were being promoted.",
    after:
      "One deterministic orchestrator decides what VERIFIED means: the exact command, its real exit code, byte-addressed artifacts, and two fixed-input runs that must hash identically — or the evidence is rejected outright.",
    check:
      "The final packet at main 96b8868. Normalized aggregate SHA-256 7599b67b4f867af126e6ea7631229e658eae76a1d5fad4b42ba6a7aa4996eea7, reproduced byte-identically across two runs.",
  },
  {
    title:
      "Other lanes plugged into it — it became the program's evidence backbone, not one intern's tool.",
    before:
      "Each lane reported status in its own shape, so a release claim meant separately trusting every lane's write-up; nothing structural forced the pieces to agree.",
    after:
      "MohanLi's model-evidence gate emits records in this lane's frozen gate-result contract — “so his orchestrator ingests them with no new integration”, in Mohan's own demo-segment words. The release manifest binds to this lane's packet, and Lawrence merged the candidate against this lane's evidence. The first candidate-mode-VALID release manifest in program history — zero validator violations — exists because packet, manifest, and validator form one chain.",
    check: "PR #237: the candidate-mode-VALID release manifest, bound to 96b8868.",
  },
  {
    title: "It made “no” shippable — which is the product's legal posture.",
    before:
      "FreshLens's core rule is advisory-only, human-review-only, fail-closed. A closeout that pressure-cooked everything green would have contradicted the product's own safety story on its way out the door.",
    after:
      "The final scorecard ships 3 VERIFIED / 5 BLOCKED / 11 INCONCLUSIVE with a named owner and date on every unfinished thing — and the orchestrator exits 1 on its own final run BY DESIGN, because one gate is honestly blocked. The company gets a release record it can defend, not a demo it has to walk back.",
    check: "docs/RELEASE-SCORECARD-2026-08-07.md in es-intern-freshlens.",
  },
  {
    title: "It changed how the team reviews.",
    before:
      "A review meant reading the diff and taking the PR body's numbers at their word.",
    after:
      "The lane itself was reviewed adversarially — six reproduced false-green findings across two rounds, every one fixed with a regression test that failed first — and the same default-REFUTED discipline propagated. Reviews across lanes this week reproduced each other's numbers instead of trusting PR bodies: they caught a false 17/18 claim, a stale-zeros deadlock that cost a teammate a day, and a cross-platform line-ending defect (#221 → #229) that was silently breaking every Windows clone in the cohort. The discipline cut both ways: several of this lane's own claims — a file count, a gate metric, a vacuous check in its own earlier evidence — were publicly corrected the same week.",
    check: "The review threads on #202, #231, and #233.",
  },
];

// ─── Handoff — who owns what next (compact) ──────────────────────────────────

export const handoff = {
  title: "Handoff — who owns what next",
  groups: [
    {
      owner: "LawrenceHua — release authority",
      line: "OOD approval block signature · #232 ruling (by-design fail-closed, or defect) · #226 persistence P1 ruling (device-dependent: fails on some phones, not others) · exact TestFlight/ASC build readback · App Review window Aug 7–10 with named primary and backup incident owners.",
    },
    {
      owner: "MohanLi — model / data lane",
      line: "Merge #231 (admission-record ID fix) post-freeze and regenerate the records · capture-campaign appends #233/#234/#238 to fill the five zero-support OOD categories.",
    },
    {
      owner: "Repo-level — needs a post-internship owner",
      line: "The general line-ending normalization (#221) stays open · durable multi-worker state, external anchoring, and issuance remain deliberately out of scope — fail-closed by design.",
    },
  ],
};

// ─── What this does not claim ────────────────────────────────────────────────

export const limitations = [
  "The shopper-facing native pipeline (scan → inventory → claim) is NOT live, and was never claimed to be. What ships is a verified local loop plus an evidence system that makes every unfinished thing visible with an owner and a date.",
  "PR #237 is in freeze review, not merged; its scorecard numbers are submitted evidence, not an accepted result.",
  "The freshness model remains advisory and the calibration gate remains RE-SCOPE (human-review-only): no automatic approval, no automatic model-based denial.",
  "Nothing in the handoff section is a promise by this lane — each item is recorded with the person or role that actually owns it.",
];
