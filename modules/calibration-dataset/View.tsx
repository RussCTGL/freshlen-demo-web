import { StatBars } from "@/components/StatBars";
import { total, produceTypes, trueState, source } from "./data";

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">
        The calibration experiment needs real consumer-phone photos with a human label assigned{" "}
        <em>before</em> the model ever scores them. This is that dataset:{" "}
        <strong>{total} images</strong> across 9 produce types, each labeled{" "}
        <code>fresh</code> / <code>borderline</code> / <code>spoiled</code>.
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        <StatBars title="Produce type" rows={produceTypes} />
        <StatBars title="Ground-truth label (true_state)" rows={trueState} />
      </div>

      <StatBars title="Source" rows={source} />

      <p className="text-sm text-faint">
        Labels are assigned before scoring to avoid anchoring bias. The 20{" "}
        <code>ai_fake</code> images feed the AI-fake detection probe (issue #34).
      </p>
    </section>
  );
}
