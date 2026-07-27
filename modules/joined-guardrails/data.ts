// Private data for the joined-guardrails module (#112).
// A walkable FreshLens flow: each page is a real screen in the claim journey, and each page
// carries "test this page" buttons that fire the guardrail living there. Every result is what
// the named test in tests/test_claim_e2e.py actually asserts (43 passed at baseline 4fefc4a).

export type Tone = "success" | "warning" | "danger" | "review";
export type Persona = "Shopper" | "Reviewer";

export interface GuardTest {
  id: string;
  /** the 🧪 button label */
  label: string;
  result: {
    pill: string;
    tone: Tone;
    icon: string;
    title: string;
    body: string;
  };
  /** why it's safe, in journey terms */
  why: string;
  test: string;
  proof: string;
  buildStep: string;
  /** whose seam this test rides on — the teammates whose work it depends on */
  dependsOn?: { who: string; issue: number }[];
}

export interface Page {
  id: string;
  persona: Persona;
  eyebrow: string;
  step: string;
  title: string;
  blurb: string;
  /** the normal on-screen content */
  body: string;
  /** the normal forward button */
  primary: string;
  /** page status pill (shown top-right), optional */
  statusPill?: { label: string; tone: Tone };
  /** whose work this page's screens & seams depend on */
  credits: { who: string; issue: number; what: string }[];
  tests: GuardTest[];
}

