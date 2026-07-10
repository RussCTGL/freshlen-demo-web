"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import photo from "./green-apples.jpg";
import { image, scored, bands, testRows, colorTone, type Mode, type Tone } from "./data";

const toneBorder: Record<Tone, string> = {
  success: "border-success",
  warning: "border-warning",
  danger: "border-danger",
};
const toneBg: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};
const toneText: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

/** Pixel box → percentage offsets so the overlay scales with the photo. */
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
  // #53: the SAME score speaks to two audiences — a shopper word ("Eat soon") and a store
  // action ("Small discount"). The toggle switches the verdict column without a re-scan.
  const [mode, setMode] = useState<Mode>("shopper");

  // Worst-first: highest urgency on top. The data already comes back ranked, but sorting here
  // keeps the list honest if the array is ever reordered.
  const items = useMemo(() => [...scored].sort((a, b) => b.freshness - a.freshness), []);

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <p className="max-w-3xl text-muted">
          Yizhou&apos;s detector finds the items (<code>#52</code>). <strong>#53 scores each one</strong>:
          a colour, a plain-word <em>verdict</em>, a <em>what-to-do</em>, and an{" "}
          <em>&quot;eat me first&quot;</em> rank — so a scene of boxes becomes something a shopper can
          act on. Every field comes back from <code>POST /api/scan/detect</code>.
        </p>
        <div className="flex flex-none gap-2">
          <ModeButton active={mode === "shopper"} onClick={() => setMode("shopper")}>
            Shopper
          </ModeButton>
          <ModeButton active={mode === "store"} onClick={() => setMode("store")}>
            Store
          </ModeButton>
        </div>
      </div>

      {/* --- The scored scene: real API output, boxes coloured by verdict --- */}
      <figure className="space-y-2">
        <div className="relative overflow-hidden rounded-lg border border-border">
          <Image
            src={photo}
            alt="A tray of green apples with one visibly rotten apple"
            className="h-auto w-full"
            priority
          />
          {items.map((it) => {
            const tone = colorTone[it.color];
            return (
              <div key={it.n} className={`absolute rounded border-2 ${toneBorder[tone]}`} style={pct(it.box)}>
                <span
                  className={`absolute left-0 top-0 rounded-br px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white ${toneBg[tone]}`}
                >
                  {it.freshness}
                </span>
              </div>
            );
          })}
        </div>
        <figcaption className="text-xs text-faint">
          Real <code>/api/scan/detect</code> (mode <code>after</code>) output — box colour is each
          item&apos;s verdict band. The one rotten apple lands in the red band; the healthy greens all
          read amber because the <em>placeholder</em> scorer clusters them — the real ES model will
          spread them out, and the verdict logic is ready for that day.
        </figcaption>
      </figure>

      {/* --- Eat me first: worst-first, the shopper's (or store's) action list --- */}
      <div>
        <div className="flex items-baseline justify-between">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            Eat me first
          </h3>
          <span className="text-xs text-muted">
            {mode === "store" ? "store action" : "shopper verdict"}
          </span>
        </div>
        <ul className="mt-3 space-y-2">
          {items.map((it) => {
            const tone = colorTone[it.color];
            const verdict = mode === "store" ? it.storeVerdict : it.verdict;
            return (
              <li
                key={it.n}
                className={`flex items-center gap-3 rounded-lg border border-border border-l-4 ${toneBorder[tone]} bg-surface p-2.5`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <span className={`h-2.5 w-2.5 flex-none rounded-full ${toneBg[tone]}`} />
                  <span className="truncate font-semibold">Apple {it.n}</span>
                </div>
                <span className={`flex-1 text-center text-sm font-bold ${toneText[tone]}`}>
                  {verdict}
                </span>
                <div className="flex flex-none flex-col items-center">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-sm font-bold tabular-nums text-white ${toneBg[tone]}`}
                  >
                    {it.freshness}
                  </span>
                  <span className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-faint">
                    score
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-xs text-faint">
          Same scores, two audiences: the shopper sees a plain freshness word, the store sees the
          action to take — one toggle, no re-scan. The internal category (&quot;markdown&quot;) never
          reaches either screen.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* --- Subtask 3: colours + words line up with the model's bands --- */}
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            Colours come from the model&apos;s bands
          </h3>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {bands.map((b, i) => {
                const tone = colorTone[b.color];
                const verdict = mode === "store" ? b.storeVerdict : b.verdict;
                return (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-1.5">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${toneBg[tone]}`} />
                    </td>
                    <td className="py-1.5 font-mono tabular-nums text-muted">{b.range}</td>
                    <td className={`py-1.5 font-semibold ${toneText[tone]}`}>{verdict}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-faint">
            Every colour and word is derived from <code>freshness.quality_for</code> — one source of
            truth, with no hardcoded 70/71 cutoff (the Week-2 inversion hazard). Coordinated with the
            score-boundary fix in the Decisions Log.
          </p>
        </div>

        {/* --- Subtask 4: a REAL test, shown as a table --- */}
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            The real test that guards this
          </h3>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-faint">
                <th className="py-1.5 font-medium">score in</th>
                <th className="py-1.5 font-medium">rank</th>
                <th className="py-1.5 font-medium">colour</th>
                <th className="py-1.5 font-medium">verdict</th>
                <th className="py-1.5 font-medium" aria-label="passes" />
              </tr>
            </thead>
            <tbody>
              {testRows.map((r, i) => {
                const tone = colorTone[r.color];
                return (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-1.5 font-mono tabular-nums">{r.score}</td>
                    <td className="py-1.5 font-mono tabular-nums text-muted">{r.rank}</td>
                    <td className={`py-1.5 font-mono ${toneText[tone]}`}>{r.color}</td>
                    <td className="py-1.5">{r.verdict}</td>
                    <td className="py-1.5 text-success">✓</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-faint">
            A <em>real</em> end-to-end test (<code>test_scan_verdicts.py</code>): three known scores go
            through <code>/api/scan/detect</code> and the exact rank order, colours and verdicts are
            asserted — not a smoke test. It also pins the band edges (25/26, 70/71) so a future edit
            can&apos;t silently flip the order back.
          </p>
        </div>
      </div>
    </section>
  );
}
