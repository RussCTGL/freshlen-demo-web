import { StatBars } from "@/components/StatBars";
import { scored, backend, confidence, quality, canonicalBuckets } from "./data";

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-gray-600 dark:text-gray-300">
        Each of the {scored} dataset photos was scored through the ES freshness model via the
        read-only proxy (<code>backend={backend}</code>). The raw model reads{" "}
        <strong>high = fresh</strong>; the adapter inverts it to the FreshLens canonical scale{" "}
        <strong>0 = fresh … 100 = urgent</strong> before anything downstream sees it.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Scored", value: scored },
          { label: "Mean confidence", value: confidence.mean.toFixed(3) },
          { label: "Confidence range", value: `${confidence.min}–${confidence.max}` },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-black/10 p-4 dark:border-white/15">
            <div className="text-2xl font-semibold tabular-nums">{s.value}</div>
            <div className="mt-1 text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <StatBars title="quality_category" rows={quality} />
        <StatBars title="Canonical score bucket" rows={canonicalBuckets} />
      </div>

      <p className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-900 dark:text-amber-200">
        <strong>Finding to flag for the gate (#33):</strong> 153 of 154 photos landed in the
        fresh half of the canonical scale — including the 45 labeled <code>spoiled</code> — at a
        mean confidence of {confidence.mean}. The model is confidently reluctant to call things
        spoiled on real phone photos, which is exactly what the calibration gate must weigh.
      </p>
    </section>
  );
}
