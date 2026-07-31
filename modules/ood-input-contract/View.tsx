"use client";

import { useState } from "react";
import { StatBars } from "@/components/StatBars";
import {
  synthesized,
  unfilled,
  proxies,
  gateCheck,
  selfCheck,
  digests,
  encoderRuntime,
  testCounts,
  recipe,
  weakClass,
} from "./data";

const CARD = "rounded border border-border p-4";
const LABEL =
  "font-mono text-xs font-medium uppercase tracking-widest text-muted";

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function View() {
  const [showDraft, setShowDraft] = useState(false);

  return (
    <section className="space-y-10">
      <p className="text-muted">
        A benchmark that cannot be graded yet still has to be trustworthy. This
        week froze the out-of-distribution benchmark&rsquo;s{" "}
        <em>input</em> contract, built the inputs that can be made honestly, and
        left the rest visibly empty. The validator returns a non-zero exit, and
        that is the finished state — not an unfinished one.
      </p>

      {/* ─── 1. Red on purpose ───────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>The gate is red, and here is exactly why</h3>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-mono text-3xl tabular-nums text-foreground">
            {gateCheck.passed}
            <span className="text-faint">/{gateCheck.total}</span>
          </span>
          <span className="font-mono text-xs text-danger">
            exit {gateCheck.exitCode}
          </span>
        </div>
        <ul className="mt-4 space-y-3">
          {gateCheck.failing.map((f) => (
            <li key={f.check} className="text-sm">
              <code className="font-mono text-xs text-danger">{f.check}</code>
              <p className="mt-1 text-muted">{f.why}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-border pt-3 text-sm text-muted">
          {selfCheck}
        </p>
        <p className="mt-3 text-sm text-muted">
          A structurally valid manifest exiting zero would be quotable as
          &ldquo;the OOD gate passes.&rdquo; Filling the approval block with
          empty strings does not satisfy the check, and neither does a filled
          block still marked <code className="font-mono text-xs">BLOCKED</code>.
          Red until a dated decision exists.
        </p>
      </div>

      {/* ─── 2. What could be built honestly ─────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className={CARD}>
          <StatBars title="Synthesized from a seed" rows={[...synthesized]} />
          <p className="mt-4 text-sm text-muted">
            Six of eleven categories need no photo, no network, and no decision.
            18 rows total.
          </p>
        </div>
        <div className={CARD}>
          <h3 className={LABEL}>Left at zero rows</h3>
          <ul className="mt-3 space-y-2">
            {unfilled.map((c) => (
              <li key={c} className="flex items-center gap-3 text-sm">
                <span className="font-mono text-xs text-warning">0</span>
                <span className="text-muted">{c}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            These need authorized photos. Synthesizing something that merely
            looked like coverage was the available shortcut, and it is the one
            thing this module refuses to do.
          </p>
        </div>
      </div>

      {/* ─── 3. Proxies that cannot pretend ──────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>Three of the six are proxies, and say so</h3>
        <ul className="mt-3 space-y-3">
          {proxies.map((p) => (
            <li key={p.category} className="text-sm">
              <code className="font-mono text-xs">{p.category}</code>
              <span className="text-muted">
                {" "}
                is {p.is} — <span className="text-warning">not</span> {p.isNot}.
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          Every proxy row carries a{" "}
          <code className="font-mono text-xs">PROXY:</code> prefix in the
          manifest, and a test fails if that label is ever dropped. They exercise
          frame-level shape, not adversarial strength.
        </p>
      </div>

      {/* ─── 4. Exact-hash evidence ──────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>Exact bytes, reproduced by someone else</h3>
        <ul className="mt-3 space-y-4">
          {digests.map((d) => (
            <li key={d.artifact}>
              <p className="text-sm text-foreground">{d.artifact}</p>
              <p className="mt-1 break-all font-mono text-xs text-brand">
                {d.sha256}
              </p>
              <p className="mt-1 text-sm text-muted">{d.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-border pt-3 text-sm text-muted">
          The OOD digest is hashed after normalizing CRLF to LF, so the same
          committed file reports one identity on Windows and POSIX — a fix that
          came out of review, after two reviewers got two different hashes for
          one unmodified file. Image bytes depend on the encoder, so the
          generator records its runtime —{" "}
          <code className="font-mono text-xs">{encoderRuntime}</code> — rather
          than claiming byte-identity on any machine.{" "}
          {testCounts.manifest + testCounts.fixtures} tests pin this.
        </p>
      </div>

      {/* ─── 5. Two numbers, one result ──────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>Recipe serving: the number that counts</h3>
        <div className="mt-3 flex items-baseline gap-6">
          <div>
            <p className="font-mono text-3xl tabular-nums text-foreground">
              {showDraft
                ? pct(recipe.draftCoverageAt1)
                : pct(recipe.gatingCoverageAt1)}
            </p>
            <p className="mt-1 text-sm text-muted">
              coverage@1 · floor {pct(recipe.coverageFloor)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDraft((v) => !v)}
            className="rounded border border-border px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-border-strong hover:text-foreground"
          >
            {showDraft ? "show the gating index" : "show the draft index"}
          </button>
        </div>
        <p className="mt-4 text-sm text-muted">
          {showDraft ? (
            <>
              <span className="text-warning">Not a result.</span> The draft index
              measures rows production withholds. It is reported because hiding
              it would be worse, and it must never appear in a sentence without
              this caveat.
            </>
          ) : (
            <>
              <span className="text-danger">
                {recipe.approvedRows} approved shopper-serving rows.
              </span>{" "}
              The corpus holds {recipe.corpusRows} rows, fingerprint{" "}
              <code className="font-mono text-xs">
                {recipe.corpusFingerprint}
              </code>
              , scored against {recipe.sceneCount} scenes (
              {recipe.scenesVersion}). Hard gates pass; zero approved rows means
              unserved, and the evaluator exits {recipe.exitCode}.
            </>
          )}
        </p>
      </div>

      {/* ─── 6. The weak class ───────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>One named weak class</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-mono text-3xl tabular-nums text-danger">
              {pct(weakClass.spoiledAccuracy)}
            </p>
            <p className="mt-1 text-sm text-muted">
              spoiled accuracy, {weakClass.bin}
            </p>
          </div>
          <div>
            <p className="font-mono text-3xl tabular-nums text-warning">
              {pct(weakClass.freshAccuracy)}
            </p>
            <p className="mt-1 text-sm text-muted">
              fresh accuracy, same bin · bar is {pct(weakClass.goBar)} on both
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted">{weakClass.detail}</p>
        <p className="mt-3 text-sm text-muted">{weakClass.consequence}</p>
        <p className="mt-3 text-sm text-muted">{weakClass.openQuestion}</p>
        <p className="mt-3 text-sm text-muted">
          From the committed calibration run over {weakClass.rows} rows against
          the real model — not the offline heuristic. Verdict:{" "}
          <code className="font-mono text-xs text-danger">
            {weakClass.verdict}
          </code>
          .
        </p>
      </div>

      {/* ─── 7. What is still missing ────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>What this does not show</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>
            No OOD or CV number. The evaluator and floor decision is unanswered,
            so no threshold has been chosen — and none will be chosen after
            seeing a held-out result.
          </li>
          <li>
            No detector. Nothing here makes a whole-scene or multi-item claim.
          </li>
          <li>
            The evidence determinism run needs calibration photos that are not in
            the repository, so a clean clone reproduces the OOD manifest but not
            that one.
          </li>
        </ul>
      </div>
    </section>
  );
}
