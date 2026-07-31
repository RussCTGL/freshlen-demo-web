"use client";

import { useMemo, useState } from "react";

import {
  deviceEvidenceRows,
  deviceSynthesis,
  evidenceIdentity,
  observedReceipt,
  privacyEvidence,
  publicVerificationRecord,
  scenarios,
  type EvidenceScenario,
  type EvidenceTone,
} from "./evidence";

type ScenarioId = EvidenceScenario["id"];

const toneChip: Record<EvidenceTone, string> = {
  success: "border-success/30 bg-success/10 text-success",
  danger: "border-danger/30 bg-danger/10 text-danger",
  warning: "border-warning/30 bg-warning/10 text-warning",
  info: "border-info/30 bg-info/10 text-info",
};

const toneDot: Record<EvidenceTone, string> = {
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
};

function StatusBadge({ label, tone }: { label: string; tone: EvidenceTone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest ${toneChip[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${toneDot[tone]}`} aria-hidden="true" />
      {label}
    </span>
  );
}

function EvidenceIdentity() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">exact evidence identity</p>
          <h3 className="mt-2 text-xl font-semibold">One command, one commit, one honest status</h3>
        </div>
        <StatusBadge label={evidenceIdentity.status} tone="warning" />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface-raised p-3">
          <dt className="text-faint">Source</dt>
          <dd className="mt-1 font-mono text-xs text-foreground">{evidenceIdentity.sourceShort}</dd>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-3">
          <dt className="text-faint">Observed</dt>
          <dd className="mt-1 font-mono text-xs text-foreground">{evidenceIdentity.observedAt}</dd>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-3">
          <dt className="text-faint">Environment</dt>
          <dd className="mt-1 text-xs text-foreground">{evidenceIdentity.environment}</dd>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/10 p-3">
          <dt className="text-success">Focused tests</dt>
          <dd className="mt-1 font-mono text-xs text-success">exit {evidenceIdentity.exitCode}</dd>
        </div>
      </dl>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-[#0b1110] p-4 font-mono text-xs leading-6 text-white">
        <p className="break-all text-white/55">$ {evidenceIdentity.command}</p>
        <p className="mt-2 text-emerald-300">{evidenceIdentity.testResult}</p>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        {evidenceIdentity.candidate} The command result is verified on this exact head; the overall lane remains code-shipped-not-verified until review, ordered merge, and final-candidate rerun are complete.
      </p>
    </div>
  );
}

function ReceiptCard({ scenario }: { scenario: EvidenceScenario }) {
  const isHmac = scenario.id === "hmac";

  return (
    <div className="rounded-xl border border-border bg-surface-raised p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-faint">observed receipt</p>
          <p className="mt-1 font-mono text-sm text-foreground">
            {isHmac ? "historical HMAC fixture" : observedReceipt.receiptId}
          </p>
        </div>
        <StatusBadge label={scenario.mutation ? "mutated copy" : "observed bytes"} tone={scenario.mutation ? "warning" : "info"} />
      </div>

      <dl className="mt-4 grid gap-2.5 text-xs">
        <div className="flex justify-between gap-4">
          <dt className="text-faint">algorithm</dt>
          <dd className="font-mono text-muted">{isHmac ? "HMAC-SHA256" : observedReceipt.algorithm}</dd>
        </div>
        {!isHmac ? (
          <>
            <div className="flex justify-between gap-4">
              <dt className="text-faint">key_id</dt>
              <dd className="font-mono text-muted">{observedReceipt.keyId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-faint">key_version</dt>
              <dd className="font-mono text-muted">{observedReceipt.keyVersion}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-faint">insecure_dev_key</dt>
              <dd className="font-mono text-success">{String(observedReceipt.insecureDevKey)}</dd>
            </div>
          </>
        ) : null}
      </dl>

      {scenario.mutation ? (
        <p className="mt-4 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 font-mono text-[11px] text-warning">
          mutation: {scenario.mutation}
        </p>
      ) : (
        <p className="mt-4 break-all rounded-lg border border-border bg-background px-3 py-2 font-mono text-[11px] text-faint">
          digest: {isHmac ? scenario.computedDigest : observedReceipt.digest}
        </p>
      )}
    </div>
  );
}

function ResultTerminal({ scenario }: { scenario: EvidenceScenario }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0b1110] text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">captured probe result</span>
        <span className="font-mono text-[10px] text-white/40">{evidenceIdentity.sourceShort}</span>
      </div>
      <div className="space-y-2 p-4 font-mono text-xs leading-6">
        <p className="text-white/50">src.receipt.verify_receipt(...)</p>
        <p>
          <span className="text-white/50">valid </span>
          <span className={scenario.valid ? "text-emerald-300" : "text-red-300"}>{String(scenario.valid)}</span>
        </p>
        <p><span className="text-white/50">digest_ok </span>{String(scenario.digestOk)}</p>
        <p><span className="text-white/50">signature_ok </span>{String(scenario.signatureOk)}</p>
        <p>
          <span className="text-white/50">reason </span>
          <span className={scenario.valid ? "text-emerald-300" : "text-red-300"}>{scenario.reason}</span>
        </p>
        <p className="break-all text-white/45">computed_digest {scenario.computedDigest}</p>
      </div>
    </div>
  );
}

function PublicMaterialCard() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">public-only record</p>
          <h3 className="mt-2 text-xl font-semibold">Verifier receives no signing secret</h3>
        </div>
        <StatusBadge label="public material" tone="success" />
      </div>
      <dl className="mt-5 space-y-2 text-xs">
        {Object.entries(publicVerificationRecord).map(([key, value]) => (
          <div key={key} className="grid grid-cols-[130px_1fr] gap-3 border-b border-border py-2 last:border-0">
            <dt className="font-mono text-faint">{key}</dt>
            <dd className="break-all font-mono text-muted">{String(value)}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {privacyEvidence.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 rounded-lg bg-background px-3 py-2 text-xs">
            <span className="text-muted">{row.label}</span>
            <span className="font-mono font-semibold text-success">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeviceSynthesis() {
  const rowTone: Record<(typeof deviceEvidenceRows)[number]["rowStatus"], EvidenceTone> = {
    COMPLETE: "success",
    HISTORICAL: "info",
    INCOMPLETE: "warning",
    MISSING: "danger",
    NOT_APPLICABLE: "info",
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">all-eight physical-device synthesis</p>
          <h3 className="mt-2 text-xl font-semibold">The device matrix is not yet complete.</h3>
        </div>
        <StatusBadge label={deviceSynthesis.status} tone="danger" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="rounded-xl border border-border bg-surface-raised p-3">
          <p className="text-xs text-faint">Direct rows posted</p>
          <p className="mt-1 text-2xl font-semibold">{deviceSynthesis.directRows}/{deviceSynthesis.assigned}</p>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/10 p-3">
          <p className="text-xs text-success">Complete physical-device rows</p>
          <p className="mt-1 text-2xl font-semibold text-success">{deviceSynthesis.completeRows}/8</p>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/10 p-3">
          <p className="text-xs text-success">Complete current-build rows</p>
          <p className="mt-1 text-2xl font-semibold text-success">{deviceSynthesis.currentBuildCompleteRows}/8</p>
        </div>
        <div className="rounded-xl border border-warning/30 bg-warning/10 p-3">
          <p className="text-xs text-warning">Incomplete rows</p>
          <p className="mt-1 text-2xl font-semibold text-warning">{deviceSynthesis.incompleteRows}</p>
        </div>
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-3">
          <p className="text-xs text-danger">Missing direct rows</p>
          <p className="mt-1 text-2xl font-semibold text-danger">{deviceSynthesis.missingRows}</p>
        </div>
        <div className="rounded-xl border border-info/30 bg-info/10 p-3">
          <p className="text-xs text-info">No physical surface</p>
          <p className="mt-1 text-2xl font-semibold text-info">{deviceSynthesis.notApplicableRows}</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-border">
        <table className="min-w-[900px] w-full text-left text-xs">
          <thead className="bg-background font-mono uppercase tracking-wider text-faint">
            <tr>
              <th className="px-3 py-3">Owner</th>
              <th className="px-3 py-3">Evidence</th>
              <th className="px-3 py-3">Participation</th>
              <th className="px-3 py-3">Build / source</th>
              <th className="px-3 py-3">Observed result or gap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {deviceEvidenceRows.map((row) => (
              <tr key={row.owner} className="align-top">
                <td className="px-3 py-3 font-semibold text-foreground">{row.owner}</td>
                <td className="px-3 py-3"><StatusBadge label={row.rowStatus} tone={rowTone[row.rowStatus]} /></td>
                <td className="px-3 py-3 font-mono text-muted">{row.participation}</td>
                <td className="px-3 py-3 text-muted">
                  <span className="font-mono">{row.build}</span>
                  <span className="mt-1 block text-faint">source: {row.sourceLinkage}</span>
                </td>
                <td className="px-3 py-3 leading-5 text-muted">{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-danger">Observed shopper problem</p>
          <p className="mt-2 text-sm leading-6 text-muted">Four complete rows on the exact 4.2 build independently reproduce a scanner-unavailable state, so capture and the downstream claim journey cannot begin.</p>
        </div>
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-warning">Operational signal</p>
          <p className="mt-2 text-sm leading-6 text-muted">Track privacy-safe model-package install outcome, bounded error category, retry count, app build, network class, and source-to-archive linkage.</p>
        </div>
        <div className="rounded-xl border border-info/30 bg-info/5 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-info">Next retest</p>
          <p className="mt-2 text-sm leading-6 text-muted">Native release owner supplies a source-linked repair build; Tony posts a direct row; Mohan replaces placeholders; device-capable owners then rerun scanner recovery and one staged claim path.</p>
        </div>
      </div>

      <p className="mt-5 border-t border-border pt-4 text-sm leading-6 text-muted">
        No current row proves source linkage or the complete physical receipt-capture to human-review to decision-receipt journey. Green software checks do not close this native boundary.
      </p>
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
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap gap-2">
              <StatusBadge label="Week 7 · #156" tone="info" />
              <StatusBadge label="human-review-only" tone="warning" />
            </div>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Real receipt evidence, replayed without exposing the signer.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base">
              Every result below was captured from the FreshLens implementation at one exact commit. The page replays sanitized output; it does not invent a second receipt path or contact a production signer.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a className="rounded-lg border border-border bg-surface-raised px-3 py-2 font-medium hover:border-brand hover:text-brand" href="https://github.com/LawrenceHua/es-intern-freshlens/issues/156" target="_blank" rel="noreferrer">Issue #156 ↗</a>
              <a className="rounded-lg border border-border bg-surface-raised px-3 py-2 font-medium hover:border-brand hover:text-brand" href={`https://github.com/LawrenceHua/es-intern-freshlens/commit/${evidenceIdentity.sourceSha}`} target="_blank" rel="noreferrer">Exact source ↗</a>
            </div>
          </div>
          <div className="border-t border-border bg-background p-6 lg:border-l lg:border-t-0 sm:p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">result + limitation</p>
            <p className="mt-3 text-2xl font-semibold">Receipt changes are detected; the system is not claimed unforgeable.</p>
            <p className="mt-3 text-sm leading-6 text-muted">
              The tests show that a changed signed receipt is rejected. They do not prove that the entire system cannot be forged. The correct claim is tamper-evident: the verifier can detect changes to signed receipt data.
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">
              Public verification passed on the exact head. This remains offline software evidence from an unmerged stacked PR, not proof of native adoption, durable storage, external trust, or issuance.
            </p>
            <div className="mt-5 rounded-xl border border-warning/30 bg-warning/10 p-4">
              <p className="font-mono text-xs font-semibold text-warning">GATE: RE-SCOPE</p>
              <p className="mt-2 text-sm text-muted">The release remains human-review-only.</p>
            </div>
          </div>
        </div>
      </div>

      <EvidenceIdentity />

      <div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">observed receipt checks</p>
          <h3 className="mt-2 text-2xl font-semibold">Create, verify, reject, preserve compatibility</h3>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5" role="group" aria-label="Receipt evidence scenarios">
          {scenarios.map((scenario) => {
            const selected = scenario.id === activeId;
            return (
              <button
                key={scenario.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setActiveId(scenario.id)}
                className={`rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${selected ? "border-brand bg-brand-tint text-foreground" : "border-border bg-surface text-muted hover:border-brand/60 hover:text-foreground"}`}
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
            <StatusBadge label={`${active.valid ? "VERIFIED" : "REJECTED"} · ${active.reason}`} tone={active.valid ? "success" : "danger"} />
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <ReceiptCard scenario={active} />
            <ResultTerminal scenario={active} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PublicMaterialCard />
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">rotation boundary</p>
          <h3 className="mt-2 text-xl font-semibold">Active signs; active and retired verify.</h3>
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-success/30 bg-success/10 p-4">
              <StatusBadge label="ACTIVE" tone="success" />
              <p className="mt-2 text-sm text-muted">Signs and verifies. The observed Ed25519 receipt returned valid=true.</p>
            </div>
            <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
              <StatusBadge label="RETIRED" tone="warning" />
              <p className="mt-2 text-sm text-muted">Verifies historical receipts only. The same observed receipt returned valid=true after the registry status changed to retired.</p>
            </div>
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-4">
              <StatusBadge label="UNKNOWN / REMOVED" tone="danger" />
              <p className="mt-2 text-sm text-muted">Fails closed. No fallback, automated custody, revocation distribution, or external trust is claimed.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-danger">current native/device truth</p>
            <h3 className="mt-2 text-xl font-semibold">The required physical receipt journey is BLOCKED.</h3>
          </div>
          <StatusBadge label="BLOCKED" tone="danger" />
        </div>
        <div className="mt-5 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-faint">Observed build</p><p className="mt-1 font-mono text-muted">Xpired 4.2.0 (2026072807)</p></div>
          <div><p className="text-faint">Observed result</p><p className="mt-1 text-muted">Inventory opened; scanner stayed unavailable after Wi-Fi and LTE retry.</p></div>
          <div><p className="text-faint">Source linkage</p><p className="mt-1 font-semibold text-danger">INCONCLUSIVE</p></div>
          <div><p className="text-faint">Not demonstrated</p><p className="mt-1 text-muted">Receipt capture → human_review → decision-receipt verification.</p></div>
        </div>
        <p className="mt-5 border-t border-danger/20 pt-4 text-sm leading-6 text-muted">
          Durable multi-worker storage and issuance are also BLOCKED. An approved amount is not a refund, credit, payment, payout, settlement, or completed return.
        </p>
      </div>

      <DeviceSynthesis />

    </section>
  );
}
