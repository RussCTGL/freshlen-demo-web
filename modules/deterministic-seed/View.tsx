"use client";

import { useState } from "react";
import { StatBars } from "@/components/StatBars";
import {
  manifest,
  fraudByType,
  scenarioForSeed,
  seedChain,
  boundaryFixtures,
  testCounts,
  deviceFinding,
  WASTE_BAND_MIN,
  PER_CLAIM_CEILING_CENTS,
  MONTHLY_CEILING_CENTS,
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
  const [requested, setRequested] = useState(900);
  const [approved, setApproved] = useState(900);

  const scenario = scenarioForSeed(seed);
  const clamped = Math.min(approved, requested, PER_CLAIM_CEILING_CENTS);
  const clampReason =
    approved > requested
      ? "denied — a reviewer may lower but never inflate the shopper's request"
      : approved > PER_CLAIM_CEILING_CENTS
        ? "denied — above the immutable 1000c per-claim ceiling"
        : "accepted";

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
        <h3 className={LABEL}>Why an external seeder cannot work</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded border border-danger/40 bg-danger/5 p-3">
            <p className="font-mono text-xs text-danger">✕ separate process</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="rounded bg-surface-raised p-2">
                <span className="font-mono text-xs">seed_script.py</span>
                <div className="mt-1 text-xs text-muted">
                  writes → its own memory
                </div>
              </div>
              <div className="text-center text-xs text-faint">no shared state</div>
              <div className="rounded bg-surface-raised p-2">
                <span className="font-mono text-xs">uvicorn app:app</span>
                <div className="mt-1 text-xs text-muted">
                  reads → an empty store
                </div>
              </div>
            </div>
          </div>
          <div className="rounded border border-brand/40 bg-brand-tint p-3">
            <p className="font-mono text-xs text-brand">✓ one interpreter</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="rounded bg-surface-raised p-2">
                <span className="font-mono text-xs">
                  import demo_seed → seed_demo_state()
                </span>
                <div className="mt-1 text-xs text-muted">
                  writes → module-level memory
                </div>
              </div>
              <div className="text-center text-xs text-faint">same process</div>
              <div className="rounded bg-surface-raised p-2">
                <span className="font-mono text-xs">TestClient(app)</span>
                <div className="mt-1 text-xs text-muted">
                  reads → the claim it just wrote
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">
          <code className="font-mono text-xs">src/claims_store.py</code> keeps
          state in module-level memory. A seeder run as a subprocess populates its
          own copy and the serving process still sees nothing. So the helper is{" "}
          <em>imported</em> by whoever holds the app — never executed as a
          subprocess. One of the {testCounts.demoSeed} tests drives the real API
          through <code className="font-mono text-xs">TestClient</code> and reads
          back the seeded claim, which is what proves this rather than asserts it.
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
          The contract suite denied everything <em>above</em> each ceiling using{" "}
          <code className="font-mono text-xs">&gt;</code>, and every fixture used
          score 82 — comfortably inside the waste band. Nothing sat on an edge, so
          an off-by-one tightening <code className="font-mono text-xs">&gt;</code>{" "}
          to <code className="font-mono text-xs">&gt;=</code> would have passed the
          whole suite. Drag the score across 71 and watch the category flip:
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

        <div className="mt-6">
          <h4 className={LABEL}>Cap clamp</h4>
          <div className="mt-3 flex flex-wrap items-end gap-4 text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted">shopper requested (¢)</span>
              <input
                type="number"
                value={requested}
                onChange={(e) => setRequested(Number(e.target.value))}
                className="w-28 rounded border border-border bg-transparent px-2 py-1 font-mono text-xs"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-muted">reviewer approved (¢)</span>
              <input
                type="number"
                value={approved}
                onChange={(e) => setApproved(Number(e.target.value))}
                className="w-28 rounded border border-border bg-transparent px-2 py-1 font-mono text-xs"
              />
            </label>
            <div
              className={`rounded px-3 py-2 font-mono text-xs ${
                clampReason === "accepted"
                  ? "border border-brand/40 bg-brand-tint text-brand"
                  : "border border-danger/40 bg-danger/5 text-danger"
              }`}
            >
              {clampReason === "accepted" ? `→ ${clamped}¢` : clampReason}
            </div>
          </div>
          <p className="mt-2 text-xs text-faint">
            Immutable ceilings: {PER_CLAIM_CEILING_CENTS}¢ per claim,{" "}
            {MONTHLY_CEILING_CENTS}¢ per rolling month. Effective policy may lower
            them, never raise them.
          </p>
        </div>

        <ul className="mt-6 space-y-2">
          {boundaryFixtures.map((f) => (
            <li key={f.name} className="rounded bg-surface-raised p-3 text-sm">
              <div className="font-mono text-xs text-brand">{f.name}</div>
              <div className="mt-1">{f.what}</div>
              <div className="mt-1 text-xs text-muted">{f.why}</div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm text-muted">
          Fixtures alone would have asserted nothing here — the rule engine returns{" "}
          <code className="font-mono text-xs">human_review</code> unconditionally
          and the sequence test skips{" "}
          <code className="font-mono text-xs">evidence_summary</code> as
          illustrative-only. So the contribution is three invariants as well:
          category must agree with the score band, both sides of 71 must stay
          covered, and each ceiling must be reachable rather than merely deniable.
          Contract suite {testCounts.contractBefore} →{" "}
          {testCounts.contractAfterBoundary} →{" "}
          <strong>{testCounts.contractNow}</strong> passing, run twice, identical.
          Mutation-checked: relabelling score 71 as{" "}
          <code className="font-mono text-xs">conversion</code> fails the new test.
        </p>
      </div>

      {/* ─── 5. Device finding ──────────────────────────────────────── */}
      <div className="rounded border border-danger/40 bg-danger/5 p-4">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-danger">
          Device finding — #119 · result {deviceFinding.result} ·{" "}
          {deviceFinding.severity}
        </h3>
        <p className="mt-3 text-sm">
          {deviceFinding.subject} was accepted without any quality check. The app
          returned:
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            ["classified as", deviceFinding.classified],
            ["days until expiry", String(deviceFinding.daysUntilExpiry)],
            ["XFS score", `${deviceFinding.xfsScore}%`],
          ].map(([k, v]) => (
            <div key={k} className="rounded bg-surface-raised p-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-faint">
                {k}
              </div>
              <div className="mt-1 font-mono text-sm">{v}</div>
            </div>
          ))}
        </div>
        <ul className="mt-3 space-y-1 text-sm text-muted">
          {deviceFinding.observations.map((o) => (
            <li key={o}>· {o}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm">
          Reported as <strong>{deviceFinding.result}</strong> rather than
          NOT_PRESENT: the failure is that an unusable image was accepted and given
          a confident verdict, not merely that a feature is missing. No
          image-quality gate or retake path was observed anywhere in the capture
          flow.
        </p>
      </div>

      {/* ─── 6. Score inversion ─────────────────────────────────────── */}
      <div className="rounded border border-warning/40 bg-warning/5 p-4">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-warning">
          Contract risk — the two score scales run opposite
        </h3>
        <div className="mt-4 space-y-4">
          <div>
            <div className="font-mono text-xs text-muted">
              FreshLens canonical
            </div>
            <div className="mt-1 h-3 w-full rounded-full bg-gradient-to-r from-brand to-danger" />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-faint">
              <span>0 · fresh</span>
              <span>{WASTE_BAND_MIN}–100 · waste</span>
            </div>
          </div>
          <div>
            <div className="font-mono text-xs text-muted">
              Xpired XFS, observed on device
            </div>
            <div className="mt-1 h-3 w-full rounded-full bg-gradient-to-r from-danger to-brand" />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-faint">
              <span>0 · spoiled</span>
              <span>100 · fresh</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm">
          The device said{" "}
          <em>
            &ldquo;your minimum freshness is {deviceFinding.xfsMinimumPreference}%,
            this scan is {deviceFinding.xfsScore}%&rdquo;
          </em>{" "}
          and recommended <strong>{deviceFinding.recommendation}</strong>. So XFS{" "}
          {deviceFinding.xfsScore} means <em>spoiled</em>, while a FreshLens score
          of {deviceFinding.xfsScore} means <em>fresh</em>. Wire the two together
          without an explicit adapter and fresh and waste swap places.
        </p>
        <p className="mt-2 text-sm text-muted">
          #129 §3 already requires one declared score direction and forbids any
          consumer silently inverting it — a host running the other way must use
          and test a named adapter. This is device evidence that the host does run
          the other way. Logged for the contract, not fixed here.
        </p>
      </div>

      {/* ─── 7. Honest status ───────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>Status</h3>
        <table className="mt-3 w-full text-sm">
          <tbody className="divide-y divide-border">
            {[
              ["#110 fixture CLI + `--output` (PR #141)", "VERIFIED", "brand"],
              ["#110 item 8 in-process seed helper (PR #151)", "VERIFIED", "brand"],
              ["#129 boundary fixtures + invariants (PR #148)", "VERIFIED", "brand"],
              ["#119 blurry/partial device scenario", "FAIL — reported", "danger"],
              [
                "#129 three-role golden-path integration",
                "PENDING — after #148/#150 land",
                "warning",
              ],
              [
                "#114 seed-dependent canonical label",
                "OPEN — awaiting owner confirmation",
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
