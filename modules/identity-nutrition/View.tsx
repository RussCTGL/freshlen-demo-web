"use client";

import { useState } from "react";
import {
  states,
  failClosedLines,
  NUTRITION_DISCLAIMER,
  nutritionFields,
  nutritionFailureModes,
  takeaways,
  statusRows,
} from "./data";

const CARD = "rounded border border-border p-4";
const LABEL =
  "font-mono text-xs font-medium uppercase tracking-widest text-muted";

const TONE_BORDER: Record<string, string> = {
  brand: "border-t-brand",
  danger: "border-t-danger",
  warning: "border-t-warning",
  muted: "border-t-border-strong",
};
const TONE_BADGE: Record<string, string> = {
  brand: "border-brand/40 bg-brand-tint text-brand",
  danger: "border-danger/40 bg-danger/10 text-danger",
  warning: "border-warning/40 bg-warning/10 text-warning",
  muted: "border-border-strong bg-surface-raised text-muted",
};
const STATUS_TONE: Record<string, string> = {
  brand: "text-brand",
  danger: "text-danger",
  warning: "text-warning",
};

export default function View() {
  const [active, setActive] = useState(states[0].key);
  const current = states.find((s) => s.key === active)!;

  return (
    <section className="space-y-10">
      {/* ─── 1. The problem ─────────────────────────────────────────── */}
      <p className="text-muted">
        A raw classifier result is <code className="font-mono text-xs">match: true | false | null</code>{" "}
        plus a <code className="font-mono text-xs">reason</code> string — not something a
        shopper or reviewer should read directly. This maps that result to exactly five
        deterministic display states, never a sixth, and never an inferred match.
      </p>

      {/* ─── 2. The five states ─────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>Five states, one pure mapping</h3>
        <p className="mt-3 text-sm text-muted">
          Click a state to see the exact identity_result that produces it, and the verbatim
          shopper copy that ships in <code className="font-mono text-xs">src/classify.py</code>.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          {states.map((s) => (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`rounded border px-3 py-1 font-mono text-xs transition ${
                active === s.key
                  ? TONE_BADGE[s.tone]
                  : "border-border text-muted hover:border-border-strong"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-lg border-t-4 bg-surface-raised p-4 ${TONE_BORDER[current.tone]}`}>
          <span
            className={`inline-block rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-widest ${TONE_BADGE[current.tone]}`}
          >
            {current.label}
          </span>
          <div className="mt-3 space-y-1 font-mono text-xs text-faint">
            <div>match: {current.match}</div>
            {current.reason && <div>reason: {current.reason}</div>}
            {current.predicted && <div>predicted: {current.predicted}</div>}
            {current.expected && <div>expected: {current.expected}</div>}
            {current.confidence && <div>confidence: {current.confidence}</div>}
          </div>
          <p className="mt-3 text-sm">
            {current.shopperText ? (
              <span>&ldquo;{current.shopperText}&rdquo;</span>
            ) : (
              <span className="text-muted">No panel shown — omitted rather than displayed empty.</span>
            )}
          </p>
          <p className="mt-2 text-xs text-muted">{current.note}</p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {states.map((s) => (
            <div key={s.key} className={`rounded border-t-4 bg-surface-raised p-3 ${TONE_BORDER[s.tone]}`}>
              <div className="font-mono text-[10px] uppercase tracking-wider text-faint">{s.label}</div>
              <div className="mt-1 text-xs text-muted">
                {s.shopperText ? `${s.shopperText.slice(0, 42)}…` : "panel omitted"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 3. Fail-closed ─────────────────────────────────────────── */}
      <div className="rounded border border-brand/40 bg-brand-tint p-4">
        <h3 className={LABEL}>Fail-closed, by construction</h3>
        {failClosedLines.map((line) => (
          <p key={line} className="mt-2 text-lg font-bold tracking-tight text-brand-strong">
            &ldquo;{line}&rdquo;
          </p>
        ))}
        <p className="mt-3 text-sm text-muted">
          Only a strict <code className="font-mono text-xs">match === true</code> or{" "}
          <code className="font-mono text-xs">match === false</code> ever produces Matched or
          Mismatch. Everything else — including a corrupted non-boolean, non-null{" "}
          <code className="font-mono text-xs">match</code>, or a reason this mapping has never
          seen — fails closed to Uncertain or Unavailable. Nothing here says the model
          &ldquo;confirmed,&rdquo; &ldquo;proved,&rdquo; or &ldquo;verified&rdquo; an identity;
          policy still routes every case to human review under the current calibration gate.
        </p>
      </div>

      {/* ─── 4. Nutrition reference ─────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>Nutrition reference</h3>
        <p className="mt-3 text-sm text-muted">
          A capability-gated, read-only view model — consumed only through the shared proxy
          client, only when <code className="font-mono text-xs">/capabilities</code> explicitly
          advertises the route. Never called from claim-handling code; never affects the claim,
          evidence gate, decision, or a retry.
        </p>

        <div className="mt-4 rounded border border-warning/40 bg-warning/10 p-3">
          <p className="font-medium text-warning">&ldquo;{NUTRITION_DISCLAIMER}&rdquo;</p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className={LABEL}>Allowlisted fields (names only)</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {nutritionFields.map((f) => (
                <span key={f} className="rounded bg-surface-raised px-2 py-1 font-mono text-xs text-muted">
                  {f}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted">
              No numeric values shown here — no live nutrition schema capture is committed
              evidence yet.
            </p>
          </div>
          <div>
            <h4 className={LABEL}>Fails closed to &ldquo;omitted&rdquo; on</h4>
            <ul className="mt-2 space-y-1 text-xs text-muted">
              {nutritionFailureModes.map((m) => (
                <li key={m}>· {m}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted">
          Today&rsquo;s honest default is <strong>unavailable</strong> — no route yet exposes
          this to the browser, so the panel is silently omitted rather than shown broken or
          guessed.
        </p>
      </div>

      {/* ─── 5. Takeaways ───────────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>Takeaways</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {takeaways.map((t, i) => (
            <div key={t.title} className="rounded bg-surface-raised p-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-tint font-mono text-xs font-bold text-brand">
                {i + 1}
              </div>
              <h4 className="mt-3 text-sm font-semibold">{t.title}</h4>
              <p className="mt-1 text-xs text-muted">{t.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 6. Status ──────────────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>Status</h3>
        <table className="mt-3 w-full text-sm">
          <tbody className="divide-y divide-border">
            {statusRows.map(([what, status, tone]) => (
              <tr key={what}>
                <td className="py-2 pr-4">{what}</td>
                <td className={`py-2 text-right font-mono text-xs ${STATUS_TONE[tone]}`}>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
