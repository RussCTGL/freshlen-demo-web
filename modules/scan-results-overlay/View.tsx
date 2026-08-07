"use client";

import { useState } from "react";

type DemoState = "loading" | "results" | "empty" | "error";

const states: { id: DemoState; label: string }[] = [
  { id: "loading", label: "Loading" },
  { id: "results", label: "Results" },
  { id: "empty", label: "Empty" },
  { id: "error", label: "API error" },
];

const items = [
  { name: "Leafy greens", score: 24, tone: "green", box: "left-[8%] top-[15%] h-[35%] w-[38%]" },
  { name: "Bananas", score: 66, tone: "amber", box: "right-[9%] top-[22%] h-[28%] w-[39%]" },
  { name: "Tomatoes", score: 88, tone: "red", box: "bottom-[10%] left-[28%] h-[31%] w-[44%]" },
] as const;

const tone = {
  green: { border: "border-emerald-400", bg: "bg-emerald-400", text: "text-emerald-300", soft: "bg-emerald-400/10" },
  amber: { border: "border-amber-400", bg: "bg-amber-400", text: "text-amber-300", soft: "bg-amber-400/10" },
  red: { border: "border-rose-400", bg: "bg-rose-400", text: "text-rose-300", soft: "bg-rose-400/10" },
} as const;

function PhoneDemo({ state }: { state: DemoState }) {
  return (
    <div className="mx-auto w-full max-w-[390px] rounded-[2.4rem] border border-border bg-[#07110d] p-3 shadow-2xl shadow-emerald-950/20">
      <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0c1813]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">FreshLens scan</p>
            <h3 className="mt-1 text-lg font-semibold text-white">What should I use first?</h3>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>

        <div className="p-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950 via-[#392d13] to-rose-950">
            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle at 25% 30%, #34d399 0 12%, transparent 13%), radial-gradient(circle at 72% 35%, #fbbf24 0 15%, transparent 16%), radial-gradient(circle at 50% 78%, #fb7185 0 17%, transparent 18%)" }} />

            {state === "results" && items.map((item) => (
              <div key={item.name} className={`absolute ${item.box} rounded-xl border-2 ${tone[item.tone].border}`}>
                <span className={`absolute left-0 top-0 rounded-br-lg px-2 py-1 font-mono text-[10px] font-bold text-slate-950 ${tone[item.tone].bg}`}>
                  {item.score}
                </span>
              </div>
            ))}

            {state === "loading" && (
              <div className="absolute inset-0 grid place-items-center bg-black/65 text-center backdrop-blur-sm">
                <div>
                  <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-emerald-300" />
                  <p className="mt-3 font-semibold text-white">Scanning your photo…</p>
                  <p className="mt-1 text-xs text-white/60">Finding produce and freshness signals</p>
                </div>
              </div>
            )}
          </div>

          {state === "results" && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-white">Found 3 items · most urgent first</p>
              {[...items].reverse().map((item) => (
                <div key={item.name} className={`flex items-center justify-between rounded-xl border ${tone[item.tone].border} ${tone[item.tone].soft} px-3 py-2.5`}>
                  <span className="text-sm font-medium text-white">{item.name}</span>
                  <span className={`font-mono text-sm font-bold ${tone[item.tone].text}`}>{item.score}</span>
                </div>
              ))}
            </div>
          )}

          {state === "empty" && (
            <div className="mt-4 rounded-2xl border border-dashed border-white/20 p-5 text-center">
              <p className="text-2xl">↻</p>
              <p className="mt-2 font-semibold text-white">No produce found</p>
              <p className="mt-1 text-sm text-white/60">Try a closer, brighter photo with the item fully in frame.</p>
              <button className="mt-4 w-full rounded-xl bg-emerald-300 px-4 py-2.5 text-sm font-semibold text-emerald-950">Choose another photo</button>
            </div>
          )}

          {state === "error" && (
            <div className="mt-4 rounded-2xl border border-rose-400/50 bg-rose-400/10 p-4">
              <p className="font-semibold text-rose-200">Scan unavailable</p>
              <p className="mt-1 text-sm text-white/70">We couldn&apos;t analyze this photo. Please try again.</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-rose-300">Displays json.message when status = error</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function View() {
  const [state, setState] = useState<DemoState>("results");

  return (
    <section className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,.95fr)] lg:items-center">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-success">Week 2 · Issue #5 · PR #15</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">One scan. Four honest states.</h2>
          <p className="mt-4 max-w-xl text-muted">
            My first FreshLens product contribution made the scan result readable at a glance. The same score-to-color rule now drives both the image boxes and the ordered result rows, while loading, no-result and API-error paths explain what is happening instead of leaving a blank screen.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {states.map((option) => (
              <button
                key={option.id}
                onClick={() => setState(option.id)}
                aria-pressed={state === option.id}
                className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${state === option.id ? "border-success bg-success/10 text-success" : "border-border bg-surface text-muted hover:border-success/50 hover:text-foreground"}`}
              >
                <span className="block font-mono text-[10px] uppercase tracking-wider opacity-60">State</span>
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-faint">Click each state to replay the shopper-facing behavior.</p>
        </div>

        <PhoneDemo state={state} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-faint">Visual mapping</p>
          <p className="mt-3 text-2xl font-semibold">Green → amber → red</p>
          <p className="mt-2 text-sm text-muted">Canvas boxes and result rows use the same score fallback, fixing the gray-box inconsistency found during AI review.</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-faint">Responsive boundary</p>
          <p className="mt-3 text-2xl font-semibold">Phone-width ready</p>
          <p className="mt-2 text-sm text-muted">The overlay, status text and recovery actions stay readable within an iPhone-scale viewport.</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-faint">Verification</p>
          <p className="mt-3 text-2xl font-semibold">57 passed · 1 skipped</p>
          <p className="mt-2 text-sm text-muted">Recorded in PR #15; commit <code>69e302d</code>, integrated into <code>main</code> through PR #26.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">Evidence boundary</p>
        <p className="mt-2 text-sm text-muted">
          This page reconstructs the shipped Week 2 interaction from Issue #5 and PR #15; it is not a live model inference. The original implementation consumed the scan API response, read <code>json.status</code> first, and surfaced <code>json.message</code> for errors.
        </p>
      </div>
    </section>
  );
}
