// Every figure here was re-run on FreshLens `main` at 83b9a8b before it was written down.
// Host: Windows 11 zh-CN / CPython 3.13.9 / PYTHONIOENCODING=utf-8.
// A row may only cite what its commit actually contains — which is why the contract
// validator (unmerged PR #183) appears as `not-on-candidate`, not as evidence.

export const candidate = {
  repo: "LawrenceHua/es-intern-freshlens",
  commit: "83b9a8b",
  contractVersion: "1.0",
  schemaBlob: "cd927970f3159bba42014a03e049cad630ec9313df4efa00c122ada41f77ccc4",
  environment: "Windows 11 zh-CN · CPython 3.13.9 · PYTHONIOENCODING=utf-8",
};

export const headline = [
  { label: "Offline golden path", value: "16 / 16", note: "exit 0, 0.67 s" },
  { label: "Contract rule tests", value: "70", note: "passed in 0.28 s" },
  { label: "Closed error set", value: "21", note: "17 caller · 4 dependency" },
];

/** Endpoint × role authority matrix. `deny` renders as a red 403. */
export type Cell = { text: string; deny?: boolean; note?: string };
export const authorityMatrix: {
  operation: string;
  route: string;
  shopper: Cell;
  reviewer: Cell;
  policyAdmin: Cell;
}[] = [
  {
    operation: "Create claim",
    route: "POST /api/claims",
    shopper: { text: "own account" },
    reviewer: { text: "403", deny: true },
    policyAdmin: { text: "403", deny: true },
  },
  {
    operation: "Evaluate claim",
    route: "POST /api/claims/{id}/evaluate",
    shopper: { text: "own claim" },
    reviewer: { text: "403", deny: true },
    policyAdmin: { text: "403", deny: true },
  },
  {
    operation: "Read claim detail",
    route: "GET /api/claims/{id}",
    shopper: { text: "own claim" },
    reviewer: { text: "assigned store" },
    policyAdmin: { text: "403", deny: true },
  },
  {
    operation: "List review queue",
    route: "GET /api/claims?status=…",
    shopper: { text: "403", deny: true },
    reviewer: { text: "assigned store" },
    policyAdmin: { text: "403", deny: true },
  },
  {
    operation: "Review claim",
    route: "POST /api/claims/{id}/review",
    shopper: { text: "403", deny: true },
    reviewer: { text: "assigned store" },
    policyAdmin: { text: "403", deny: true },
  },
  {
    operation: "Read policy",
    route: "GET /api/policy/config",
    shopper: { text: "own effective" },
    reviewer: { text: "403", deny: true },
    policyAdmin: { text: "assigned account" },
  },
  {
    operation: "Write policy",
    route: "POST /api/policy/config",
    shopper: { text: "403", deny: true },
    reviewer: { text: "403", deny: true },
    policyAdmin: { text: "+ expected_revision" },
  },
  {
    operation: "Observability event",
    route: "POST /internal/monitor_event",
    shopper: { text: "403", deny: true },
    reviewer: { text: "403", deny: true },
    policyAdmin: { text: "403", deny: true, note: "system only" },
  },
];

/** The claim state machine, as a strip. */
export type StateNode = {
  name: string;
  kind: "normal" | "current" | "terminal" | "unreachable";
};
export const states: StateNode[] = [
  { name: "submitted", kind: "normal" },
  { name: "evaluating", kind: "normal" },
  { name: "human_review", kind: "current" },
  { name: "approved", kind: "terminal" },
  { name: "declined", kind: "terminal" },
  { name: "auto_approved", kind: "unreachable" },
];

export const errorClasses = [
  {
    name: "Caller fault",
    count: 17,
    recovery: false,
    claimStatus: "unchanged",
    examples:
      "authority_override_denied · forbidden_cross_store · stale_revision · ceiling_exceeded · amount_inflation_denied",
  },
  {
    name: "Dependency",
    count: 4,
    recovery: true,
    claimStatus: "guaranteed unchanged",
    examples:
      "504 dependency_timeout · 502 dependency_malformed_response · 429 dependency_rate_limited · 503 dependency_unavailable",
  },
];

/** The two contract rules most likely to be challenged in review. */
export const designRules = [
  {
    rule: "Retry safety derives from the established side effect, never the failure name.",
    why: "A timeout whose write may have landed is exactly as dangerous as an unavailable service. Both become manual_recovery_required, because an automatic retry could bind a second decision.",
  },
  {
    rule: "Caller fault always wins over a dependency failure.",
    why: "Answering dependency_* to an unauthorized request would confirm the request reached the dependency — a probing oracle and a topology leak. Every locally decidable rejection returns without contacting anything.",
  },
];

