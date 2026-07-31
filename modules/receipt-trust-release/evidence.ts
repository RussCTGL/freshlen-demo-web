export type EvidenceTone = "success" | "danger" | "warning" | "info";

export type EvidenceScenario = {
  id: "public" | "payload" | "key" | "downgrade" | "hmac";
  step: string;
  shortLabel: string;
  title: string;
  mutation: string | null;
  valid: boolean;
  digestOk: boolean;
  signatureOk: boolean;
  reason: string;
  computedDigest: string;
  detail: string;
};

export const evidenceIdentity = {
  status: "CODE-SHIPPED-NOT-VERIFIED",
  sourceSha: "23a04f3c88fda1cccac93f9163094c6742d017f7",
  sourceShort: "23a04f3",
  observedAt: "2026-07-31T14:47:39Z",
  environment: "Windows 11 · CPython 3.12.10 · offline",
  command:
    "python -m pytest -q tests/test_receipt.py -k \"ed25519 or public_key_registry_error or tampered_payload\"",
  exitCode: 0,
  testResult: "13 passed · 270 deselected · 1 warning · 0.68s",
  candidate:
    "PR #199 exact head; stacked on #197 and #194. The stack is not merged into one accepted release candidate.",
} as const;

export const observedReceipt = {
  receiptId: "rcpt_9f1d05f8d7871d2f",
  algorithm: "Ed25519",
  keyId: "returns-week7-demo",
  keyVersion: 1,
  keyCreatedAt: "2026-07-31T15:30:00Z",
  digest: "9f1d05f8d7871d2f9575b88257da590b2857807977292af8aefcd71c73710daf",
  signaturePrefix: "E9vI1tvr7_szAjCX…",
  insecureDevKey: false,
} as const;

export const publicVerificationRecord = {
  alg: "Ed25519",
  key_id: "returns-week7-demo",
  key_version: 1,
  key_created_at: "2026-07-31T15:30:00Z",
  status: "active",
  public_key_b64url: "SPfAlYl059zswB7ZNvHCqgUvG2Pf_4ifPVO2H1-NCd8",
} as const;

const canonicalDigest = observedReceipt.digest;

export const scenarios: EvidenceScenario[] = [
  {
    id: "public",
    step: "01",
    shortLabel: "Create + verify",
    title: "Create one Ed25519 receipt and verify it with public material",
    mutation: null,
    valid: true,
    digestOk: true,
    signatureOk: true,
    reason: "ok",
    computedDigest: canonicalDigest,
    detail:
      "Observed from src.receipt.create_receipt and verify_receipt at the exact source SHA. The private key existed only in memory; verification received the public registry record.",
  },
  {
    id: "payload",
    step: "02",
    shortLabel: "Payload tamper",
    title: "Mutate one signed payload field and show fail-closed rejection",
    mutation: "payload.store_id: STORE-DEMO → STORE-TAMPERED",
    valid: false,
    digestOk: false,
    signatureOk: false,
    reason: "digest_mismatch",
    computedDigest: "6b8523c9c31fbb4192a4ed3d7565dd04c18ef2d9091e8c24f5258036f7e4172d",
    detail:
      "The mutation changes the canonical payload bytes. The recomputed digest no longer matches the signed receipt, so verification rejects it before trusting the signature.",
  },
  {
    id: "key",
    step: "03",
    shortLabel: "Key-ID tamper",
    title: "Mutate the signed key identity and show rejection",
    mutation: "top-level key_id: returns-week7-demo → unknown-key",
    valid: false,
    digestOk: true,
    signatureOk: false,
    reason: "key_metadata_mismatch",
    computedDigest: canonicalDigest,
    detail:
      "The top-level key identity no longer matches the key metadata inside the signed payload. Verification fails without selecting a different registry key.",
  },
  {
    id: "downgrade",
    step: "04",
    shortLabel: "No downgrade",
    title: "Relabel Ed25519 as HMAC and prove there is no fallback",
    mutation: "algorithm: Ed25519 → HMAC-SHA256",
    valid: false,
    digestOk: true,
    signatureOk: false,
    reason: "algorithm_metadata_mismatch",
    computedDigest: canonicalDigest,
    detail:
      "Even with an HMAC secret available to the probe, Ed25519 metadata on an HMAC-labelled receipt is rejected. The verifier never silently downgrades.",
  },
  {
    id: "hmac",
    step: "05",
    shortLabel: "HMAC fixture",
    title: "Verify the explicit historical HMAC compatibility path",
    mutation: null,
    valid: true,
    digestOk: true,
    signatureOk: true,
    reason: "ok",
    computedDigest: "ba984f1369251349d50adb4ab5d079992963553e77ca49b032fa73a3aa94a0d5",
    detail:
      "A separately created HMAC-SHA256 receipt verifies with its in-memory symmetric secret. This is explicit compatibility, not fallback from Ed25519.",
  },
];

