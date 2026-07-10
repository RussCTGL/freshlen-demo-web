import { StatBars } from "@/components/StatBars";
import {
  scored,
  backend,
  gate,
  beforeAfter,
  quality,
  qualityBefore,
  dataQualityAnomaly,
} from "./data";

const changeColor: Record<string, string> = {
  worse: "text-danger",
  "much worse": "text-danger font-semibold",
  unchanged: "text-faint",
};

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">
        The ES proxy shipped a &ldquo;fail-safe serving&rdquo; upgrade after Week 3&rsquo;s
        calibration gate first ran (PR #49, <code>RE-SCOPE</code>). Issue #55 re-ran the exact
        same {scored}-photo gold set — manifest-verified against the shipped{" "}
        <code>gold_manifest.csv</code> — through the upgraded model (
        <code>backend={backend}</code>) to check whether the verdict still holds.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Photos re-scored", value: scored },
          { label: "Gate, before", value: "RE-SCOPE" },
          { label: "Gate, after", value: gate },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">
              {s.label}
            </div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Week 3 vs. upgraded model — same dataset, same gate
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-mono text-xs uppercase tracking-wide text-faint">
                <th className="py-1 pr-4 font-medium">metric</th>
                <th className="py-1 pr-4 font-medium">week 3 (pre-upgrade)</th>
                <th className="py-1 pr-4 font-medium">re-run (post-upgrade)</th>
                <th className="py-1 font-medium">change</th>
              </tr>
            </thead>
            <tbody>
              {beforeAfter.map((r) => (
                <tr key={r.metric} className="border-t border-border">
                  <td className="py-1.5 pr-4 text-muted">{r.metric}</td>
                  <td className="py-1.5 pr-4 font-mono tabular-nums text-faint">{r.before}</td>
                  <td className="py-1.5 pr-4 font-mono tabular-nums text-muted">{r.after}</td>
                  <td className={`py-1.5 font-mono text-xs uppercase ${changeColor[r.change]}`}>
                    {r.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <StatBars title="quality_category, before (Week 3)" rows={qualityBefore} />
        <StatBars title="quality_category, after (re-run)" rows={quality} />
      </div>

      <div className="rounded-lg border border-danger/30 border-l-4 border-l-danger bg-danger/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-danger">
          Finding · gate stays RE-SCOPE
        </p>
        <p className="mt-2">
          The upgrade did <strong>not</strong> fix the original blocker: truly spoiled images
          still never land in <code>conversion</code> or <code>waste</code> at any confidence
          level, so the auto-approve path stays unreachable (0.0% at every threshold, both runs).
          What it did change is the fresh side — genuinely fresh items are now demoted into{" "}
          <code>markdown</code> far more often, crashing high-confidence fresh accuracy from
          93.8% to 39.6%. Net effect: less fresh-side precision, no gain on the spoiled side.
        </p>
      </div>

      <div className="rounded border border-border px-4 py-3 text-sm">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Data-quality note (upstream ES, not our adapter)
        </h3>
        <p className="mt-2 text-muted">
          {dataQualityAnomaly.rows} of {dataQualityAnomaly.total} re-run rows have a{" "}
          <code>quality_category</code> that disagrees with their own canonical score — e.g.{" "}
          <code>{dataQualityAnomaly.example.id}</code> scores canonical{" "}
          {dataQualityAnomaly.example.canonicalScore} (which buckets as{" "}
          <code>{dataQualityAnomaly.example.bucket}</code>) but the proxy still reports{" "}
          <code>quality_category: {dataQualityAnomaly.example.reportedCategory}</code>. The
          adapter passes this field through from the proxy unchanged by design, so this is an
          ES-side inconsistency worth flagging — it doesn&apos;t change the gate outcome since
          none of the 6 rows cross into <code>waste</code>/<code>conversion</code> either way.
        </p>
      </div>

      <p className="text-sm text-faint">
        Conclusion: human-review-only scope stands for Weeks 4+. No auto-approve tier should be
        built off this dataset. Full report: <code>docs/CALIBRATION.md</code> (PR #68).
      </p>
    </section>
  );
}
