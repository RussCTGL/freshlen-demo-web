"use client";

// The whole Week-8 red-team story, told inside an iPhone so it reads like the real
// Expired Solutions app — not a wall of text. Two attacks, one honest limit.
// Every verdict shown here is a REAL tested outcome; the proof is linked under the phone
// (full matrix #207, scorecard #160). Nothing on the screen is invented.

import { useState } from "react";

type Verdict = {
  tone: "danger" | "warning";
  label: string; // the big stamp: BLOCKED / A HUMAN CHECKS
  sub: string; // one short line under the stamp
};

type Screen = {
  eyebrow: string;
  title: string;
  caption?: string; // at most one short line — keep the screen quiet
  visual: React.ReactNode;
  verdict?: Verdict;
  cta: string; // label on the advance button
};

// —— little illustrations, all CSS/emoji so there are no image assets to manage ——

function PhotoCard({ dim = false }: { dim?: boolean }) {
  return (
    <div
      className={`flex h-20 w-16 flex-col items-center justify-center rounded-lg border border-border bg-surface-raised ${
        dim ? "opacity-60" : ""
      }`}
    >
      <span className="text-2xl">🍓</span>
      <span className="mt-1 font-mono text-[9px] text-faint">9817e6…</span>
    </div>
  );
}

function IntroVisual() {
  return <div className="text-6xl">🔓</div>;
}

function DuplicateVisual() {
  return (
    <div className="flex items-center gap-3">
      <PhotoCard />
      <span className="text-lg text-danger">＝</span>
      <PhotoCard dim />
    </div>
  );
}

function ScreenPhotoVisual() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-4xl">📱</span>
      <span className="text-2xl text-warning">→</span>
      <div className="flex h-16 w-20 items-center justify-center rounded-md border-2 border-border bg-surface-raised">
        <span className="text-2xl">🍎</span>
      </div>
    </div>
  );
}

function ScoreVisual() {
  return (
    <div className="flex items-start gap-8">
      <div className="text-center">
        <div className="text-5xl font-bold tracking-tight text-success">34</div>
        <div className="mt-1 text-[10px] uppercase tracking-widest text-faint">tested · all held</div>
      </div>
      <div className="text-center">
        <div className="text-5xl font-bold tracking-tight text-warning">1</div>
        <div className="mt-1 text-[10px] uppercase tracking-widest text-faint">gap → a human</div>
      </div>
    </div>
  );
}

const SCREENS: Screen[] = [
  {
    eyebrow: "Week 8 · Red team",
    title: "I wrote 34 ways to cheat our refund.",
    caption: "What held — and the one that can't.",
    visual: <IntroVisual />,
    cta: "Start",
  },
  {
    eyebrow: "Attack 1",
    title: "Same photo, twice.",
    caption: "One receipt photo, sent in for two refunds.",
    visual: <DuplicateVisual />,
    verdict: {
      tone: "danger",
      label: "BLOCKED",
      sub: "We have seen this exact photo.",
    },
    cta: "Next attack",
  },
  {
    eyebrow: "Attack 2",
    title: "A photo of a photo.",
    caption: "A real apple — filmed off a screen.",
    visual: <ScreenPhotoVisual />,
    verdict: {
      tone: "warning",
      label: "A HUMAN CHECKS",
      sub: "Math can't tell. A person decides.",
    },
    cta: "So what's the point?",
  },
  {
    eyebrow: "The honest part",
    title: "Tamper-evident, not unforgeable.",
    caption:
      "The math catches reuse and tampering. It can't catch a real-looking fake — so a person does.",
    visual: <ScoreVisual />,
    cta: "Start over",
  },
];

const stampTone: Record<Verdict["tone"], string> = {
  danger: "border-danger/40 bg-danger/10 text-danger",
  warning: "border-warning/40 bg-warning/10 text-warning",
};

export default function View() {
  const [i, setI] = useState(0);
  const screen = SCREENS[i];
  const advance = () => setI((n) => (n + 1) % SCREENS.length);

  return (
    <section className="space-y-6">
      <p className="max-w-prose text-sm text-muted">
        The same story I&apos;d show on stage — inside the app, not a slide deck. Tap the phone to
        move through it.
      </p>

      {/* —— the phone —— */}
      <div className="flex justify-center">
        <div className="w-[300px] rounded-[2.5rem] border-[10px] border-neutral-900 bg-background shadow-2xl">
          {/* notch + status bar */}
          <div className="relative flex h-8 items-center justify-between rounded-t-[1.7rem] px-6 pt-1">
            <span className="font-mono text-[11px] text-muted">9:41</span>
            <div className="absolute left-1/2 top-0 h-4 w-24 -translate-x-1/2 rounded-b-2xl bg-neutral-900" />
            <span className="text-[11px] text-muted">▮▮▮ 􀛨</span>
          </div>

          {/* screen — one tap advances */}
          <button
            type="button"
            onClick={advance}
            className="flex h-[460px] w-full cursor-pointer flex-col items-center justify-between px-6 py-8 text-center transition-colors hover:bg-surface/40"
            aria-label={`${screen.title} — tap to continue`}
          >
            <span className="text-xs font-medium uppercase tracking-widest text-faint">
              {screen.eyebrow}
            </span>

            <div className="flex flex-col items-center gap-6">
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-foreground">
                {screen.title}
              </h2>
              <div className="flex min-h-[80px] items-center justify-center">{screen.visual}</div>
              {screen.verdict && (
                <div
                  className={`flex flex-col items-center gap-1 rounded-xl border px-5 py-3 ${
                    stampTone[screen.verdict.tone]
                  }`}
                >
                  <span className="text-base font-bold tracking-wide">{screen.verdict.label}</span>
                  <span className="text-xs opacity-80">{screen.verdict.sub}</span>
                </div>
              )}
              {screen.caption && (
                <p className="max-w-[220px] text-sm text-muted">{screen.caption}</p>
              )}
            </div>

            <span className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">
              {screen.cta}
            </span>
          </button>

          {/* home bar */}
          <div className="flex h-6 items-center justify-center rounded-b-[1.7rem]">
            <div className="h-1 w-28 rounded-full bg-border-strong" />
          </div>
        </div>
      </div>

      {/* progress dots */}
      <div className="flex justify-center gap-2">
        {SCREENS.map((_, n) => (
          <span
            key={n}
            className={`h-1.5 rounded-full transition-all ${
              n === i ? "w-6 bg-foreground" : "w-1.5 bg-border-strong"
            }`}
          />
        ))}
      </div>

      {/* honesty footer — the details live in a URL, not on the screen (per demo feedback) */}
      <div className="space-y-2 border-t border-border pt-4 text-center text-xs text-faint">
        <p>
          Every verdict above is a real tested outcome. Full 34-attack matrix:{" "}
          <a
            className="underline hover:text-muted"
            href="https://github.com/LawrenceHua/es-intern-freshlens/pull/228"
            target="_blank"
            rel="noreferrer"
          >
            #207
          </a>{" "}
          · red-team scorecard:{" "}
          <a
            className="underline hover:text-muted"
            href="https://github.com/LawrenceHua/es-intern-freshlens/pull/240"
            target="_blank"
            rel="noreferrer"
          >
            #160
          </a>
          . Tamper-evident, not unforgeable.
        </p>
        <p>
          And on the real iPhone build (4.3.3) the same posture holds: the flow{" "}
          <span className="text-muted">fails closed to human review</span> — device proof in{" "}
          <a className="underline hover:text-muted" href="/native-shopper-claim">
            Ziyun&apos;s device journey (#159)
          </a>
          .
        </p>
      </div>
    </section>
  );
}