/** Command → actual output → whether it is evidence for this candidate. */
export type EvidenceRow = {
  command: string;
  output: string;
  detail?: string;
  status: "verified" | "not-on-candidate";
};
export const evidence: EvidenceRow[] = [
  {
    command: "scripts/demo_claim_loop.py --offline",
    output: "VERIFIED 16 · FAILED 0 · exit 0 · 0.67 s",
    detail:
      "create → evaluate → human_review → self-review 403 → cross-store 403 → assigned-store approval → stale revision 409 → over-ceiling 400 → injected-failure rollback proof",
    status: "verified",
  },
  {
    command: "pytest -q tests/test_es_claim_host_contract.py",
    output: "70 passed in 0.28s",
    detail: "the contract rule engine, driven from the frozen document",
    status: "verified",
  },
  {
    command: "git show 484e302:contracts/es_claim_host_v1.schema.json | sha256sum",
    output: "cd927970f3159bba…41f77ccc4",
    detail:
      "git blob form — the only form that compares equal across machines under core.autocrlf",
    status: "verified",
  },
  {
    command: "scripts/validate_host_contract.py",
    output: "21/21 codes · PASS · report digest 7a4a683b…",
    detail:
      "absent from 83b9a8b — it lives in unmerged PR #183, so it is not cited as evidence for this candidate",
    status: "not-on-candidate",
  },
];

export const baseline = {
  commit: "83b9a8b",
  passed: 2148,
  failed: 10,
  errors: 2,
  note:
    "The failure set was diffed by name against 484e302 and is identical, so neither merge this week introduced a failure in this lane. The count dropped 16 → 10 when PR #181 landed — exactly the −6 the published table had forecast.",
};

/** The three things Friday acceptance requires to be classified separately. */
export type Classification = {
  id: string;
  title: string;
  status: "verified" | "blocked" | "design-only";
  stamp: string;
  detail: string;
};
export const classification: Classification[] = [
  {
    id: "A",
    title: "Host contract — endpoint / role / state / error matrix",
    status: "verified",
    stamp: "verified",
    detail:
      "16/16 offline golden path plus 70 contract tests, both on 83b9a8b.",
  },
  {
    id: "B",
    title: "Native adapter mapping — neither source-verified nor device-verified",
    status: "blocked",
    stamp: "blocked",
    detail:
      "No read access to the private shopper-iOS repository; only Lawrence can grant it. Related: issue #179 — the build anyone can install has no claim entry point, and 4.2 is in Apple review rather than released, so device verification cannot begin.",
  },
  {
    id: "C",
    title: "Four-level rollback / feature flag — specified, not shipped",
    status: "design-only",
    stamp: "design only",
    detail:
      "Client flag → adapter routing → policy revision → contract pin. Described here, not claimed to run.",
  },
];

/** Limitations named before anyone else finds them. */
export const limitations = [
  {
    title: "The server never emits error_code",
    consequence:
      "err() returns {status, message} only. The client mapping merged this week reads error_code, recovery_action and retry_after_seconds — all three are always empty, so the new recovery copy is unreachable in the running app. It degrades safely. The vocabulary now has a consumer and still has no emitter.",
    owner: "#158 · needs an owner call",
  },
  {
    title: "Two claim endpoints have zero consumers",
    consequence:
      "GET /api/claims/{id} and GET /api/claims are never called by the client, so 5 of 8 named states are reachable and approved/declined are unreachable rather than merely unstyled. Not blocked — the endpoints work today.",
    owner: "#159",
  },
  {
    title: "Two event vocabularies, relationship undecided",
    consequence:
      "The frozen monitor_event and the emitter being built disagree on correlation key, timestamp type and event names. A host should treat monitor_event as the export shape it must satisfy, not assume the emitter already produces it.",
    owner: "#161",
  },
  {
    title: "One table in the handoff doc can still go stale silently",
    consequence:
      "The truth guards recompute digests, fixture counts and the error-code vocabulary from the repository — but not the test counts in the evidence table, which stay hand-maintained. Saying where a guard stops is part of the guard.",
    owner: "#158",
  },
];

/* ------------------------------------------------------------------ */
/* Recipe track #86–88 — the honest critical path                      */
/* ------------------------------------------------------------------ */

export const recipeHeadline =
  "The engine is finished and it works. The bottleneck is a human sign-off, and no engineering can move it.";

export const recipeProof = [
  { label: "tests/test_recipe_corpus.py", value: "38 passed" },
  { label: "tests/test_act.py + test_recipes.py", value: "170 passed" },
  { label: "eval/recipe_eval.py", value: "exit 0, byte-stable" },
  { label: "Hard safety / data gates", value: "9 / 9 PASS" },
];

