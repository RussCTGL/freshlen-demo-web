"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import photo from "./multi-fruit.jpg";

type DemoMode = "before" | "scanning" | "after" | "review";
type Tone = "success" | "warning" | "danger" | "info";

type SceneItem = {
  label: string;
  state: string;
  freshness: number;
  tone: Exclude<Tone, "info">;
  box: [number, number, number, number];
  decision: string;
};

const image = { width: 1099, height: 400 };

const items: SceneItem[] = [
  {
    label: "banana",
    state: "eat soon",
    freshness: 45,
    tone: "warning",
    box: [685, 141, 328, 175],
    decision: "Use first today",
  },
  {
    label: "apple",
    state: "watch",
    freshness: 37,
    tone: "warning",
    box: [314, 64, 234, 235],
    decision: "Fine for lunchbox",
  },
  {
    label: "apple",
    state: "fresh",
    freshness: 29,
    tone: "success",
    box: [77, 74, 241, 233],
    decision: "Can wait",
  },
  {
    label: "apple",
    state: "Eat this week",
    freshness: 29,
    tone: "success",
    box: [0, 221, 233, 153],
    decision: "Eat this week",
  },
];

const toneBorder: Record<Exclude<Tone, "info">, string> = {
  success: "border-success",
  warning: "border-warning",
  danger: "border-danger",
};

const toneBg: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
};

const toneText: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

function pct(box: [number, number, number, number]) {
  const [x, y, w, h] = box;
  return {
    left: `${(x / image.width) * 100}%`,
    top: `${(y / image.height) * 100}%`,
    width: `${(w / image.width) * 100}%`,
    height: `${(h / image.height) * 100}%`,
  };
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-brand bg-brand text-white"
          : "border-border bg-surface text-muted hover:border-brand hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export default function View() {
  const [mode, setMode] = useState<DemoMode>("after");

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.freshness - a.freshness),
    [],
  );

  const visibleItems = mode === "before" ? [] : items;
  const isScanning = mode === "scanning";
  const isReview = mode === "review";

  return (
    <section className="space-y-8">
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              Issue #58
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Live whole-scene scanner UI</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              This module shows the Friday demo flow: one shopper photo becomes multiple scored
              produce items, with matching overlay colors and a worst-first action list. It uses a
              bundled sample so the page still works if the API is down.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ModeButton active={mode === "before"} onClick={() => setMode("before")}>
              Before
            </ModeButton>
            <ModeButton active={mode === "scanning"} onClick={() => setMode("scanning")}>
              Scanning
            </ModeButton>
            <ModeButton active={mode === "after"} onClick={() => setMode("after")}>
              After
            </ModeButton>
            <ModeButton active={mode === "review"} onClick={() => setMode("review")}>
              Human review
            </ModeButton>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">Shopper photo</h3>
              <p className="text-sm text-muted">
                Take or choose a photo, then scan the whole scene.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold text-brand">
                Bundled sample
              </span>
              <span className="rounded-full bg-surface-raised px-3 py-1 text-xs text-muted">
                Mobile-ready layout
              </span>
            </div>
          </div>

          <figure className="space-y-3">
            <div className="relative overflow-hidden rounded-lg border border-border bg-surface-raised">
              <Image
                src={photo}
                alt="A basket scene with apples and bananas"
                className={`h-auto w-full ${isScanning ? "opacity-50" : ""}`}
                priority
              />

              {mode === "before" && (
                <div className="absolute inset-[8%] rounded border-2 border-faint">
                  <span className="absolute left-0 top-0 rounded-br bg-faint px-2 py-1 font-mono text-xs font-semibold text-white">
                    produce 66
                  </span>
                </div>
              )}

              {visibleItems.map((item) => (
                <div
                  key={`${item.label}-${item.box.join("-")}`}
                  className={`absolute rounded border-2 ${toneBorder[item.tone]}`}
                  style={pct(item.box)}
                >
                  <span
                    className={`absolute left-0 top-0 rounded-br px-2 py-1 font-mono text-[11px] font-semibold text-white ${toneBg[item.tone]}`}
                  >
                    {item.label} {item.freshness}
                  </span>
                </div>
              ))}

              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/85">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-brand" />
                  <p className="font-mono text-sm font-semibold text-muted">Scanning...</p>
                </div>
              )}
            </div>
            <figcaption className="text-xs text-faint">
              Before shows the old single-item style. After shows the whole-scene overlay with
              one box per detected item.
            </figcaption>
          </figure>
        </div>

        <aside className="space-y-4 rounded-lg border border-border bg-surface p-4">
          <div>
            <h3 className="text-xl font-semibold">Eat me first</h3>
            <p className="mt-1 text-sm text-muted">
              Worst-first list uses the same color logic as the canvas overlay.
            </p>
          </div>

          {mode === "before" ? (
            <div className="rounded-lg border border-border bg-surface-raised p-4 text-sm text-muted">
              Single-item mode returns one broad result. The shopper cannot see which produce item
              needs attention first.
            </div>
          ) : isScanning ? (
            <div className="rounded-lg border border-border bg-surface-raised p-4 text-sm text-muted">
              Results will appear here as soon as scanning finishes.
            </div>
          ) : (
            <ul className="space-y-2">
              {sortedItems.map((item) => (
                <li
                  key={`${item.label}-${item.freshness}`}
                  className={`rounded-lg border border-border border-l-4 bg-surface-raised p-3 ${toneBorder[item.tone]}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${toneBg[item.tone]}`} />
                        <span className="font-medium">{item.label}</span>
                        <span className="text-xs text-muted">({item.state})</span>
                      </div>
                      <p className="mt-1 text-sm text-muted">{item.decision}</p>
                    </div>
                    <span className={`font-mono text-lg font-semibold ${toneText[item.tone]}`}>
                      {item.freshness}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {isReview && (
            <div className="rounded-lg border border-info/30 border-l-4 border-l-info bg-surface-raised p-4">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-info">
                Human-in-the-loop slot
              </p>
              <p className="mt-2 text-sm text-muted">
                This sample uses the real per-item verdicts. If a future response includes an
                uncertain item, this is the reserved place for the UI to say a human will verify it
                instead of showing a blank or overconfident verdict.
              </p>
            </div>
          )}

          <div className="rounded-lg border border-border bg-surface-raised p-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
              Fallback behavior
            </p>
            <p className="mt-2 text-sm text-muted">
              If the live API is unreachable during demo day, the bundled sample still shows the
              same overlay, color legend, and item list.
            </p>
          </div>
        </aside>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Upload", "Shopper starts with one obvious action: take or choose a photo."],
          ["Detect", "The whole scene returns per-item boxes instead of one broad result."],
          ["Act", "The list turns model scores into a simple next step for the shopper."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-lg border border-border bg-surface p-4">
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
