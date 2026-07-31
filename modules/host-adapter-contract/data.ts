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

/**
 * The first screen has to answer two questions a supervisor actually asks:
 * what did you build, and what is stuck. Everything below this pair is the
 * evidence for it.
 */
export const delivered = [
  {
    what: "Froze the host adapter contract, v1",
    detail: "8 operations × 4 roles, the claim state machine, the money rules and a closed 21-code error set — the seam a host application implements to talk to FreshLens.",
    proof: "70 contract tests · 16/16 offline loop",
    ref: "#158",
  },
  {
    what: "Added the dependency-failure class — 4 new codes",
    detail: "429, 502, 503 and 504 now land on named states that guarantee the claim is unchanged and carry a recovery_action, so a host can tell 'we refused you' from 'we could not reach something'.",
    proof: "PR #195, green",
    ref: "#195",
  },
  {
    what: "Proved the rollback is atomic, not described",
    detail: "A failure injected mid-write leaves both the policy revision and the monthly cap untouched — the issue's own acceptance check, run rather than asserted.",
    proof: "injected-failure run, VERIFIED",
    ref: "#158",
  },
  {
    what: "Wrote the handoff: validator + the four lane artifacts",
    detail: "A standalone contract validator that is byte-stable and non-vacuous, plus the integration order, rollback matrix and monitoring an incoming owner needs.",
    proof: "PR #183 + PR #184, green",
    ref: "#183 · #184",
  },
  {
    what: "Reviewed nine teammate pull requests",
    detail: "Including the red-team suites on #160, where a demonstrated vacuous assertion was returned with a reproduction, and the week-7 device record on #164.",
    proof: "9 cross-reviews · 1 device record",
    ref: "#160 · #164",
  },
];

export type Ask = {
  what: string;
  owner: string;
  why: string;
  severity: "blocking" | "open";
};
export const asks: Ask[] = [
  {
    what: "Approve three green pull requests — #183, #184, #195",
    owner: "Lawrence + reviewers",
    why: "All three pass CI and have sat unapproved. #184 carries the handoff document, so nothing downstream of it can start.",
    severity: "blocking",
  },
  {
    what: "Read access to the private shopper-iOS repository",
    owner: "Lawrence only",
    why: "No tester on the team can map an installed build to a commit. Every device row on this program therefore stays version-and-build-only, mine included.",
    severity: "blocking",
  },
  {
    what: "A sign-off pass on the recipe corpus — any subset, not all 40",
    owner: "Lawrence",
    why: "Zero of the ten drafted records are approved, which is why production coverage reads 0.00. Signing any subset lifts it off zero and lets the measurement gate start.",
    severity: "blocking",
  },
  {
    what: "An owner decision: should the server emit error_code?",
    owner: "needs an owner call",
    why: "The client mapping merged this week reads error_code, recovery_action and retry_after_seconds. The server sends none of them, so the new recovery copy is unreachable in the running app. It degrades safely.",
    severity: "open",
  },
];

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

/**
 * The whole closed set, one entry per code, so the page can render 21 objects
 * instead of printing the number 21. Grouped exactly as the frozen
 * `http_status_for_error` mapping in contracts/es_claim_host_v1.schema.json.
 */
export type ErrorCode = { code: string; status: number; cls: "caller" | "dependency" };
export const errorCodes: ErrorCode[] = [
  { code: "unauthenticated", status: 401, cls: "caller" },
  { code: "forbidden_role", status: 403, cls: "caller" },
  { code: "forbidden_cross_store", status: 403, cls: "caller" },
  { code: "forbidden_cross_account", status: 403, cls: "caller" },
  { code: "authority_override_denied", status: 403, cls: "caller" },
  { code: "idempotency_conflict", status: 409, cls: "caller" },
  { code: "stale_revision", status: 409, cls: "caller" },
  { code: "invalid_transition", status: 409, cls: "caller" },
  { code: "invalid_money_format", status: 400, cls: "caller" },
  { code: "unsupported_contract_version", status: 400, cls: "caller" },
  { code: "invalid_capture_field", status: 400, cls: "caller" },
  { code: "ceiling_exceeded", status: 400, cls: "caller" },
  { code: "amount_inflation_denied", status: 400, cls: "caller" },
  { code: "invalid_reason_code", status: 400, cls: "caller" },
  { code: "unsafe_observability_payload", status: 400, cls: "caller" },
  { code: "missing_required_field", status: 400, cls: "caller" },
  { code: "invalid_enum_value", status: 400, cls: "caller" },
  { code: "dependency_rate_limited", status: 429, cls: "dependency" },
  { code: "dependency_malformed_response", status: 502, cls: "dependency" },
  { code: "dependency_unavailable", status: 503, cls: "dependency" },
  { code: "dependency_timeout", status: 504, cls: "dependency" },
];

