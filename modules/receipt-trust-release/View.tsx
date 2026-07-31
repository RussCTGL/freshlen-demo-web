"use client";

import { useMemo, useState } from "react";

type Tone = "success" | "danger" | "warning" | "info";
type ScenarioId = "public" | "amount" | "key" | "downgrade" | "hmac";

type Scenario = {
  id: ScenarioId;
  step: string;
  shortLabel: string;
  title: string;
  action: string;
  status: "VERIFIED" | "REJECTED";
  reason: string;
  tone: Tone;
  detail: string;
  changedField?: string;
};

const scenarios: Scenario[] = [
  {
    id: "public",
    step: "01",
    shortLabel: "Public verify",
    title: "Verify an Ed25519 receipt with public material",
    action: "Run public verification",
    status: "VERIFIED",
    reason: "ok",
    tone: "success",
    detail:
      "The verifier selects the signed key ID and version, reconstructs the canonical payload, and verifies the signature without access to private signing material.",
  },
  {
    id: "amount",
    step: "02",
    shortLabel: "Amount tamper",
    title: "Mutate a field that the signature binds",
    action: "Change approved amount",
    status: "REJECTED",
    reason: "signature_invalid",
    tone: "danger",
    detail:
      "Changing approved_amount_cents from 499 to 899 changes the canonical bytes. Verification fails closed instead of accepting the edited receipt.",
    changedField: "approved_amount_cents: 499 → 899",
  },
  {
    id: "key",
    step: "03",
    shortLabel: "Key-ID tamper",
    title: "Point the receipt at a different key",
    action: "Change signed key ID",
    status: "REJECTED",
    reason: "key_metadata_mismatch",
    tone: "danger",
    detail:
      "The key ID, version, and creation timestamp are signed metadata. A caller cannot redirect a receipt to another registry record after signing.",
    changedField: "key_id: receipt-ed25519-2026-07 → unknown-key",
  },
  {
    id: "downgrade",
    step: "04",
    shortLabel: "No downgrade",
    title: "Attempt an Ed25519-to-HMAC downgrade",
    action: "Rewrite algorithm metadata",
    status: "REJECTED",
    reason: "algorithm_metadata_mismatch",
    tone: "danger",
    detail:
      "An Ed25519 receipt never falls back to HMAC. Unknown, unavailable, or mismatched public material returns a non-success result.",
    changedField: "algorithm: Ed25519 → HMAC-SHA256",
  },
  {
    id: "hmac",
    step: "05",
    shortLabel: "HMAC fixture",
    title: "Verify a historical HMAC compatibility fixture",
    action: "Run compatibility verifier",
    status: "VERIFIED",
    reason: "ok",
    tone: "success",
    detail:
      "Historical HMAC receipts remain explicitly verifiable through their own algorithm path. Compatibility is deliberate—not a fallback from Ed25519.",
  },
];

const toneChip: Record<Tone, string> = {
  success: "border-success/30 bg-success/10 text-success",
  danger: "border-danger/30 bg-danger/10 text-danger",
  warning: "border-warning/30 bg-warning/10 text-warning",
  info: "border-info/30 bg-info/10 text-info",
};

const toneDot: Record<Tone, string> = {
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
};

const evidenceRows = [
  {
    label: "Public verification seam",
    status: "VERIFIED",
    tone: "success" as const,
    evidence: "Ed25519 + negative crypto tests",
    boundary: "Local software evidence; not external trust.",
  },
  {
    label: "Implementation train",
    status: "MIXED",
    tone: "warning" as const,
    evidence: "#194 Ready; #197 and #199 Draft — each 5/5 CI at the Jul 31 snapshot",
    boundary: "Green CI does not certify deployment.",
  },
  {
    label: "Xpired 4.2 device",
    status: "BLOCKED",
    tone: "danger" as const,
    evidence: "iPhone · 4.2.0 (2026072807) · Wi-Fi and LTE retry observed",
    boundary: "Scanner unavailable; source linkage inconclusive.",
  },
  {
    label: "Durable storage",
    status: "BLOCKED",
    tone: "danger" as const,
    evidence: "No independent multi-worker recovery evidence",
    boundary: "Process-local state is not durability.",
  },
  {
    label: "Issuance",
    status: "BLOCKED",
    tone: "danger" as const,
    evidence: "No proven store-credit, refund, or payment rail",
    boundary: "An approved amount is not money issued.",
  },
];