export const pages: Page[] = [
  {
    id: "identity",
    persona: "Shopper",
    eyebrow: "SHOPPER RETURN FLOW",
    step: "STEP 1",
    title: "Start with the item and receipt",
    blurb:
      "This browser flow uses a file or camera picker. Evidence strength is labeled honestly; automatic payouts stay disabled.",
    body: "Enter your shopper token to begin a claim, then add the produce photo.",
    primary: "Continue to receipt",
    statusPill: { label: "Ready", tone: "success" },
    credits: [
      { who: "Ziyun", issue: 106, what: "the shopper claim wizard this screen mirrors" },
    ],
    tests: [
      {
        id: "no-token",
        label: "Submit with no token",
        result: {
          pill: "UNAUTHORIZED",
          tone: "danger",
          icon: "🔒",
          title: "Please sign in to file a claim",
          body: "No token, no claim — nothing was created while you were signed out.",
        },
        why: "A signed-out submit is rejected up front; there's no orphaned claim to clean up.",
        test: "test_missing_token_is_401",
        proof: "_create(..., token=None).status_code == 401",
        buildStep: "Build plan · Step 5 (auth)",
      },
      {
        id: "cross-account",
        label: "Open another shopper's claim",
        result: {
          pill: "NO ACCESS",
          tone: "danger",
          icon: "🚫",
          title: "This claim isn't yours",
          body: "Claim #A-1029 belongs to another shopper. You don't have access to open it.",
        },
        why: "Your claim is private — even a real, signed-in stranger can't read it. The wall is per-account.",
        test: "test_cross_account_detail_is_403",
        proof: 'client.get(f"/api/claims/{id}", headers=_auth(OTHER)).status_code == 403',
        buildStep: "Build plan · Step 5 (auth)",
      },
    ],
  },
  {
    id: "evidence",
    persona: "Shopper",
    eyebrow: "SHOPPER RETURN FLOW",
    step: "STEP 2",
    title: "Receipt photo and details",
    blurb: "Attach the receipt and confirm the item, store, price, and date.",
    body: "Produce + receipt attached. Item: bell pepper · $6.00 · Grocery Depot · 2026-07-27.",
    primary: "Continue to submit",
    credits: [
      { who: "Lisa", issue: 108, what: "identity explanations — the item-vs-receipt mismatch" },
      { who: "Lezhi", issue: 109, what: "the receipt-photo seam + capture-metadata redaction" },
    ],
    tests: [
      {
        id: "bad-evidence",
        label: "Use a photo that doesn't match the receipt",
        result: {
          pill: "HUMAN REVIEW",
          tone: "review",
          icon: "👀",
          title: "We're taking a closer look",
          body: "The photo shows an orange but the receipt line is a bell pepper. A specialist checks this — it is never auto-approved.",
        },
        why: "Shaky evidence always routes to a person — a mismatch, a classifier that's down, or high fraud risk can never be auto-approved.",
        test: "test_bad_evidence_fails_closed_to_human_review",
        proof: 'outcome == "human_review" != "auto_approve"  and  reason == "gray_zone_escalate"',
        buildStep: "Build plan · Step 6 (evidence gate)",
        dependsOn: [
          { who: "Lisa", issue: 108 },
          { who: "Lezhi", issue: 109 },
        ],
      },
      {
        id: "privacy",
        label: "Sneak GPS + email into the photo metadata",
        result: {
          pill: "REDACTED",
          tone: "success",
          icon: "🛡️",
          title: "Private data dropped",
          body: "GPS, device-id, email and SSN are stripped and never appear in the claim, audit, or logs. Only app_version and platform survive.",
        },
        why: "Capture metadata is normalized end to end; even the redaction reason stays generic and never echoes the value it dropped.",
        test: "test_capture_metadata_normalization_keeps_allowed_and_never_leaks_pii",
        proof: "no PII marker appears in any response, the audit, or the logs; status.redacted == True",
        buildStep: "Build plan · Step 15 (privacy)",
        dependsOn: [{ who: "Lezhi", issue: 109 }],
      },
    ],
  },
  {
    id: "submit",
    persona: "Shopper",
    eyebrow: "SHOPPER RETURN FLOW",
    step: "STEP 3",
    title: "Submit and evaluate",
    blurb:
      "FreshLens creates one claim, then evaluates that same claim. If evaluation fails, retry uses the saved claim reference.",
    body: "Everything's ready. Press Submit to file and evaluate your claim.",
    primary: "Submit claim",
    credits: [
      { who: "Ziyun", issue: 106, what: "the submit-and-evaluate screen" },
      { who: "Mohan", issue: 110, what: "the deterministic fixtures & demo seeds this flow runs on" },
    ],
    tests: [
      {
        id: "double-tap",
        label: "Double-tap Submit",
        result: {
          pill: "ONE CLAIM",
          tone: "success",
          icon: "✅",
          title: "Filed once — even though you tapped twice",
          body: "We caught the double-tap and kept it to a single claim. No duplicate in the queue, no double payout.",
        },
        why: "The same double-tap I saw on the real iOS build. The create is idempotent on the request key — one tap or three, exactly one claim.",
        test: "test_lost_create_retry_returns_one_claim_and_409s_on_divergent_reuse",
        proof: "retry claim_id == first  and  len(claims_for_account) == 1  and  divergent key → 409",
        buildStep: "Build plan · Step 10 (idempotency)",
      },
      {
        id: "model-dies",
        label: "Make the model time out mid-check",
        result: {
          pill: "RETRYABLE",
          tone: "warning",
          icon: "↻",
          title: "That hiccupped — please try again",
          body: "The freshness check failed midway, but your claim is safe and untouched. Tap retry and it picks up cleanly.",
        },
        why: "A crash never strands a half-finished claim: it rolls back with no partial record, the retry reaches one decision, and a replay never double-charges or double-logs.",
        test: "test_dependency_exception_makes_claim_retryable_and_resolves_exactly_once",
        proof: 'after crash: status == "submitted", audit == [];  replay: same provenance_receipt_id',
        buildStep: "Build plan · Step 7 (retry)",
      },
    ],
  },
  {
    id: "result",
    persona: "Shopper",
    eyebrow: "SHOPPER RETURN FLOW",
    step: "STEP 4",
    title: "Result",
    blurb: "The claim was created once and evaluated. This trail is advisory, not a food-safety decision.",
    body: "A team member will review this claim.\nClaim reference: clm_f31abffd0535bd8d\nProvenance receipt: rcpt_a071ef83f180bfb8\nThis trail is tamper-evident and advisory; it is not a food-safety decision.",
    primary: "Continue to reviewer →",
    statusPill: { label: "human_review", tone: "review" },
    credits: [
      { who: "Lisa & me", issue: 120, what: "the provenance anchor behind the receipt shown here" },
      { who: "the whole team", issue: 129, what: "the frozen host contract this joined test is driven by" },
    ],
    tests: [
      {
        id: "no-auto-approve",
        label: "Could a big-dollar claim auto-pay?",
        result: {
          pill: "RE-SCOPE",
          tone: "review",
          icon: "🔒",
          title: "No — never auto-approved",
          body: "Even a $500 claim lands in human review. There is no amount that flips to an automatic payout, offline.",
        },
        why: "The calibrated verdict is always RE-SCOPE offline and the auto-approve sentinel is unreachable, so a person decides every claim.",
        test: "test_no_amount_ever_auto_approves_offline",
        proof: 'for every price tested: outcome == "human_review" != "auto_approve"',
        buildStep: "RE-SCOPE invariant",
      },
    ],
  },
  {
    id: "reviewer",
    persona: "Reviewer",
    eyebrow: "INTERNAL · REVIEW QUEUE",
    step: "STEP 5",
    title: "Resolve the claim",
    blurb: "Internal / account-scoped. Human-review-only remains the expected Week 6 outcome.",
    body: "Claim #C-7781 is in your queue: bell pepper, shopper requested $50.00. Approve within the caps, or decline.",
    primary: "Approve claim",
    statusPill: { label: "In queue", tone: "warning" },
    credits: [
      { who: "Jinming", issue: 105, what: "the review queue + guarded policy config (approve, caps, policy race)" },
      { who: "Ziyun", issue: 107, what: "the internal review-queue UI" },
      { who: "Bill", issue: 111, what: "the account-scoped claims report" },
    ],
    tests: [
      {
        id: "two-reviewers",
        label: "Two reviewers approve at once",
        result: {
          pill: "PAID ONCE",
          tone: "success",
          icon: "✓",
          title: "Approved — and charged only once",
          body: "One approval won; the other got a safe 'already resolved' notice. The budget was charged a single time.",
        },
        why: "A busy queue can't double-spend the cap just because two reviewers clicked together — one wins, one is a safe no-op.",
        test: "test_concurrency_review_review_pays_out_exactly_once",
        proof: 'sorted(status_codes) == [200, 409]  and  final status == "approved"',
        buildStep: "Build plan · Step 14 (concurrency)",
        dependsOn: [
          { who: "Jinming", issue: 105 },
          { who: "Ziyun", issue: 107 },
        ],
      },
      {
        id: "cap-clamp",
        label: "Approve $50 — over the cap",
        result: {
          pill: "CLAMPED · $10",
          tone: "warning",
          icon: "💰",
          title: "Approved — but clamped to $10.00",
          body: "The shopper requested $50 and the reviewer typed $99, but the immutable per-claim cap holds the payout to $10.00. A spoofed reviewer id is ignored.",
        },
        why: "A reviewer can never inflate a payout past the per-claim ceiling, and their identity is server-derived — not a form field.",
        test: "test_reviewer_approval_amount_is_clamped_to_the_per_claim_ceiling",
        proof: 'amount_cents == 1000 (¢ ceiling)  and  decided_by == "reviewer:r1" (spoof ignored)',
        buildStep: "Build plan · Step 8 (caps)",
        dependsOn: [{ who: "Jinming", issue: 105 }],
      },
      {
        id: "decline-zero",
        label: "Decline the claim",
        result: {
          pill: "PAID · $0",
          tone: "review",
          icon: "⛔",
          title: "Declined — nothing paid",
          body: "A decline spends zero and marks the claim declined. Replaying the decline is a safe 'already resolved.'",
        },
        why: "A decline is never payable, and it can't be re-processed by replaying the request.",
        test: "test_review_decline_pays_zero_and_replays_safely",
        proof: 'amount_cents == 0, status == "declined";  replay → 409',
        buildStep: "Build plan · Step 8 (caps)",
        dependsOn: [{ who: "Jinming", issue: 105 }],
      },
      {
        id: "policy-race",
        label: "Two managers change the cap at once",
        result: {
          pill: "ONE UPDATE",
          tone: "success",
          icon: "⚙️",
          title: "Saved once — the other was asked to refresh",
          body: "Two managers edited the per-claim cap at the same instant. One save committed; the other got 'someone just changed this, refresh,' and the cap advanced by exactly one revision — no lost or double-applied change.",
        },
        why: "Policy edits use optimistic concurrency on a revision number, so a stale edit can never silently overwrite a newer one.",
        test: "test_concurrency_policy_policy_advances_the_revision_once",
        proof: "sorted(status_codes) == [200, 409]  and  new_revision == rev + 1",
        buildStep: "Build plan · Step 9 (policy)",
        dependsOn: [{ who: "Jinming", issue: 105 }],
      },
    ],
  },
];

