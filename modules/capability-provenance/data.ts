// Module-private data. Sourced from src/es_proxy_client.py, scripts/es_capabilities.py,
// src/claims.py (claim_report_rows, #111), and scripts/demo_claim_loop.py on es-intern-freshlens.

export type StatusRow = {
  route: string;
  status: "ok" | "disabled" | "unavailable";
  note: string;
};

// Real output of `python scripts/es_capabilities.py --fixture tests/fixtures/proxy_capabilities.json`
// — offline, zero network calls, reports capability status only from a captured /capabilities doc.
export const fixtureRun: StatusRow[] = [
  { route: "/nutrition/{produce_type}", status: "disabled", note: "advertised but explicitly turned off" },
  { route: "/model-info", status: "ok", note: "not called — fixture mode reports status only" },
  { route: "/budget", status: "ok", note: "not called — fixture mode reports status only" },
  { route: "/date-label/decode", status: "unavailable", note: "not advertised by this fixture" },
  { route: "/markdown/suggest", status: "ok", note: "not called — fixture mode reports status only" },
];

export const proxyStatusEnum = [
  { value: "ok", detail: "advertised and enabled" },
  { value: "disabled", detail: "advertised but explicitly turned off" },
  { value: "unavailable", detail: "not advertised, or capability discovery itself failed" },
  { value: "invalid_response", detail: "malformed JSON, wrong shape, unexpected status" },
];

export const reportRow = {
  claim_id: "clm_d4b9acfe3d030a94",
  claim_status: "approved",
  decision_outcome: "approve",
  requested_cents: "349",
  approved_cents: "349",
  model_version: "",
};

export const modelVersionNote = `"model_version" remains empty because FreshnessAssessment stores only a
backend class (placeholder / es-api / es-api-fallback), not a semantic model
version. Wiring a real allowlisted version requires #104's model-info
capability, which is out of scope here.`;

export const amountDerivation = `# src/claims.py, review_claim() — the reviewer's approve call carries NO amount field
requested = amount_cents if amount_cents is not None else claim["requested_amount_cents"]
if requested > claim["requested_amount_cents"]:
    raise AmountInflationDeniedError("amount_inflation_denied")
if requested > policy.PLATFORM_MAX_PER_CLAIM_CAP_CENTS or requested > effective_policy["per_claim_cap_cents"]:
    raise CeilingExceededError("ceiling_exceeded")
amount = max(0, min(requested, remaining_cap_cents(account_id)))`;

export const stats = {
  proxyClientPassed: 28,
  failureMatrixPassed: 7,
  claimReportPassed: 29,
  suitePassed: 2078,
  suiteSkipped: 15,
};

export const timeline = [
  {
    date: "2026-07-22",
    label: "#104 — ESProxyClient + capability doctor (PR #135)",
    detail:
      "src/es_proxy_client.py adds SAFE_ROUTES + ProxyStatus (ok/disabled/unavailable/invalid_response). scripts/es_capabilities.py prints ONLY route status + model-info provenance keys — never token values, Authorization headers, or raw upstream payloads. Hardened for adversarial input two days later (#138, #144).",
  },
  {
    date: "2026-07-24",
    label: "#111 — account-scoped claims report (PR #136)",
    detail:
      "src/claims.py:claim_report_rows() adds a flat, deterministic, one-row-per-claim export (POST /api/report/export, mode=claims). Bounded to MAX_CLAIM_REPORT_ROWS=5000; ties break on stable insertion order since timestamps have 1s resolution.",
  },
  {
    date: "2026-07-27",
    label: "Week 6 demo — capability doctor -> report hinge",
    detail:
      "Live at b6f9665: es_capabilities.py --fixture shows /model-info as ok-but-not-called; the same report's model_version field is empty for exactly that reason — the system refusing to guess, not a bug.",
  },
];