export const privacyEvidence = [
  { label: "Private key emitted", value: "false" },
  { label: "Signing secret emitted", value: "false" },
  { label: "Environment values emitted", value: "false" },
  { label: "Public endpoint schema test", value: "passed" },
] as const;

export type DeviceEvidenceRow = {
  owner: string;
  rowStatus: "COMPLETE" | "INCOMPLETE" | "MISSING" | "HISTORICAL";
  participation: string;
  build: string;
  sourceLinkage: string;
  result: string;
};

export const deviceSynthesis = {
  status: "BLOCKED",
  observedAt: "2026-07-31",
  assigned: 8,
  directRows: 7,
  completeRows: 6,
  currentBuildCompleteRows: 4,
  incompleteRows: 1,
  missingRows: 1,
  currentBuild: "Xpired 4.2.0 (2026072807)",
} as const;

export const deviceEvidenceRows: DeviceEvidenceRow[] = [
  {
    owner: "Lezhi",
    rowStatus: "COMPLETE",
    participation: "DEVICE_AVAILABLE",
    build: "4.2.0 / 2026072807",
    sourceLinkage: "INCONCLUSIVE",
    result: "Scanner unavailable after Wi-Fi and LTE retry; claim journey unreachable.",
  },
  {
    owner: "Lisa",
    rowStatus: "COMPLETE",
    participation: "NO_DEVICE / N/A",
    build: "Backend PR #191 / 68250fa",
    sourceLinkage: "MERGED TO MAIN",
    result: "Backend-only registry accessor has no native capture surface; device test is not applicable.",
  },
  {
    owner: "Jinming",
    rowStatus: "COMPLETE",
    participation: "DEVICE_AVAILABLE",
    build: "4.2.0 / 2026072807",
    sourceLinkage: "NONE",
    result: "Inventory/Profile reachable; camera blocked; no claim entry point.",
  },
  {
    owner: "Ziyun",
    rowStatus: "COMPLETE",
    participation: "DEVICE_AVAILABLE",
    build: "4.2.0 / 2026072807",
    sourceLinkage: "INCONCLUSIVE",
    result: "Fail-closed scanner-unavailable state reproduced; capture blocked.",
  },
  {
    owner: "Tony",
    rowStatus: "MISSING",
    participation: "No direct row",
    build: "Not reported",
    sourceLinkage: "Not reported",
    result: "Required privacy-safe device record has not been posted.",
  },
  {
    owner: "Bill",
    rowStatus: "COMPLETE",
    participation: "DEVICE_AVAILABLE",
    build: "4.2.0 / 2026072807",
    sourceLinkage: "INCONCLUSIVE",
    result: "Cross-build scanner blocker reproduced on 4.1.0 and 4.2.0.",
  },
  {
    owner: "Yizhou",
    rowStatus: "HISTORICAL",
    participation: "DEVICE_AVAILABLE",
    build: "3.4.5 / 2026072201",
    sourceLinkage: "INCONCLUSIVE",
    result: "Background/resume observed; claim/return was not present; current retest needed.",
  },
  {
    owner: "Mohan",
    rowStatus: "INCOMPLETE",
    participation: "DEVICE_AVAILABLE",
    build: "4.2.0 / build placeholder",
    sourceLinkage: "INCONCLUSIVE",
    result: "Scanner blocked, but exact build, timestamp, and retry fields remain placeholders.",
  },
];