export const recipeParadox = {
  production: [
    { metric: "coverage@1", value: "0.00", floor: "floor 0.80", bad: true },
    { metric: "urgency-respect", value: "not measured", floor: "floor 0.90", bad: true },
    { metric: "clean no-match rate", value: "1.00", floor: "", bad: false },
    { metric: "constraint-violation rate", value: "0.00", floor: "", bad: false },
  ],
  diagnostic: [
    { metric: "coverage@1", value: "1.00", floor: "", bad: false },
    { metric: "urgency-respect", value: "1.00", floor: "", bad: false },
    { metric: "clean no-match rate", value: "1.00", floor: "", bad: false },
    { metric: "hard gates", value: "PASS", floor: "", bad: false },
  ],
  explanation:
    "All 10 corpus rows carry review_state \"draft\"; zero are approved. Production serves approved rows only, so every held-out scene correctly returns NO_MATCH. The system fails closed. Run the same evaluator against the draft rows as a diagnostic and it scores 1.00 — but that is a diagnostic, never a release number, because production deliberately withholds exactly those rows.",
};

export type Gate = {
  id: string;
  title: string;
  detail: string;
  owner: string;
  state: "done" | "blocked" | "waiting" | "separate";
  stamp: string;
};
export const recipeGates: Gate[] = [
  {
    id: "#86",
    title: "Privacy-clean corpus + safety schema",
    detail:
      "10 deterministic records, unique IDs, canonical ingredient whitelist, held-out evaluation scenes kept separate from indexed data.",
    owner: "Lisa + Jinming · data support Mohan",
    state: "done",
    stamp: "code done",
  },
  {
    id: "#87",
    title: "Deterministic retrieval + the RECIPE_BACKEND seam",
    detail:
      "Flag off preserves existing behaviour; a missing optional dependency degrades without a 500. The seam itself is this lane's item.",
    owner: "Lisa + Jinming · ML support Mohan",
    state: "done",
    stamp: "code done",
  },
  {
    id: "#88",
    title: "Evaluation harness + honest quality floors",
    detail:
      "Two runs are byte-identical. The embeddings comparison reports NOT_RUN rather than a misleading number when the backend is unavailable.",
    owner: "Jinming + Lisa · fixture support Mohan",
    state: "done",
    stamp: "code done",
  },
  {
    id: "G1",
    title: "Human safety + license sign-off on the 10 rows — 0 of 10 approved",
    detail:
      "Issue #86 states it plainly: an AI-generated draft is not an approved record. Nothing below can start until this clears, and it is not engineering work.",
    owner: "Lawrence",
    state: "blocked",
    stamp: "blocked",
  },
  {
    id: "G2",
    title: "Freeze row content, then publish RECIPE_APPROVAL_DIGESTS",
    detail:
      "A deployment-side authority deliberately independent of the repository: corpus review fields record provenance but do not authenticate who approved. Exact per-row SHA-256, compared with a constant-time digest check, revocable without touching the corpus.",
    owner: "Deployment / operator",
    state: "waiting",
    stamp: "waits on G1",
  },
  {
    id: "G3",
    title: "Measure the real quality floors on the approved corpus",
    detail:
      "The 0.80 and 0.90 floors are labelled descriptive and are not yet measured — and a floor must never be invented after seeing the results. This is the only remaining engineering task, and it is last in line.",
    owner: "Jinming + Lisa + Mohan",
    state: "waiting",
    stamp: "waits on G2",
  },
  {
    id: "G4",
    title: "Public shopper serving — a separate gate entirely",
    detail:
      "Shopper food guidance is held under GATE: RE-SCOPE. Templates, retrieval and generated candidates all remain private review paths. Unaffected by G1–G3.",
    owner: "Separate calibration gate",
    state: "separate",
    stamp: "out of scope",
  },
];

export const recipeOrdering = {
  warning:
    "Approval binds to exact row bytes. If the text is signed off and then anyone fixes a typo, that row's digest changes and serving breaks silently.",
  order: ["freeze", "approve", "digest", "measure"],
  wrong: "approve → edit → digest",
  conclusion:
    "So the honest answer to \"when can recipes demo?\" is that it is a sign-off latency question, not a build question. Three of the four remaining gates are not ours, and the one that is ours is last in line. Per the Week 7 definition of done, all three issues should be recorded in rc1 with a named owner, exact blocker and next action — otherwise they are a frozen Week 8 limitation.",
  overdue:
    "All three issues are open, still on the Week 6 milestone, and were due July 24 — six days overdue into a Week 8 closeout.",
};