// Guardrails that aren't shopper-facing moments — mentioned honestly, not clickable.
export const alsoTested =
  "+ 30 more offline tests, including a hard network guard (any outbound call fails the suite — Step 13), the legacy + canonical report export (Step 11), the shopper & business HTML surfaces (Step 12), and the frozen #129 host contract.";

// My #119 physical-device finding — the SAME double-tap, tested on the real iOS beta.
// Text-only / redacted: generic model, iOS & build only, staged data, no screenshots or ids.
export const deviceFinding = {
  issue: 119,
  resultPill: "PASS · NOT_PRESENT",
  device: "iPhone 15 Pro · iOS 17.6.1 · Xpired for shoppers 3.4.5 (2026072201)",
  boundary:
    "The iOS beta is a shopper freshness → inventory → recipe app. It has no claim, receipt, refund, or return flow anywhere — so the return-flow scenario is NOT_PRESENT (independently confirmed by Jinming's #119 result).",
  tested:
    'On the one commit action that does exist, "Save to Inventory," a fast double-tap saved only ONE item. After the first tap the button enters a loading state and stops responding — so a shopper cannot accidentally create a duplicate.',
  tie: "Same guardrail as Step 3 above: the web claim loop's idempotency is proven in code, and the real device's closest commit action behaves safely too.",
  result:
    "PASS on the commit action that exists · NOT_PRESENT for claim submission. Text-only / redacted evidence — generic model, iOS & build only; staged data; no screenshots, device ids, or private invite.",
};

export const toneText: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  review: "text-brand",
};
export const toneBorder: Record<Tone, string> = {
  success: "border-success",
  warning: "border-warning",
  danger: "border-danger",
  review: "border-brand",
};
export const toneChipBg: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  review: "bg-brand",
};
