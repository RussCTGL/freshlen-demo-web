"use client";

import { useState } from "react";
import {
  pages,
  alsoTested,
  deviceFinding,
  toneText,
  toneBorder,
  toneChipBg,
  type GuardTest,
} from "./data";

type Phase = "idle" | "working" | "done";

export default function View() {
  const [pageIdx, setPageIdx] = useState(0);
  const [activeTest, setActiveTest] = useState<GuardTest | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  const page = pages[pageIdx];

  function goto(i: number) {
    setPageIdx(i);
    setActiveTest(null);
    setPhase("idle");
  }

  function next() {
    goto((pageIdx + 1) % pages.length);
  }

  function runTest(t: GuardTest) {
    setActiveTest(t);
    setPhase("working");
    window.setTimeout(() => setPhase("done"), 600);
  }

  function backToPage() {
    setActiveTest(null);
    setPhase("idle");
  }

  const pill =
    activeTest && phase === "done"
      ? { label: activeTest.result.pill, tone: activeTest.result.tone }
      : page.statusPill;

  return (
    <section className="space-y-8">
      <p className="text-muted">
        My <code>#112</code> work is <strong>43 offline tests</strong> that guard the whole claim
        journey. So this is the <strong>real FreshLens flow, rebuilt as a walkable site</strong> —
        step through it like a shopper, and on every page press <strong>🧪 Test this page</strong>{" "}
        to fire the guardrail that lives there and see exactly what happens, plus the test that
        proves it.
      </p>

      {/* step rail */}
      <div className="flex flex-wrap items-center gap-1.5">
        {pages.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => goto(i)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
              i === pageIdx
                ? "border-brand/40 bg-brand-tint font-medium text-brand"
                : "border-border text-muted hover:bg-surface-raised"
            }`}
          >
            {p.step.replace("STEP ", "")}. {p.title.split(" ").slice(0, 2).join(" ")}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* ---------- the app ---------- */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          {/* top bar */}
          <div className="flex items-center justify-between border-b border-border bg-brand-tint/40 px-4 py-2.5">
            <span className="font-mono text-xs font-semibold tracking-wide text-brand">
              🌿 FreshLens
            </span>
            {pill && (
              <span
                className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-white ${toneChipBg[pill.tone]}`}
              >
                {pill.label}
              </span>
            )}
          </div>

          <div className="p-5">
            {/* eyebrow + persona */}
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-brand">
                {page.eyebrow}
              </p>
              <span className="rounded-full bg-surface-raised px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-faint">
                {page.persona}
              </span>
            </div>

            {!activeTest ? (
              /* ---- normal page ---- */
              <>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-faint">
                  {page.step}
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight">{page.title}</h3>
                <p className="mt-2 text-sm text-muted">{page.blurb}</p>
                <p className="mt-4 whitespace-pre-line rounded-lg bg-surface-raised p-3 text-sm">
                  {page.body}
                </p>

                <button
                  type="button"
                  onClick={next}
                  className="mt-5 w-full rounded-xl bg-brand py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
                >
                  {page.primary}
                </button>

                {/* test buttons */}
                <div className="mt-5 border-t border-border pt-4">
                  <p className="mb-2 text-center font-mono text-[11px] uppercase tracking-widest text-faint">
                    — or test this page —
                  </p>
                  <div className="space-y-2">
                    {page.tests.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => runTest(t)}
                        className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-left text-sm text-muted transition hover:border-brand/40 hover:bg-surface-raised"
                      >
                        <span>🧪</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* ---- test result screen ---- */
              <div className="mt-3">
                {phase === "working" ? (
                  <p className="py-16 text-center font-mono text-sm text-warning animate-pulse">
                    running the test…
                  </p>
                ) : (
                  <div
                    className={`flex flex-col items-center rounded-xl border ${toneBorder[activeTest.result.tone]} border-dashed p-6 text-center`}
                  >
                    <div className="text-4xl">{activeTest.result.icon}</div>
                    <span
                      className={`mt-3 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-white ${toneChipBg[activeTest.result.tone]}`}
                    >
                      {activeTest.result.pill}
                    </span>
                    <p className={`mt-3 text-base font-semibold ${toneText[activeTest.result.tone]}`}>
                      {activeTest.result.title}
                    </p>
                    <p className="mt-2 text-sm text-muted">{activeTest.result.body}</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={backToPage}
                  className="mt-4 w-full rounded-xl border border-border py-2.5 text-center font-mono text-xs text-muted hover:bg-surface-raised"
                >
                  ← back to {page.step}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---------- explanation ---------- */}
        <div className="flex flex-col justify-center space-y-4">
          {activeTest && phase === "done" ? (
            <>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-faint">
                  why it&apos;s safe
                </p>
                <p className="mt-1 text-sm text-muted">{activeTest.why}</p>
              </div>
              <div className={`rounded-lg border-l-4 ${toneBorder[activeTest.result.tone]} border-y border-r border-border bg-surface-raised p-4`}>
                <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
                  proven offline by · {activeTest.buildStep}
                </p>
                <p className="mt-1 font-mono text-xs text-brand-strong break-words">
                  {activeTest.test}
                </p>
                <p className="mt-2 font-mono text-[11px] text-muted break-words">
                  {activeTest.proof}
                </p>
              </div>
              {activeTest.dependsOn && (
                <p className="text-xs text-muted">
                  🤝 <span className="text-faint">Builds on</span>{" "}
                  {activeTest.dependsOn.map((d, i) => (
                    <span key={d.issue}>
                      {i > 0 && " · "}
                      <span className="font-medium text-brand">{d.who}</span>&apos;s #{d.issue}
                    </span>
                  ))}
                </p>
              )}
            </>
          ) : (
            <>
              <div className="rounded-lg border border-dashed border-border p-5">
                <p className="font-mono text-xs uppercase tracking-widest text-faint">
                  {page.persona} journey · {page.step}
                </p>
                <p className="mt-2 text-sm text-muted">
                  Press <span className="font-semibold text-brand">{page.primary}</span> to walk the
                  journey, or a <span className="font-semibold">🧪</span> button to test what this
                  page guarantees.
                </p>
              </div>

              {page.credits.length > 0 && (
                <div className="rounded-lg border border-border bg-surface-raised p-4">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-faint">
                    🤝 This page builds on
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted">
                    {page.credits.map((c) => (
                      <li key={c.issue}>
                        <span className="font-medium text-brand">{c.who}</span>{" "}
                        <span className="font-mono text-faint">#{c.issue}</span> — {c.what}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <p className="text-xs text-faint">
        {alsoTested} Every result is a recorded assertion from{" "}
        <code>tests/test_claim_e2e.py</code> (issue <code>#112</code>, PR <code>#145</code>,
        merged), run fully offline — no ES token, model key, or internet required.
      </p>

      {/* #119 physical-device finding — the same double-tap, on the real iOS beta */}
      <div className="space-y-4 rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-brand">
              📱 Device finding · #119 · real iOS app
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">
              I also tested this double-tap on the real Xpired iOS beta
            </h3>
          </div>
          <span className="shrink-0 rounded-full bg-brand px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
            {deviceFinding.resultPill}
          </span>
        </div>

        <p className="font-mono text-[11px] text-faint">{deviceFinding.device}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-surface-raised p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-warning">
              The boundary · NOT_PRESENT
            </p>
            <p className="mt-2 text-sm text-muted">{deviceFinding.boundary}</p>
          </div>
          <div className="rounded-lg bg-surface-raised p-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-success">
              What I tested · PASS
            </p>
            <p className="mt-2 text-sm text-muted">{deviceFinding.tested}</p>
          </div>
        </div>

        <div className="rounded-lg border-l-4 border-brand border-y border-r border-border bg-surface-raised p-4">
          <p className="text-sm text-muted">🔗 {deviceFinding.tie}</p>
        </div>

        <p className="text-xs text-faint">{deviceFinding.result}</p>
      </div>
    </section>
  );
}
