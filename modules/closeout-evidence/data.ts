// Week 8 is a freeze week: evidence, not features.
// Sources: PR #210 (issue #177), PR #212 (issue #164), and the device rows filed on #164/#226.

export const stats = [
  { label: "Shipped paths that disagree", value: "2" },
  { label: "Ways the manual check lied", value: "3" },
  { label: "Joined offline loop", value: "16 / 0 failed" },
];

/** PR #210. One payload, two code paths already on main, opposite outcomes. */
export const divergence = {
  payload:
    '{ "app_version": "4.2.1", "platform": "ios", "has_exif": true, "blur_score": 0.83, "is_partial": true }',
  paths: [
    {
      path: "src/evidence.py :: normalize_capture_metadata",
      result: "drops the fields, redacted: True, reasons: ['unknown_key']",
      outcome: "claim proceeds",
      bad: false,
    },
    {
      path: "src/host_contract.py :: evaluate_step",
      result: "http_status 400, error_code invalid_capture_field",
      outcome: "claim rejected",
      bad: true,
    },
  ],
  cost:
    "The day an iOS build attaches a quality field, FreshLens silently discards it and keeps working, while any host implementing the frozen contract 400s every claim from that build. A total outage for that app version — and it does not require a quality gate to ever be built. It only requires a client to send the field.",
  proposal:
    "Reuse the pattern the contract already has: a capture_quality_advisory enum of available / unavailable / uncertain / invalid / null, bound to evidence_summary.authority = human_review_only. It routes a new signal into constraints that already exist — it adds no new power.",
};

/** PR #212. Every one of these returns the answer everybody wants: an empty diff. */
export const lies = [
  {
    failure: "The baseline is undated",
    why: "once main moves, the comparison is against a baseline nobody can name — and it still returns clean",
  },
  {
    failure: "comm is only defined on de-duplicated sorted input",
    why: "unsorted or duplicated input does not error; it silently answers wrong",
  },
  {
    failure: "The two runs came from different environments",
    why: "PYTHONUTF8 alone flips six test ids on a zh-CN host — six phantom regressions, or six real ones hidden",
  },
];

export const refusal =
  "So the verdict starts at REFUTED and only becomes CONFIRMED once every precondition is proved, with each refusal naming which one failed. It reads two files and git ancestry, and nothing else: it never writes to the repo, never runs pytest, and needs no network and no credential. Verify it with --self-test; each refusal branch was neutered in turn to prove the tests actually bind.";

export const deviceRows = [
  { claim: "Produce scanner", status: "withheld by design on all 5 build identities", tone: "neutral" },
  { claim: "Receipt to inventory persistence", status: "was REFUTED, now VERIFIED", tone: "good" },
  { claim: "Dedup on identical resubmission", status: "announced as fixed — REFUTED, two identical rows", tone: "bad" },
  { claim: "Receipt OCR pre-fill", status: "INCONCLUSIVE — never once produced a value", tone: "neutral" },
  { claim: "Source linkage of the installed build", status: "INCONCLUSIVE — 4.3.1 (2026080601) is recorded nowhere", tone: "bad" },
];

export const deviceNote =
  "The build that was announced and verified on rented hardware was 4.3.0 (2026080406). The build TestFlight actually installed was 4.3.1 (2026080601) — a different version and a different build, named in no release note. Three artifacts in play on one day, so the hardware verdict and the tester rows are not evidence about the same thing.";

export const limits = [
  "No OOD or model-quality number may be reported while the benchmark contract is BLOCKED.",
  "The scanner is withheld, so no scored item can be produced on device — the claim and human-review journey stays UNREACHABLE there, whatever the source-level tests say.",
  "The capture-quality divergence is a design note, deliberately INCONCLUSIVE. Neither side is a bug; what is missing is an owner for the mapping.",
];