/** Corpus progress for the #86-88 meter. Numbers from Mohan's review on PR #132. */
export const corpus = { floor: 40, authored: 10, reviewed: 0 };

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
  status: "verified" | "blocked" | "partial";
  stamp: string;
  /** The 2-3 numbers that decide the row, shown without expanding the detail. */
  facts: { k: string; v: string }[];
  detail: string;
};
export const classification: Classification[] = [
  {
    id: "A",
    title: "Host contract — endpoint / role / state / error matrix",
    status: "verified",
    stamp: "verified",
    facts: [
      { k: "golden path", v: "16 / 16" },
      { k: "contract tests", v: "70 passed" },
      { k: "error set", v: "21 closed" },
    ],
    detail:
      "16/16 offline golden path plus 70 contract tests, both on 83b9a8b.",
  },
  {
    id: "B",
    title: "Native adapter mapping — device side moved, source side still blocked",
    status: "blocked",
    stamp: "source blocked",
    facts: [
      { k: "testers, same build", v: "5 of 5 blocked" },
      { k: "claim path reachable", v: "0" },
      { k: "source linkage", v: "NONE" },
    ],
    detail:
      "4.2 is released and the device matrix on #164 is no longer ambiguous. Five testers on the identical build — 4.2.0 / 2026072807 — independently reach the same wall: the on-device scanner never installs, capture stays paused, and no claim, receipt or reviewer journey is reachable. The one earlier record that looked like a counter-example is a historical row on 3.4.5 / 2026072201, not this build. The blocker also reproduces on 4.1.0 / 2026072806, so it is a standing model-distribution gap rather than a 4.2 regression. Two things follow for this lane. The client half of the adapter cannot be exercised on any shipped build, and source linkage is INCONCLUSIVE or NONE on every row filed — no tester can map an installed build to a commit, because nobody outside the native team has read access to that repository. Only Lawrence can grant it.",
  },
  {
    id: "C",
    title: "Four-level rollback — required by the issue, and the load-bearing level is proven",
    status: "partial",
    stamp: "partly proven",
    facts: [
      { k: "levels proven", v: "2 of 4" },
      { k: "policy rollback", v: "VERIFIED" },
      { k: "client flag", v: "native repo" },
    ],
    detail:
      "Client flag → adapter routing → policy revision → contract pin. The policy level is VERIFIED, not described: the offline run injects a failure mid-write and both the revision and the cap stay unchanged, which is the issue's own acceptance check that a failed write rolls back policy and audit atomically. The contract pin is exercised by the unsupported_contract_version fixture. Stopping adapter routing is an operational step with no code. The client feature flag lives in the native repository, so it inherits row B's block.",
  },
];

