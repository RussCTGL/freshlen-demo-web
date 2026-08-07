// Frozen snapshot compiled 2026-08-07 from es-intern-freshlens:
// merged PR #202 (squash 96b8868, Aug 7), merged PR #229, PR #237 (in freeze
// review), and the #162 closeout lane's posted records. Numbers come from the
// recorded evidence — nothing here is projected.

export const story = {
  lede:
    "The final closeout week, mapped honestly: what shipped and merged this week (Aug 3–7), the one artifact still sitting in freeze review, and everything that is deliberately NOT done — recorded with a named owner instead of quietly dropped. The roadmap below is the summary; every node is expanded, with its evidence, in the sections underneath.",
};

// ─── The roadmap lanes ────────────────────────────────────────────────────────

export type RoadmapTone = "shipped" | "review" | "handoff";

export type RoadmapNode = {
  title: string;
  line: string;
  /** Optional mono tag rendered top-right of the node (a PR number or an owner). */
  tag?: string;
};

export type RoadmapLane = {
  label: string;
  sub: string;
  tone: RoadmapTone;
  nodes: RoadmapNode[];
};

export const lanes: RoadmapLane[] = [
  {
    label: "Shipped this week",
    sub: "Aug 3–7 · merged or recorded, own implementation",
    tone: "shipped",
    nodes: [
      {
        title: "Gate orchestrator merged",
        line: "11 frozen gates, ~2k lines + 45 adversarial tests, determinism proven",
        tag: "PR #202",
      },
      {
        title: "Six adversarial findings fixed",
        line: "two review rounds; every fix carries a regression test that failed first",
      },
      {
        title: "Line-ending forensics",
        line: "3 digest-bound files pinned to LF; evidence packets pre-empted too",
        tag: "PR #229",
      },
      {
        title: "Final evidence packet",
        line: "10 VERIFIED / 1 BLOCKED at main 96b8868 · 2633 offline tests passed",
      },
      {
        title: "Ledger + handoff artifacts",
        line: "all-eight contribution ledger (alias bug fixed) · 4 handoff artifacts",
      },
      {
        title: "Verification, both directions",
        line: "reproduced MohanLi's evidence; LezhiFu reran this lane from a clean clone",
      },
      {
        title: "Device testing + reviews",
        line: "corroborated #226, filed #230 and #232 · 7 substantive PR reviews",
      },
    ],
  },
  {
    label: "In review at freeze",
    sub: "submitted before the Aug 7 freeze · awaiting review, not merged",
    tone: "review",
    nodes: [
      {
        title: "Release manifest + scorecard",
        line: "first candidate-mode-VALID manifest of the program · 3 VERIFIED / 5 BLOCKED / 11 INCONCLUSIVE",
        tag: "PR #237",
      },
    ],
  },
  {
    label: "Handed off — next week and beyond",
    sub: "not this lane's to do · each item recorded with its owner",
    tone: "handoff",
    nodes: [
      {
        title: "OOD approval block signature",
        line: "release-authority sign-off, blocked on it by design",
        tag: "LawrenceHua",
      },
      {
        title: "#232 ruling",
        line: "claim-submission refusal: by-design fail-closed, or defect",
        tag: "LawrenceHua",
      },
      {
        title: "#226 persistence P1 ruling",
        line: "device-dependent: fails on some phones, not others",
        tag: "LawrenceHua",
      },
      {
        title: "TestFlight / ASC readback",
        line: "exact build readback before anything is submitted",
        tag: "LawrenceHua",
      },
      {
        title: "App Review window Aug 7–10",
        line: "named primary and backup incident owners",
        tag: "LawrenceHua",
      },
      {
        title: "#231 admission-record fix",
        line: "merge post-freeze, then regenerate the records",
        tag: "MohanLi",
      },
      {
        title: "Capture-campaign appends",
        line: "#233/#234/#238 fill five zero-support OOD categories",
        tag: "MohanLi",
      },
      {
        title: "#221 line-ending normalization",
        line: "repo-wide fix stays open; needs a post-internship owner",
        tag: "unowned",
      },
      {
        title: "Durable state · anchoring · issuance",
        line: "deliberately out of scope — fail-closed by design, not forgotten",
        tag: "by design",
      },
    ],
  },
];

export const roadmapCaption =
  "Three lanes, top to bottom: green shipped and merged this week; amber is submitted and waiting at the freeze; the last lane is next week and beyond — every item there has a name on it, because a handoff without an owner is just a dropped ball with paperwork.";

// ─── Lane 1 expanded: shipped this week ──────────────────────────────────────

