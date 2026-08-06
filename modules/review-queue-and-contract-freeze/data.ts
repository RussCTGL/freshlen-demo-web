// Figures are from the two merged PRs this card covers:
// PR #131 (issue #105, review queue + policy config) and PR #148 (issue #129, host contract v1).

export const stats = [
  { label: "Suite after #105", value: "761 passed" },
  { label: "Contract fixtures", value: "4 valid / 20 invalid" },
  { label: "Gaps found reviewing my own work", value: "9" },
];

export const shipped = [
  {
    route: "GET /api/claims?status=human_review",
    note: "owner-scoped, bounded, redacted queue rows — a reviewer sees their store and no other",
  },
  {
    route: "GET / POST /api/policy/config",
    note: "owner-account-scoped; a write now has real effect on a later approval",
  },
  {
    route: "review_claim clamp",
    note: "uses the account's effective per_claim_cap_cents, not only the global default",
  },
];

/** Locked fields are the calibration gate. They are refused whole, never partially. */
export const locked = {
  fields: ["auto_approve_min_score", "min_confidence_for_auto"],
  rule: "400, even when mixed with a valid field in the same POST — no partial write on a locked field.",
};

export const closedLoop =
  "Reviewing my own diff surfaced that GET /api/policy/config reported the configured limit but not remaining_cap_cents — a shopper has a right to know what is left, not just what the ceiling is. Fixed here, which also closes the disclosure item I deferred in week 3.";

/** The adversarial pass over my own rule engine, before the PR. */
export const gaps = [
  "auth bypass on monitor_event",
  "per-claim ceiling not enforced on approvals",
  "decision enum unvalidated",
  "three KeyError crash paths on missing fields",
  "asymmetric scope check (store vs account)",
  "authority-override check scoped too narrowly",
  "under-specified stacked-attack test",
  "HTTP-method-blind route classifier",
];

export const antiVacuity =
  "The validator re-derives each fixture's expected outcome from the contract's business rules instead of trusting the expected block written into the fixture. A fixture that lies about itself fails; a rule engine that agrees with a wrong fixture cannot hide. Two runs over every fixture are byte-stable.";

export const contractParts = [
  { name: "es_claim_host_v1.schema.json", note: "draft 2020-12 · 17 error_code values" },
  { name: "ES-CLAIM-HOST-CONTRACT-V1.md", note: "permission matrix · state machine · error table · compatibility report" },
  { name: "contract_fixtures/", note: "4 valid + 20 invalid, synthetic and privacy-clean" },
  { name: "test_es_claim_host_contract.py", note: "offline validator, no jsonschema dependency" },
];

export const knownGaps = [
  "Create-idempotency (shopper, operation, key) binding is not implemented in the live code.",
  "#120 finalization — atomic cap, decision, audit, binding, anchor — is entirely unimplemented. This contract describes that boundary; it does not cross it.",
];