/** Limitations inside lane #158, named before anyone else finds them. */
export const limitations = [
  {
    title: "The server never emits error_code",
    consequence:
      "err() returns {status, message} only. The client mapping merged this week reads error_code, recovery_action and retry_after_seconds — all three are always empty, so the new recovery copy is unreachable in the running app. It degrades safely. The vocabulary now has a consumer and still has no emitter.",
    owner: "#158 · needs an owner call",
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

/**
 * Read at the demo: this section lost the room because it opened on metrics and
 * gate IDs without ever saying what the feature is. It now opens with the
 * feature, then one picture of where it stands, and only then the numbers.
 */
export const recipeWhatItIs = [
  { step: "Produce is nearing expiry", note: "already known from the inventory" },
  { step: "Suggest a recipe that uses it", note: "the part #86–88 builds" },
  { step: "It gets eaten instead of binned", note: "the outcome we are after" },
];

/** The five stages, in order, as one rail. This is the section's explainer. */
export type Stage = {
  n: number;
  label: string;
  status: string;
  owner: string;
  state: "done" | "active" | "waiting" | "separate";
};
export const recipeStages: Stage[] = [
  { n: 1, label: "Build the machinery", status: "done", owner: "us", state: "done" },
  { n: 2, label: "Write the recipes", status: "10 of 40", owner: "us", state: "active" },
  { n: 3, label: "Sign off on safety", status: "0 signed", owner: "Lawrence", state: "waiting" },
  { n: 4, label: "Measure quality", status: "not started", owner: "us", state: "waiting" },
  { n: 5, label: "Show to shoppers", status: "separate gate", owner: "—", state: "separate" },
];

export const recipeHeadline =
  "The machinery is finished and proven. The corpus is not.";

/** The paradox, stated as a conclusion rather than left for the reader to derive. */
export const paradoxVerdict = {
  title: "Why the score reads 0.00 — the same test, run twice",
  lede: "Nothing is broken. The production run only counts recipes a human has signed off, and none have been signed off yet. Run the identical evaluator over the drafts and it scores full marks.",
  series: [
    { key: "approved", label: "Approved rows only — what production counts" },
    { key: "draft", label: "Draft rows — same evaluator" },
  ],
  rows: [
    {
      metric: "coverage@1",
      floor: 0.8,
      approved: 0,
      approvedLabel: "0.00",
      draft: 1,
      draftLabel: "1.00",
    },
    {
      metric: "urgency-respect",
      floor: 0.9,
      approved: null,
      approvedLabel: "not measured",
      draft: 1,
      draftLabel: "1.00",
    },
  ],
  clean: "Clean no-match rate 1.00 and constraint-violation rate 0.00 on both runs — the safety behaviour does not depend on approval.",
};

/** The long form, kept for the disclosure under the headline. */
export const recipeHeadlineWhy =
  "Ten records against a Friday floor of forty reviewed ones, and none of the ten is reviewed yet. Authoring the rest is our work and is not blocked by anyone; the sign-off pass that follows is not ours to do.";

export const recipeProof = [
  { label: "tests/test_recipe_corpus.py", value: "38 passed" },
  { label: "tests/test_act.py + test_recipes.py", value: "170 passed" },
  { label: "eval/recipe_eval.py", value: "exit 0, byte-stable" },
  { label: "Hard safety / data gates", value: "9 / 9 PASS" },
  { label: "Corpus records", value: "10 of 40" },
  { label: "Records reviewed", value: "0 of 10" },
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
    "All 10 corpus rows carry review_state \"draft\"; zero are approved. Production serves approved rows only, so every held-out scene correctly returns NO_MATCH. The system fails closed, which is why the zero is correct behaviour rather than a defect. Run the same evaluator against the draft rows as a diagnostic and it scores 1.00. Read that number carefully: it says the retrieval engine resolves the 16 held-out scenes against the rows that exist. It does not say the corpus is large enough — 1.00 over ten records is not the same claim as 1.00 over forty, and the release floor is written against reviewed records, not draft ones.",
};

export type Gate = {
  id: string;
  title: string;
  detail: string;
  owner: string;
  /** One plain sentence for a reader who does not know the vocabulary. */
  plain?: string;
  state: "done" | "blocked" | "waiting";
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
    title: "Write the remaining recipes",
    plain: "Thirty more records against a floor of forty. Authoring work, not engineering.",
    detail:
      "Recorded numerically by Mohan on PR #132 on 2026-07-21: ten records, all draft, against the Friday target of at least forty reviewed records, so roughly thirty more records plus a sign-off pass remain. This is the one remaining gate that is ours and it is blocked by nobody — it is authoring work against a frozen schema, and the validators that will check it already pass. Naming it first because the diagnostic 1.00 above makes it easy to miss.",
    owner: "Lisa + Jinming, Mohan supporting",
    state: "waiting",
    stamp: "ours, not blocked",
  },
  {
    id: "G2",
    title: "One person signs off on safety and licensing",
    plain: "An AI-written draft is not an approved record. Signing any subset unblocks the measurement gate.",
    detail:
      "Issue #86 states it plainly: an AI-generated draft is not an approved record, and approval requires reviewed_by set to the named approver. Nothing below can start until this clears, and it is not engineering work. It does not have to wait for all forty either — signing any subset lifts coverage off zero and lets the measurement gate begin.",
    owner: "Lawrence",
    state: "waiting",
    stamp: "waits on G1",
  },
  {
    id: "G3",
    title: "Lock the wording, then publish the fingerprints",
    plain: "A deployment-side authority, revocable without touching the repository.",
    detail:
      "A deployment-side authority deliberately independent of the repository: corpus review fields record provenance but do not authenticate who approved. Exact per-row SHA-256, compared with a constant-time digest check, revocable without touching the corpus.",
    owner: "Deployment / operator",
    state: "waiting",
    stamp: "waits on G2",
  },
  {
    id: "G4",
    title: "Measure quality on the signed set",
    plain: "The 0.80 and 0.90 floors stay descriptive until this runs — and a floor may never be invented after seeing results.",
    detail:
      "The 0.80 and 0.90 floors are labelled descriptive and are not yet measured — and a floor must never be invented after seeing the results. Last in line, and it is measurement rather than construction.",
    owner: "Jinming + Lisa + Mohan",
    state: "waiting",
    stamp: "waits on G3",
  },
];

export const recipeOrdering = {
  warning:
    "Sign first, then fingerprint. Edit a single word after signing and the fingerprint stops matching — serving stops, and it stops quietly.",
  order: ["freeze", "approve", "digest", "measure"],
  wrong: "approve → edit → digest",
  conclusion:
    "So the honest answer to \"when can recipes demo?\" has two halves, and it would be easy to give only the flattering one. The machinery is finished and proven, and that part is real. But the corpus is at a quarter of its floor, and closing that gap is authoring work this team owns and nobody else is holding. Only after that does it become a sign-off question. Per the Week 7 definition of done, all three issues should be recorded in rc1 with a named owner, exact blocker and next action — otherwise they are a frozen Week 8 limitation.",
  overdue:
    "All three issues are open, still on the Week 6 milestone, and were due July 24 — six days overdue into a Week 8 closeout. Primary owners are Lisa and Jinming, with Mohan supporting.",
};
