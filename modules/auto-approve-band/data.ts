// Module-private data. Snapshot of PR #65 (issue #54), merged to main.

export const testsPassing = "32/32";
export const fullSuite = { passed: 558, skipped: 3 };
export const bugsFixed = 3;

export const bugs = [
  {
    title: "Ignored quality_category - off-by-one at 70",
    detail:
      'Band 3 only checked freshness_score >= 70, never quality_category == "waste". But quality_for(70) returns "conversion" - waste starts at 71. A score of exactly 70, a conversion item, could auto-approve, which the spec forbids.',
  },
  {
    title: "min_confidence_for_auto = 1.0 didn't disable auto-approve",
    detail:
      'Band 2 used > 1.0, so setting the floor to exactly 1.0 (a natural "require 100% confidence" setting) skipped the gate - and the model does legitimately return confidence == 1.0. Should be >=.',
  },
  {
    title: "No boundary tests",
    detail:
      "Nothing covered score 70 vs. 71 or confidence == 1.0. One existing test even asserted the buggy behavior (70 -> auto_approve) as correct.",
  },
];

export const sharedHelper = `def is_auto_approve_eligible(assessment, claim, policy, remaining_cap_cents) -> bool:
    return (
        assessment["quality_category"] == "waste"
        and assessment["confidence"] >= policy["min_confidence_for_auto"]
        and claim["requested_amount_cents"] <= policy["auto_approve_below_cents"]
        and claim["requested_amount_cents"] <= remaining_cap_cents
    )`;

export type Row = { case: string; before: string; after: string; changed: boolean };

export const beforeAfter: Row[] = [
  {
    case: "score 70, conversion, confidence 0.90",
    before: "auto_approve (bug)",
    after: "human_review",
    changed: true,
  },
  {
    case: "score 71, waste, confidence 0.90, under cap",
    before: "auto_approve",
    after: "auto_approve (unchanged, correct)",
    changed: false,
  },
  {
    case: "confidence 1.0, floor = 1.0",
    before: "auto_approve (bug)",
    after: "human_review",
    changed: true,
  },
  {
    case: "confidence = None",
    before: "human_review",
    after: "human_review (unchanged)",
    changed: false,
  },
];

export const notDone = {
  criterion:
    "Issue #54's third acceptance criterion: adjudicate and fake_detect_probe call the same eligibility helper.",
  status:
    "Not there yet - is_auto_approve_eligible exists and adjudicate() uses it, but fake_detect_probe.py still runs its own WASTE_SCORE_FLOOR = 70 check.",
  reasoning:
    "That's a scope call, not an oversight: the probe file belongs to Lisa's #56, and #56 depends on #54's output, not the reverse. The helper's ready and the handoff is noted in the PR description.",
};
