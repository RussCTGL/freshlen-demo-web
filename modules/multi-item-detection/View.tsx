import Image from "next/image";
import photo from "./multi-fruit.jpg";
import { image, kept, dropped, fallbackMatrix } from "./data";

const toneBorder = {
  success: "border-success",
  warning: "border-warning",
  danger: "border-danger",
} as const;

const toneChip = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
} as const;

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
        One photo in, N items out. <code>POST /api/scan/detect</code> (mode <code>after</code>)
        now runs a real pretrained YOLO model (<code>yolov8n</code>) instead of treating the
        whole image as one item. Every box below is the model&apos;s actual output on a repo
        fixture — no hand-drawn rectangles.
      </p>

      <figure className="space-y-2">
        <div className="relative overflow-hidden rounded-lg border border-border">
          <Image src={photo} alt="Basket scene: green apples and a pile of bananas" className="h-auto w-full" />
          {kept.map((item, i) => (
            <div
              key={i}
              className={`absolute rounded border-2 ${toneBorder[item.tone]}`}
              style={pct(item.box)}
            >
              <span
                className={`absolute -top-0.5 left-0 -translate-y-full rounded-t px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white ${toneChip[item.tone]}`}
              >
                {item.label} · {item.confidence.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <figcaption className="text-xs text-faint">
          Box borders are colored by the per-item freshness verdict (0 = fresh … 100 = urgent) —
          still the placeholder heuristic here; issue #53 swaps in the real ES scores.
        </figcaption>
      </figure>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Raw YOLO detections", value: kept.length + dropped.length },
          { label: "Filtered out", value: dropped.length },
          { label: "Items returned", value: kept.length },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">{s.label}</div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            What got filtered, and by which rule
          </h3>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {dropped.map((d, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-1.5 font-mono">{d.label}</td>
                  <td className="py-1.5 font-mono tabular-nums text-muted">{d.confidence.toFixed(2)}</td>
                  <td className="py-1.5 text-muted">{d.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-faint">
            The two people and the kettle behind the bananas never reach the scorer: only the 5
            COCO produce classes pass, and boxes under 0.40 confidence are dropped.
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            Fallback honesty across real photos
          </h3>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {fallbackMatrix.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-1.5 font-mono text-xs">{r.photo}</td>
                  <td className="py-1.5 text-muted">{r.found}</td>
                  <td
                    className={`py-1.5 font-mono text-xs ${
                      r.result === "real boxes" ? "text-success" : "text-faint"
                    }`}
                  >
                    {r.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-faint">
            The generic 3-column grid appears only when YOLO genuinely finds fewer than 2 items —
            it never masks a working detector. Without <code>ultralytics</code> installed the
            whole pipeline still runs on the single whole-image fallback.
          </p>
          <p className="mt-2 text-xs text-warning">
            Open question for the team: see the single-orange row — when YOLO finds exactly{" "}
            <em>one</em> real item, the current &quot;&lt; 2 items&quot; rule still swaps that real
            box for the fake grid. Spec-compliant today, but arguably a lone real detection should
            win. Left unchanged in #52; worth a deliberate decision.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          Fix shipped with this issue
        </p>
        <p className="mt-2">
          The scene scorer was letting the classifier&apos;s <code>&quot;unknown produce&quot;</code>{" "}
          no-answer sentinel overwrite YOLO&apos;s correct labels whenever no classifier backend
          was configured — every box came back &quot;unknown produce&quot;. The sentinel is now
          ignored, so the detector&apos;s label survives unless a real classification replaces it.
        </p>
      </div>
    </section>
  );
}
