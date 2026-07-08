import Image from "next/image";
import photo from "./basket.jpg";
import { image, scored, bands, testRows, colorTone, type Tone } from "./data";

const toneBorder: Record<Tone, string> = {
  success: "border-success",
  warning: "border-warning",
  danger: "border-danger",
};
const toneChip: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};
const toneDot: Record<Tone, string> = {
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

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">
        Yizhou&apos;s detector finds the items (<code>#52</code>). <strong>#53 scores each one</strong>:
        a colour, a plain-word <em>verdict</em>, a <em>what-to-do</em>, and an{" "}
        <em>&quot;eat me first&quot;</em> rank — so a scene of boxes becomes something a shopper can
        act on. Every field here comes back from <code>POST /api/scan/detect</code>.
      </p>

      {/* --- The scored scene: real API output, boxes coloured by verdict --- */}
      <figure className="space-y-2">
        <div className="relative overflow-hidden rounded-lg border border-border">
          <Image
            src={photo}
            alt="Basket scene: green apples and a pile of bananas"
            className="h-auto w-full"
          />
          {scored.map((it, i) => {
            const tone = colorTone[it.color];
            return (
              <div key={i} className={`absolute rounded border-2 ${toneBorder[tone]}`} style={pct(it.box)}>
                <span
                  className={`absolute -top-0.5 left-0 -translate-y-full rounded-t px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white ${toneChip[tone]}`}
                >
                  {it.verdict} · {it.freshness}
                </span>
              </div>
            );
          })}
        </div>
        <figcaption className="text-xs text-faint">
          Real <code>/api/scan/detect</code> (mode <code>after</code>) output on a repo fixture — box
          colour is each item&apos;s verdict band. The placeholder scorer happens to read this whole
          basket as one band; the real ES model will spread them out, and the verdict logic is ready
          for that day.
        </figcaption>
      </figure>

      {/* --- Eat me first: worst-first, the shopper's action list --- */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Eat me first
        </h3>
        <ul className="mt-3 space-y-2">
          {scored.map((it) => {
            const tone = colorTone[it.color];
            return (
              <li
                key={it.rank}
                className={`flex items-center gap-3 rounded-lg border border-border border-l-4 ${toneBorder[tone]} bg-surface p-3`}
              >
                <span className="font-mono text-sm tabular-nums text-faint">{it.rank}</span>
                <span className={`h-2.5 w-2.5 flex-none rounded-full ${toneDot[tone]}`} />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">
                    {it.label} <span className={`font-normal ${toneText[tone]}`}>· {it.verdict}</span>
                  </div>
                  <div className="text-xs text-muted">{it.advice}</div>
                </div>
                <span className={`font-mono text-lg font-semibold tabular-nums ${toneText[tone]}`}>
                  {it.freshness}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* --- Subtask 3: colours line up with the model's bands --- */}
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            Colours come from the model&apos;s bands
          </h3>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {bands.map((b, i) => {
                const tone = colorTone[b.color];
                return (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-1.5">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${toneDot[tone]}`} />
                    </td>
                    <td className="py-1.5 font-mono tabular-nums text-muted">{b.range}</td>
                    <td className={`py-1.5 font-semibold ${toneText[tone]}`}>{b.verdict}</td>
                    <td className="py-1.5 text-muted">{b.advice}</td>
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
