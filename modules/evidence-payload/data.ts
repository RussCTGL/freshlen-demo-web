// Module-private data. Sourced from src/audit.py (evidence_payload, PR #94) and
// src/claims.py (evaluate_claim's "evaluated" audit event, PR #96) on es-intern-freshlens.

export type SeamRow = {
  field: string;
  source: string;
  type: string;
};

// The naming seam evidence_payload() exists to pin down: Week-5 modules (#76/#77) don't
// share field names 1:1 with the audit payload, so this constructor is the one place the
// mapping is enforced rather than re-typed at each call site.
export const seam: SeamRow[] = [
  {
    field: "fraud_risk",
    source: 'compute_fraud_signals()["risk_level"]',
    type: '"low" | "medium" | "high"',
  },
  {
    field: "identity_match",
    source: 'matches_receipt_item()["match"]',
    type: "bool | None",
  },
  {
    field: "receipt_parse_ok",
    source: 'parse_receipt_text()["parse_ok"]',
    type: "bool",
  },
];

export const beforePayload = `{
  "model_ran": True,
  "captured_in_app": captured_in_app,
}`;

export const afterPayload = `{
  "model_ran": True,
  "captured_in_app": captured_in_app,
  "evidence": audit.evidence_payload(
    fraud_risk=fraud_signals["risk_level"],
    identity_match=identity_result["match"],
    receipt_parse_ok=receipt_info["parse_ok"],
  ),
}`;

export type EnumTry = {
  value: string;
  outcome: "ok" | "error";
  detail: string;
};

// _FRAUD_RISK_LEVELS = frozenset({"low", "medium", "high"}) — anything else raises ValueError
// before it ever reaches the hash chain, so a typo can't silently land as an unredacted string.
export const enumTries: EnumTry[] = [
  { value: "low", outcome: "ok", detail: '{"fraud_risk": "low", ...}' },
  { value: "medium", outcome: "ok", detail: '{"fraud_risk": "medium", ...}' },
  { value: "high", outcome: "ok", detail: '{"fraud_risk": "high", ...}' },
  {
    value: "critical",
    outcome: "error",
    detail: "ValueError: invalid fraud_risk 'critical'; allowed: ['high', 'low', 'medium']",
  },
];

export const stats = {
  newTests: 5,
  fileTotal: 46,
  fileBaseline: 41,
  suitePassed: 626,
  suiteSkipped: 3,
};

export const timeline = [
  {
    date: "2026-07-15",
    label: "PR #94 merged",
    detail:
      "evidence_payload() lands in src/audit.py — standalone, zero import from claims.py, zero change to append_event/verify_audit_chain (payload was already an opaque dict).",
  },
  {
    date: "2026-07-16",
    label: "PR #96 merged",
    detail:
      'evaluate_claim\'s "evaluated" audit event (src/claims.py) starts calling evidence_payload() for real, nested under an "evidence" key — the hand-built placeholder dict is gone.',
  },
];
