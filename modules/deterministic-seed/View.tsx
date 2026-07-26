"use client";

import { useState } from "react";
import { StatBars } from "@/components/StatBars";
import {
  manifest,
  seedDivergence,
  fraudByType,
  scenarioForSeed,
  seedChain,
  testCounts,
  checkMode,
  deviceFinding,
  WASTE_BAND_MIN,
  PER_CLAIM_CEILING_CENTS,
} from "./data";

const CARD = "rounded border border-border p-4";
const LABEL =
  "font-mono text-xs font-medium uppercase tracking-widest text-muted";

/** FreshLens canonical: 0 = fresh … 100 = waste. */
function freshlensBand(score: number) {
  return score >= WASTE_BAND_MIN ? "waste" : "conversion";
}

export default function View() {
  const [seed, setSeed] = useState(85);
  const [score, setScore] = useState(71);

  const scenario = scenarioForSeed(seed);

  return (
    <section className="space-y-10">
      {/* ─── 1. The problem ─────────────────────────────────────────── */}
      <p className="text-muted">
        The Friday golden path needs a claim already sitting in{" "}
        <code className="font-mono text-xs">human_review</code>{" "}before anyone can
        demo a reviewer resolving it. That state has to come from somewhere — and
        the obvious approach doesn&rsquo;t work. This week built the thing that
        does, made it reproducible to the byte, and then pinned the edges of the
        contract it feeds.
      </p>

      <div className={CARD}>
        <h3 className={LABEL}>Why the helper is imported, not run</h3>
        <p className="mt-3 text-sm text-muted">
          <code className="font-mono text-xs">src/claims_store.py</code> keeps
          state in module-level memory, so a seeder run as a subprocess writes to
          its own copy and the serving app sees an empty store. The helper is{" "}
          <em>imported</em> by whoever holds the app instead. One of the{" "}
          {testCounts.demoSeed} tests drives the real API through{" "}
          <code className="font-mono text-xs">TestClient</code> and reads the
          seeded claim back — proof, not assertion.
        </p>
      </div>

      {/* ─── 2. Determinism ─────────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>Same seed, twice, byte-identical</h3>
        <pre className="mt-3 overflow-x-auto rounded bg-surface-raised p-3 font-mono text-xs leading-relaxed">
          {`python scripts/make_evidence_fixtures.py --seed 42 --output /tmp/ev1
python scripts/make_evidence_fixtures.py --seed 42 --output /tmp/ev2
diff -ru /tmp/ev1 /tmp/ev2`}
        </pre>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-brand/40 bg-brand-tint px-3 py-1 font-mono text-xs text-brand">
            diff exit 0 · no output
          </span>
          <span className="font-mono text-xs text-faint">
            index.csv sha256 {manifest.shaPrefix}…
          </span>
          <span className="font-mono text-xs text-faint">
            {manifest.filesInOutputTree} files written
          </span>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className={LABEL}>Manifest — {manifest.rows} rows</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {[manifest.match, manifest.mismatch, manifest.fraud].map((c, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-muted">
                    {["match", "mismatch", "fraud"][i]}
                  </span>
                  <span className="font-mono tabular-nums">{c.count}</span>
                  <span className="text-xs text-faint">min {c.min}</span>
                  <span className="text-xs text-brand">✓</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">
              Retail variants {manifest.retailVariants.covered}/
              {manifest.retailVariants.total} covered, against a required{" "}
              {manifest.retailVariants.required}.
            </p>
          </div>
          <StatBars title="Fraud signals" rows={fraudByType} />
        </div>

        <p className="mt-4 text-sm text-muted">
          A clone without the calibration photos fails closed —{" "}
          <code className="font-mono text-xs">
            only 0 usable calibration photos found on disk; need &gt;= 60
          </code>
          , exit 1 — rather than quietly emitting a short manifest. The photos are
          deliberately not committed; that boundary is the point, not a defect.
        </p>

        <div className="mt-4 rounded bg-surface-raised p-3">
          <p className="text-xs text-muted">
            Determinism has to cut both ways, or it&rsquo;s just a constant. Same
            seed → identical bytes; a <em>different</em> seed → different bytes at
            the same floors:
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="text-brand">
              --seed 42 → {seedDivergence.seed42Sha}…
            </span>
            <span className="text-faint">vs</span>
            <span className="text-warning">
              --seed 43 → {seedDivergence.seed43Sha}…
            </span>
          </div>
          <p className="mt-1 text-[10px] text-faint">
            both: {seedDivergence.sharedFloors}
          </p>
        </div>
      </div>

      {/* ─── 3. The seeded scenario ─────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>What one seed produces</h3>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">seed</span>
          {[42, 85, 1234].map((s) => (
            <button
              key={s}
              onClick={() => setSeed(s)}
              className={`rounded border px-3 py-1 font-mono text-xs transition ${
                seed === s
                  ? "border-brand bg-brand-tint text-brand"
                  : "border-border text-muted hover:border-border-strong"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-1">
          {seedChain.map((link, i) => (
            <div key={link.step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[10px] ${
                    i === seedChain.length - 1
                      ? "bg-warning/20 text-warning"
                      : "bg-brand-tint text-brand"
                  }`}
                >
                  {i + 1}
                </span>
                {i < seedChain.length - 1 && (
                  <span className="h-4 w-px bg-border" />
                )}
              </div>
              <div className="pb-1">
                <span className="font-mono text-sm">{link.step}</span>
                <span className="ml-2 text-xs text-muted">{link.note}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded bg-surface-raised p-3 font-mono text-xs leading-relaxed">
            <div>
              price_cents{" "}
              <span className="text-brand">{scenario.priceCents}</span>
            </div>
            <div>
              requested{" "}
              <span className="text-brand">{scenario.requestedCents}</span>{" "}
              <span className="text-faint">
                (ceiling {PER_CLAIM_CEILING_CENTS})
              </span>
            </div>
            <div>
              item <span className="text-brand">{scenario.itemLabel}</span>
            </div>
            <div>
              receipt variant{" "}
              <span className="text-brand">{scenario.receiptVariant}</span>
            </div>
            <div>
              score <span className="text-brand">{scenario.freshnessScore}</span>{" "}
              <span className="text-faint">({scenario.quality} band)</span>
            </div>
            <div>
              confidence <span className="text-warning">None</span>{" "}
              <span className="text-faint">— unavailable fails closed</span>
            </div>
          </div>
          <p className="text-sm text-muted">
            Every value the helper <em>chooses</em> is a pure function of the seed —
            change it and the price moves deterministically. Record ids are{" "}
            <strong>not</strong> seed-stable: the store mints them with{" "}
            <code className="font-mono text-xs">uuid4</code>, so the helper returns
            them rather than pretending to predict them. Credentials are synthetic
            and contain <code className="font-mono text-xs">test-only</code>; the
            store persists only a digest, never the raw token.
          </p>
        </div>
      </div>

      {/* ─── 4. Boundary contribution ───────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>
          Pinning the edges — my #129 boundary contribution
        </h3>
        <p className="mt-3 text-sm text-muted">
          The contract had no test sitting on an edge — so drag the score across
          71 and watch the category flip:
        </p>

        <div className="mt-4">
          <input
            type="range"
            min={0}
            max={100}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full accent-brand"
            aria-label="freshness score"
          />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-faint">
            <span>0 · fresh</span>
            <span>{WASTE_BAND_MIN} · waste band starts</span>
            <span>100 · waste</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-mono text-xs text-muted">
              freshness_score
            </span>
            <span className="font-mono text-lg tabular-nums">{score}</span>
            <span
              className={`rounded-full px-3 py-1 font-mono text-xs ${
                freshlensBand(score) === "waste"
                  ? "border border-warning/40 bg-warning/10 text-warning"
                  : "border border-border bg-surface-raised text-muted"
              }`}
            >
              quality_category = {freshlensBand(score)}
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted">
          The suite denied everything <em>above</em> each ceiling with{" "}
          <code className="font-mono text-xs">&gt;</code> and every fixture used
          score 82 — so an off-by-one tightening to{" "}
          <code className="font-mono text-xs">&gt;=</code> would have passed
          unnoticed. My fixtures pin both sides of 71 (waste vs conversion) and the
          exact 1000c / 1500c ceilings, plus three invariants — the rule engine
          returns <code className="font-mono text-xs">human_review</code>{" "}
          unconditionally, so fixtures alone assert nothing. Contract suite{" "}
          <strong>{testCounts.contractNow}</strong> passing, run twice, identical;
          relabelling 71 as <code className="font-mono text-xs">conversion</code>{" "}
          fails the new test.
        </p>
      </div>

      {/* ─── 5. Check mode (shipped stretch) ────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>
          Read-only validator — the #110 stretch, shipped
        </h3>
        <p className="mt-3 text-sm text-muted">
          Generation needs the calibration photos; grading an{" "}
          <em>already-built</em> tree shouldn&rsquo;t. So{" "}
          <code className="font-mono text-xs">check</code> re-verifies an existing
          manifest against the same schema, vocabularies, count floors, and retail
          coverage that generation enforces — writing nothing, needing no photos,
          and exiting non-zero on any failure. That gives Yizhou&rsquo;s #113
          evaluator a CI hook that runs anywhere.
        </p>
        <pre className="mt-3 overflow-x-auto rounded bg-surface-raised p-3 font-mono text-xs leading-relaxed">
          {checkMode.command}
        </pre>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full border border-brand/40 bg-brand-tint px-3 py-1 font-mono text-xs text-brand">
            {checkMode.passOn42}
          </span>
          <span className="font-mono text-xs text-faint">
            {checkMode.checks.length} checks · {checkMode.failClosed}
          </span>
          <span className="font-mono text-xs text-faint">
            {checkMode.tests} tests · writes nothing
          </span>
        </div>
      </div>

      {/* ─── 6. Device finding ──────────────────────────────────────── */}
      <div className="rounded border border-danger/40 bg-danger/5 p-4">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-danger">
          Device finding — #119 · scenario {deviceFinding.scenarioResult} ·
          blocking {deviceFinding.blocking.result}
        </h3>
        <p className="mt-1 font-mono text-[10px] text-faint">
          {deviceFinding.device}
        </p>
        <p className="mt-3 text-sm">
          My scenario was blurry/partial capture and retake guidance — there is no
          retake path, so the scenario is <strong>{deviceFinding.scenarioResult}</strong>.
          Proving it, one sealed can scanned three ways gave three confident,
          inconsistent verdicts:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {deviceFinding.frames.map((f) => (
            <div
              key={f.frame}
              className={`rounded p-3 ${
                f.classified === "Mango"
                  ? "border border-danger/40 bg-danger/10"
                  : "bg-surface-raised"
              }`}
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-faint">
                {f.frame}
              </div>
              <div className="mt-1 font-mono text-sm">
                {f.classified} · {f.xfsScore}%
              </div>
              <div className="mt-1 text-xs text-muted">{f.note}</div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-danger">
          {deviceFinding.blocking.what}
        </p>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          {deviceFinding.blocking.evidence.map((o) => (
            <li key={o}>· {o}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">
          <span className="font-mono uppercase tracking-wider text-faint">
            correction gap ·{" "}
          </span>
          {deviceFinding.correctionGap}
        </p>
      </div>

      {/* ─── 7. Status ──────────────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>Status</h3>
        <table className="mt-3 w-full text-sm">
          <tbody className="divide-y divide-border">
            {[
              ["#110 fixture CLI + `--output` (PR #141)", "VERIFIED", "brand"],
              ["#110 item 8 in-process seed helper (PR #151)", "VERIFIED", "brand"],
              ["#110 three-role principals (PR #153)", "VERIFIED", "brand"],
              ["#129 boundary fixtures + invariants (PR #148)", "VERIFIED", "brand"],
              [
                "Offline golden path — seeds → human_review → resolve",
                "VERIFIED — 16/16, FAILED 0",
                "brand",
              ],
              ["#110 `check` mode for #113 evaluator (stretch)", "SHIPPED — in review", "brand"],
              [
                "#119 blurry/partial scenario",
                "NOT_PRESENT · blocking FAIL reported",
                "danger",
              ],
              [
                "#85 clean-checkout fixture generation",
                "BLOCKED — authorized photo sync",
                "warning",
              ],
            ].map(([what, status, tone]) => (
              <tr key={what as string}>
                <td className="py-2 pr-4">{what}</td>
                <td
                  className={`py-2 text-right font-mono text-xs ${
                    tone === "brand"
                      ? "text-brand"
                      : tone === "danger"
                        ? "text-danger"
                        : "text-warning"
                  }`}
                >
                  {status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
