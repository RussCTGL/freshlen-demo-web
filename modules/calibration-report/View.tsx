import { StatBars } from "@/components/StatBars";
import {
  scored,
  backend,
  gate,
  metric1,
  metric2,
  metric3,
  quality,
  reviewCatches,
  openQuestion,
} from "./data";

function MetricTable({ rows }: { rows: { metric: string; value: string }[] }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map((r) => (
          <tr key={r.metric} className="border-t border-border first:border-t-0">
            <td className="py-1.5 pr-4 text-muted">{r.metric}</td>
            <td className="py-1.5 text-right font-mono tabular-nums text-foreground">
              {r.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">
        Issue #33 was the program&rsquo;s Week 1 gate experiment: before any auto-approve logic
        could be built, <code>scripts/calibration_report.py</code> had to score the real{" "}
        {scored}-photo dataset (<code>backend={backend}</code>) against the official 3-metric
        spec in <code>docs/CALIBRATION-DATASET.md</code> and produce a GO / GO WITH MITIGATION /
        RE-SCOPE verdict. An earlier framework draft (written before the labeled data existed)
        used a different, made-up precision/recall metric and had to be rewritten from scratch to
        match the real spec.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Photos scored", value: scored },
          { label: "Backend", value: backend },
          { label: "Gate decision", value: gate },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">
              {s.label}
            </div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
            Metric 1 — calibration curve
          </h3>
          <div className="mt-3">
            <MetricTable rows={metric1} />
          </div>
        </div>
        <StatBars title="quality_category distribution" rows={quality} />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
            Metric 2 — auto-approve vs. escalate
          </h3>
          <div className="mt-3">
            <MetricTable rows={metric2} />
          </div>
          <p className="mt-2 text-xs text-faint">
            Viable band needs &ge;~30% auto-approve at &lt;5% FP rate. 0.0% at every threshold —
            <code>quality_category</code> never hit <code>waste</code> in this dataset.
          </p>
        </div>
        <div>
          <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
            Metric 3 — AI-fake detectability
          </h3>
          <div className="mt-3">
            <MetricTable rows={metric3} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-danger/30 border-l-4 border-l-danger bg-danger/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-danger">
          Gate decision · RE-SCOPE (human-review-only)
        </p>
        <p className="mt-2">
          No confidence threshold reaches a viable auto-approve band, and the high-confidence bin
          falls well short of &ge;80% accuracy on both fresh and spoiled true_state (fresh 93.8%,
          spoiled 0.0%). This is the verdict that set Weeks 4&ndash;8&rsquo;s scope to
          human-review-only for the auto-approve tier &mdash; later re-confirmed after a model
          upgrade in issue #55 (see the <code>calibration-gate</code> module).
        </p>
      </div>

      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Caught in review, before this shipped
        </h3>
        <div className="mt-3 space-y-3">
          {reviewCatches.map((c) => (
            <div key={c.title} className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
                {c.title}
              </p>
              <p className="mt-2 text-muted">{c.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded border border-border px-4 py-3 text-sm">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Open question, not yet confirmed
        </h3>
        <p className="mt-2 text-muted">{openQuestion}</p>
      </div>

      <p className="text-sm text-faint">
        Full report: <code>docs/CALIBRATION.md</code> (PR #49, later superseded by the issue #55
        re-run). Framework: <code>scripts/calibration_report.py</code>.
      </p>
    </section>
  );
}
