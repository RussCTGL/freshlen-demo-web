// Module-private data. Snapshot of PR #96 (issue #78), merged to main 2026-07-15.

export const bugsFixed = 2;
export const targetedTests = "113 passed";
export const fullSuite = { passed: 637, skipped: 6 };

export const pipeline = [
  {
    step: "Receipt parse",
    detail: "#77's parse_receipt_text() - item label, price, store, purchase date.",
  },
  {
    step: "Fraud signals",
    detail:
      "#76's compute_fraud_signals() - missing_metadata, exif_ts_mismatch, uniform_background, blur_score -> risk_level.",
  },
  {
    step: "Item identity",
    detail: "#76's matches_receipt_item() - photo vs. receipt label, via classify_item().",
  },
  {
    step: "Gate check",
    detail: 'item_identity_ok = identity_result["match"] is not False and fraud_signals["risk_level"] != "high"',
  },
  {
    step: "Route",
    detail:
      "Gate fails -> human_review (gray_zone_escalate), adjudicate() never runs. Gate passes -> analyze_image() (last, per AGENTS.md), then adjudicate().",
  },
];

export const bugs = [
  {
    title: "fraud_metadata was missing the receipt's purchase date",
    detail:
      'compute_fraud_signals()\'s exif_ts_mismatch signal needs capture_metadata["purchase_date"] to compare against captured_at, but the receipt\'s own field is named purchased_at, so it never got merged in - the signal could never fire. Found by contract-tracing, not a test failure: every existing evidence-gate test monkeypatches compute_fraud_signals. Fixed, and covered by a new test that uses the real function.',
  },
  {
    title: "_decline() silently omitted three keys instead of returning None",
    detail:
      'The pre-model gate decline path (cap exhausted / duplicate photo / duplicate purchase) dropped fraud_signals, identity_result, and receipt_info from its return dict entirely, instead of the documented explicit-None contract the idempotent-replay path already followed. A caller doing result["fraud_signals"] unconditionally got a KeyError instead of None. Fixed, and covered.',
  },
];

export const notDone = {
  criterion: "Route claims to auto_approve when the evidence gate passes and the calibration gate is open.",
  status:
    "Not reachable yet - docs/CALIBRATION.md doesn't exist, so every claim currently routes to human_review regardless of the evidence gate's outcome.",
  reasoning:
    "Expected per AGENTS.md non-negotiable #3, not a bug in this PR - the gate wiring and the routing logic are both done and tested against the real #76/#77/#80 code; only the calibration doc that flips the gate open is still pending.",
};