export const shipped = {
  title: "Shipped this week (Aug 3–7) — the detail behind the green lane",
  items: [
    {
      head: "The deterministic closeout gate orchestrator, merged",
      body: "PR #202 (~2k lines plus 45 adversarial tests) merged to main as squash commit 96b8868 on Aug 7. It runs a frozen 11-gate registry, records the exact command, exit code, duration, and artifact hashes for every gate, and refuses to record a VERIFIED status it did not earn. Determinism is proven, not assumed: two fixed-input runs produce byte-identical normalized aggregates.",
    },
    {
      head: "Two adversarial review rounds, six findings, six fail-first fixes",
      body: "LezhiFu reviewed twice, corroborated by Bill: six reproduced false-green or secret-exposure findings, every one fixed with a regression test that failed before the fix. The fixed classes: a registry pin that covered only the executable name; a secret denylist replaced with an environment allowlist; a stale evidence packet surviving a failed rerun (marker file plus lexists symlink handling); a vacuous git diff --check on a clean tree replaced with an explicit merge-base-bound candidate diff checker; and pytest temp-path non-determinism in failing gates.",
    },
    {
      head: "Windows line-ending forensics",
      body: "Found 3 digest-bound files missing from the LF pin list. PR #229 (the src/*.py pin) merged after MohanLi's verified approval, and the same failure class was pre-empted on evidence packets with -text and -whitespace attributes before it could bite.",
    },
    {
      head: "The evidence chain at the freeze",
      body: "Final packet at main 96b8868: 10 VERIFIED / 1 BLOCKED. The one BLOCKED is the recipe evaluator's EXPECTED fail-closed exit — the orchestrator exits 1 by design, refusing to promote it. Full offline suite: 2633 passed, 0 failed.",
    },
    {
      head: "Verification ran in both directions",
      body: "This lane reproduced MohanLi's model/OOD/recipe evidence on a different platform — which is how the CRLF false-BLOCKED was found, leading to #221 and #229. In the other direction, LezhiFu independently ran the outside-lane clean clone against this candidate: 116.7 seconds clone-to-demo, 16/16 demo hops.",
    },
    {
      head: "Device testing and reviews",
      body: "On a personal iPhone 17 Pro Max: corroborated #226 (receipt→inventory false-success, reproduced across TWO builds), filed #230 (password-reset hit-target, P1) and #232 (claim-submission refusal — flagged as possibly correct fail-closed behavior rather than a bug). Plus 7 substantive PR reviews (4 approvals, 3 changes-requested), every number in them independently reproduced. The all-eight work-sync contribution ledger also landed, after finding and fixing an author-alias bug that undercounted, alongside 4 handoff artifacts: demo segment, device row, clean-clone record, cross-review.",
    },
  ],
  aggregateNote:
    "Normalized aggregate SHA-256 of the final packet — the one number an engineer can re-derive:",
  aggregateSha:
    "7599b67b4f867af126e6ea7631229e658eae76a1d5fad4b42ba6a7aa4996eea7",
};

// ─── Lane 2 expanded: in review at freeze ────────────────────────────────────

export const inReview = {
  title: "In review at the freeze",
  body: "PR #237: the first candidate-mode-VALID release manifest of the program — zero validator violations, bound to commit 96b8868 — plus a one-page release scorecard reading 3 VERIFIED / 5 BLOCKED / 11 INCONCLUSIVE. Submitted before the freeze; it is review evidence, not a merged result, and it is listed here as exactly that.",
};

// ─── Lane 3 expanded: the handoff, with owners ───────────────────────────────

export const handoff = {
  title: "Handed off — who owns what, next week and beyond",
  groups: [
    {
      owner: "LawrenceHua — release authority",
      items: [
        "The OOD approval block signature — blocked on release authority by design.",
        "The #232 ruling: is the claim-submission refusal by-design fail-closed behavior, or a defect?",
        "The #226 persistence-fix P1 ruling — it is device-dependent: it fails on some phones and not others.",
        "The exact TestFlight / App Store Connect build readback.",
        "The App Review window, Aug 7–10, with named primary and backup incident owners.",
      ],
    },
    {
      owner: "MohanLi — model / data lane",
      items: [
        "Merge #231 (the admission-record ID fix) after the freeze, then regenerate the records.",
        "The capture-campaign appends (#233/#234/#238, in sequence) to fill the five zero-support OOD categories.",
      ],
    },
    {
      owner: "Repo-level — needs a post-internship owner",
      items: [
        "The general line-ending normalization (#221) stays open.",
        "Durable multi-worker state, external anchoring, and issuance remain deliberately out of scope — the system fails closed on all three by design.",
      ],
    },
  ],
};

// ─── The honesty ledger ──────────────────────────────────────────────────────

export const honesty = {
  title: "The honesty ledger — part of the story, not hidden",
  body: "Several of this lane's own claims were publicly corrected during the week: a file count, a gate metric, and a vacuous check in its own earlier evidence. That is the point of the tooling — the machinery catches what people miss, including its author. A closeout that only ever corrected other people's numbers would be suspicious.",
};

// ─── What this does not claim ────────────────────────────────────────────────

export const limitations = [
  "The shopper-facing native pipeline (scan → inventory → claim) is NOT live, and was never claimed to be. What ships is a verified local loop plus an evidence system that makes every unfinished thing visible with an owner and a date.",
  "PR #237 is in freeze review, not merged; its scorecard numbers are submitted evidence, not an accepted result.",
  "The freshness model remains advisory and the calibration gate remains RE-SCOPE (human-review-only): no automatic approval, no automatic model-based denial.",
  "Nothing in the handoff lane is a promise by this lane — each item is recorded with the person or role that actually owns it.",
];