function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest ${toneChip[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${toneDot[tone]}`} aria-hidden="true" />
      {label}
    </span>
  );
}

function ReceiptPreview({ scenario }: { scenario: Scenario }) {
  const isHmac = scenario.id === "hmac";
  const isMutated = Boolean(scenario.changedField);

  return (
    <div className="rounded-xl border border-border bg-surface-raised p-4">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-faint">
            signed receipt
          </p>
          <p className="mt-1 font-mono text-sm text-foreground">rcpt_demo_7f4a</p>
        </div>
        <StatusBadge label={isMutated ? "mutated copy" : "original bytes"} tone={isMutated ? "warning" : "info"} />
      </div>

      <dl className="mt-4 grid gap-2.5 text-xs">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-faint">algorithm</dt>
          <dd className={`text-right font-mono ${scenario.id === "downgrade" ? "text-warning" : "text-muted"}`}>
            {scenario.id === "downgrade" ? "HMAC-SHA256 (edited)" : isHmac ? "HMAC-SHA256" : "Ed25519"}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-faint">key_id</dt>
          <dd className={`text-right font-mono ${scenario.id === "key" ? "text-warning" : "text-muted"}`}>
            {scenario.id === "key" ? "unknown-key (edited)" : isHmac ? "legacy-hmac-v1" : "receipt-ed25519-2026-07"}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-faint">key_version</dt>
          <dd className="text-right font-mono text-muted">{isHmac ? "1" : "3"}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-faint">approved_amount_cents</dt>
          <dd className={`text-right font-mono ${scenario.id === "amount" ? "text-warning" : "text-muted"}`}>
            {scenario.id === "amount" ? "899 (edited)" : "499"}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="text-faint">decision</dt>
          <dd className="text-right font-mono text-muted">human_review / approved</dd>
        </div>
      </dl>

      <p className="mt-4 rounded-lg border border-border bg-background px-3 py-2 font-mono text-[11px] text-faint">
        signature: {isHmac ? "hmac:4e91…8ac2" : "ed25519:9ab1…7d40"}
      </p>
    </div>
  );
}

function VerifierTerminal({ scenario }: { scenario: Scenario }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0b1110] text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
          verifier output
        </span>
        <span className="font-mono text-[10px] text-white/40">offline fixture</span>
      </div>
      <div className="space-y-2 p-4 font-mono text-xs leading-6">
        <p className="text-white/50">$ verify_receipt --public-registry ./fixture</p>
        <p>
          <span className="text-white/50">algorithm </span>
          {scenario.id === "hmac" ? "HMAC-SHA256" : "Ed25519"}
        </p>
        <p>
          <span className="text-white/50">registry </span>
          {scenario.id === "hmac" ? "compatibility path" : "public material only"}
        </p>
        {scenario.changedField ? (
          <p className="text-amber-300">mutation {scenario.changedField}</p>
        ) : null}
        <p className={scenario.status === "VERIFIED" ? "text-emerald-300" : "text-red-300"}>
          result {scenario.status}
        </p>
        <p>
          <span className="text-white/50">reason </span>
          {scenario.reason}
        </p>
      </div>
    </div>
  );
}

export default function View() {
  const [activeId, setActiveId] = useState<ScenarioId>("public");
  const active = useMemo(
    () => scenarios.find((scenario) => scenario.id === activeId) ?? scenarios[0],
    [activeId],
  );

  return (
    <section className="space-y-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label="Week 7 evidence" tone="info" />
              <StatusBadge label="human-review-only" tone="warning" />
            </div>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Verify the receipt without sharing the signer.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              This demo separates what the receipt code proves from what the release still cannot claim:
              public verification works, tampering fails closed, and issuance remains outside the evidence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a
                className="rounded-lg border border-border bg-surface-raised px-3 py-2 font-medium transition-colors hover:border-brand hover:text-brand"
                href="https://github.com/LawrenceHua/es-intern-freshlens/issues/156"
                target="_blank"
                rel="noreferrer"
              >
                Open issue #156 ↗
              </a>
              <a
                className="rounded-lg border border-border bg-surface-raised px-3 py-2 font-medium transition-colors hover:border-brand hover:text-brand"
                href="https://github.com/LawrenceHua/es-intern-freshlens/issues/164"
                target="_blank"
                rel="noreferrer"
              >
                Device tracker #164 ↗
              </a>
            </div>
          </div>
          <div className="border-t border-border bg-background p-6 lg:border-l lg:border-t-0 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-faint">release truth</p>
            <p className="mt-3 text-2xl font-semibold">Mixed status is the honest result.</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              A valid local signature is not proof of durable storage, native adoption, external trust, or money issued.
            </p>
            <div className="mt-5 rounded-xl border border-warning/30 bg-warning/10 p-4">
              <p className="font-mono text-xs font-semibold text-warning">GATE: RE-SCOPE</p>
              <p className="mt-2 text-sm text-muted">Final closeout remains human-review-only.</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">live walkthrough</p>
            <h3 className="mt-2 text-2xl font-semibold">Five checks, one explicit contract</h3>
          </div>
          <p className="max-w-md text-sm text-muted">
            Select each check during the demo. The terminal uses deterministic evidence fixtures; it does not call a live signer.
          </p>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5" role="group" aria-label="Receipt verification scenarios">
          {scenarios.map((scenario) => {
            const selected = scenario.id === activeId;
            return (
              <button
                key={scenario.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveId(scenario.id)}
                className={`rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  selected
                    ? "border-brand bg-brand-tint text-foreground"
                    : "border-border bg-surface text-muted hover:border-brand/60 hover:text-foreground"
                }`}
              >
                <span className="font-mono text-[10px] text-faint">{scenario.step}</span>
                <span className="mt-1 block text-sm font-semibold">{scenario.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-start">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">Step {active.step}</p>
              <h4 className="mt-2 text-xl font-semibold">{active.title}</h4>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{active.detail}</p>
            </div>
            <StatusBadge label={`${active.status} · ${active.reason}`} tone={active.tone} />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <ReceiptPreview scenario={active} />
            <VerifierTerminal scenario={active} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5 lg:col-span-2">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">rotation boundary</p>
          <h3 className="mt-2 text-xl font-semibold">Only the active key signs.</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["ACTIVE", "Signs + verifies", "New receipts select exactly one active private key.", "success"],
              ["RETIRED", "Verifies only", "Historical receipts remain readable after rotation.", "warning"],
              ["UNKNOWN / REMOVED", "Fails closed", "No fallback and no silent downgrade.", "danger"],
            ].map(([label, action, detail, tone]) => (
              <div key={label} className="rounded-xl border border-border bg-surface-raised p-4">
                <StatusBadge label={label} tone={tone as Tone} />
                <p className="mt-3 font-semibold">{action}</p>
                <p className="mt-2 text-xs leading-5 text-muted">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-danger">device evidence</p>
          <h3 className="mt-2 text-xl font-semibold">Xpired 4.2 did not reach scanning.</h3>
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="text-faint">Observed build</dt>
              <dd className="mt-1 font-mono text-muted">4.2.0 (2026072807)</dd>
            </div>
            <div>
              <dt className="text-faint">Network retries</dt>
              <dd className="mt-1 text-muted">Wi-Fi + LTE, same unavailable state</dd>
            </div>
            <div>
              <dt className="text-faint">Apple Sign-In</dt>
              <dd className="mt-1 text-muted">Unavailable; no credential entered</dd>
            </div>
            <div>
              <dt className="text-faint">Source linkage</dt>
              <dd className="mt-1 font-semibold text-danger">INCONCLUSIVE</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">evidence ledger · Jul 31 snapshot</p>
            <h3 className="mt-2 text-xl font-semibold">What we proved—and what we did not</h3>
          </div>
          <p className="text-xs text-faint">Status should be refreshed before the live Friday demo.</p>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border font-mono text-[10px] uppercase tracking-widest text-faint">
                <th className="pb-3 pr-4 font-medium">Surface</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Evidence</th>
                <th className="pb-3 font-medium">Limit</th>
              </tr>
            </thead>
            <tbody>
              {evidenceRows.map((row) => (
                <tr key={row.label} className="border-b border-border last:border-0">
                  <td className="py-4 pr-4 font-medium">{row.label}</td>
                  <td className="py-4 pr-4"><StatusBadge label={row.status} tone={row.tone} /></td>
                  <td className="py-4 pr-4 text-muted">{row.evidence}</td>
                  <td className="py-4 text-muted">{row.boundary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-5 sm:p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-info">60–90 second talk track</p>
        <ol className="mt-4 grid gap-3 text-sm leading-6 text-muted md:grid-cols-2">
          <li className="rounded-xl border border-border bg-surface p-4">
            <span className="font-semibold text-foreground">1. Result.</span>{" "}
            “My Week 7 lane makes receipts publicly verifiable without distributing the private signing key.”
          </li>
          <li className="rounded-xl border border-border bg-surface p-4">
            <span className="font-semibold text-foreground">2. Proof.</span>{" "}
            “The original Ed25519 receipt verifies; changing the amount, key ID, or algorithm is rejected.”
          </li>
          <li className="rounded-xl border border-border bg-surface p-4">
            <span className="font-semibold text-foreground">3. Compatibility.</span>{" "}
            “A historical HMAC fixture still verifies on its explicit compatibility path—never as a downgrade.”
          </li>
          <li className="rounded-xl border border-border bg-surface p-4">
            <span className="font-semibold text-foreground">4. Boundary.</span>{" "}
            “Active keys sign, retired keys verify only. Native scanning, durability, external trust, and issuance remain blocked or inconclusive.”
          </li>
        </ol>
      </div>
    </section>
  );
}
