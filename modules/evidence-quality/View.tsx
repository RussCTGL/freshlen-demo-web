"use client";

import { useState } from "react";
import { StatBars } from "@/components/StatBars";
import {
  totalCases,
  matchCases,
  mismatchCases,
  fraudCases,
  fraudByType,
  manifestSha,
  schema,
  fraudSignals,
  labelExamples,
  produceTypes,
} from "./data";

type FraudChoice = "none" | (typeof fraudSignals)[number]["type"];

/** Mirrors the routing rule the Friday demo shows: any fraud signal or an
 *  identity mismatch → human_review; a clean matching claim → policy engine. */
function route(photoItem: string, receiptItem: string, fraud: FraudChoice) {
  if (fraud !== "none") {
    return {
      dest: "human_review",
      why: `fraud signal tripped: ${fraud} — the evidence itself is untrusted, so identity is moot`,
    };
  }
  if (photoItem !== receiptItem) {
    return {
      dest: "human_review",
      why: `identity mismatch: the photo shows ${photoItem}, the receipt says ${receiptItem}`,
    };
  }
  return {
    dest: "policy_engine",
    why: "genuine, matching claim — evidence is trustworthy, so the Week-3 policy engine decides the refund",
  };
}

export default function View() {
  const [photoItem, setPhotoItem] = useState<string>("banana");
  const [receiptItem, setReceiptItem] = useState<string>("strawberry");
  const [fraud, setFraud] = useState<FraudChoice>("none");
  const verdict = route(photoItem, receiptItem, fraud);

  const selectCls =
    "rounded border border-border bg-transparent px-2 py-1 font-mono text-xs";

  return (
    <section className="space-y-8">
      {/* 1 — The question */}
      <p className="text-muted">
        Week 5 asks <strong>&ldquo;is the evidence trustworthy?&rdquo;</strong> —
        and that breaks into two smaller questions: does the photo show what the
        receipt says (<em>identity</em>), and is the photo itself suspect (
        <em>fraud</em>)? Nobody can measure either without labeled ground truth,
        so this week built it: <strong>{totalCases} labeled cases</strong>, made
        entirely by reusing the 154 calibration photos plus seeded synthetic
        fixtures — <strong>zero new photography</strong>. Start by trying the
        routing those labels make testable:
      </p>

      {/* 2 — The Friday demo, interactive */}
      <div className="rounded border border-border p-4">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Try the Friday demo — where does this claim route?
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-muted">photo shows</span>
            <select
              className={selectCls}
              value={photoItem}
              onChange={(e) => setPhotoItem(e.target.value)}
            >
              {produceTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-muted">receipt says</span>
            <select
              className={selectCls}
              value={receiptItem}
              onChange={(e) => setReceiptItem(e.target.value)}
            >
              {produceTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-muted">fraud signal</span>
            <select
              className={selectCls}
              value={fraud}
              onChange={(e) => setFraud(e.target.value as FraudChoice)}
            >
              <option value="none">none</option>
              {fraudSignals.map((f) => (
                <option key={f.type} value={f.type}>
                  {f.type}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm">
          <span className="font-mono text-xs uppercase tracking-widest text-faint">
            routes to{" "}
          </span>
          <span
            className={
              "rounded px-2 py-0.5 font-mono text-xs " +
              (verdict.dest === "policy_engine"
                ? "bg-brand text-white"
                : "border border-border text-muted")
            }
          >
            {verdict.dest}
          </span>
        </p>
        <p className="mt-2 text-sm text-faint">{verdict.why}</p>
        <p className="mt-2 text-sm text-faint">
          The default <em>is</em> the demo case: a banana photo on a strawberry
          receipt goes to <code>human_review</code>; flip the receipt to banana
          and the genuine claim goes to the policy engine.
        </p>
      </div>

      {/* 3 — What stands behind the widget: the composition */}
      <div>
        <p className="text-muted">
          Every path that widget can express exists as a labeled row in the gold
          set — nothing is hard-coded. The {totalCases} cases split three ways:
          the first two bars are the <em>identity</em> question, the third is
          the <em>fraud</em> question.
        </p>
        <div className="mt-4 max-w-md">
          <StatBars
            title={`Gold set composition (${totalCases} cases)`}
            rows={[
              { name: "match", count: matchCases },
              { name: "mismatch", count: mismatchCases },
              { name: "fraud", count: fraudCases },
            ]}
          />
        </div>
      </div>

      {/* 4 — The identity half */}
      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          The identity cases — receipts don&rsquo;t say &ldquo;banana&rdquo;
        </h3>
        <p className="mt-2 text-sm text-muted">
          The {matchCases + mismatchCases} match and mismatch cases pair a real
          calibration photo with the string a receipt would actually print:
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {labelExamples.map((e) => (
            <li
              key={e.raw}
              className="flex items-center justify-between rounded border border-border px-3 py-2 text-sm"
            >
              <code className="font-mono text-xs text-muted">{e.raw}</code>
              <span className="font-mono text-xs text-faint">→ {e.canonical}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-faint">
          Plurals, synonyms, and raw SKU strings on purpose, so Lisa&rsquo;s{" "}
          <code>NORMALIZE_MAP</code> (#76) is exercised against what receipts
          print — not against clean tokens. That realism already paid for
          itself: Yizhou&rsquo;s first eval run showed most hypothetical
          false-mismatches on genuine claims were this string gap, not vision
          errors.
        </p>
      </div>

      {/* 5 — The fraud half */}
      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          The fraud cases — five signals, one fixture set
        </h3>
        <p className="mt-2 text-sm text-muted">
          The remaining {fraudCases} cases are the fraud fixtures. Each simulates
          one way a dishonest claim photo lies:
        </p>
        <ul className="mt-3 space-y-2">
          {fraudSignals.map((f) => (
            <li
              key={f.type}
              className="rounded border border-border px-3 py-2 text-sm"
            >
              <code className="font-mono text-xs text-brand">{f.type}</code>
              <span className="text-muted"> — {f.simulates}. </span>
              <span className="text-faint">Signal: {f.detector}.</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 max-w-md">
          <StatBars title="Fraud fixtures by signal" rows={fraudByType} />
        </div>
      </div>

      {/* 6 — Who consumes it: the shared API */}
      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Who consumes it — data/evidence/index.csv as a shared API
        </h3>
        <p className="mt-2 text-sm text-muted">
          These cases aren&rsquo;t just for show: Tony&rsquo;s tests (#79)
          import one ready-made fixture per fraud signal, and Yizhou&rsquo;s{" "}
          <code>evidence_eval.py</code> (#81) reads the manifest unchanged. That
          makes the schema a shared API — field names were frozen with both of
          them before Wednesday office hours.
        </p>
        <ul className="mt-3 space-y-2">
          {schema.map((s) => (
            <li key={s.col} className="flex gap-3 text-sm">
              <code className="w-40 shrink-0 font-mono text-xs text-brand">
                {s.col}
              </code>
              <span className="text-faint">{s.meaning}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 7 — Proof, then honesty */}
      <p className="text-sm text-faint">
        And because three workstreams depend on it, the set has to be
        reproducible: one documented command rebuilds every synthetic fixture
        byte-identically (seeded, seed&nbsp;85), and{" "}
        <code>tests/test_evidence_dataset.py</code> proves the manifest
        reconciles 1:1 with files on disk — green in pytest. Manifest hash:{" "}
        <code className="font-mono">{manifestSha}</code>
      </p>
      <p className="text-sm text-faint">
        Honest limitations, stated in the README: screenshot recaptures are
        synthetic approximations (no moir&eacute;, no glare); near-solid
        backgrounds are trivially separable; <code>captured_in_app</code> is
        inferred from Week-4 source labels. This set makes the routing
        measurable — it is not yet a hard fraud-detector benchmark.
      </p>
    </section>
  );
}
