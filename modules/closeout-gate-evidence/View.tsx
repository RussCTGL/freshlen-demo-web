import { StatBars } from "@/components/StatBars";
import { BpmnDiagram } from "./Bpmn";
import {
  story,
  contract,
  flow,
  orchestrator,
  gateBoard,
  blockedNote,
  week8,
  limitations,
} from "./data";

const CARD = "rounded border border-border p-4";
const LABEL =
  "font-mono text-xs font-medium uppercase tracking-widest text-muted";

export default function View() {
  return (
    <section className="space-y-10">
      <p className="text-muted">{story.lede}</p>

      {/* ─── 1. The frozen contract ──────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>{contract.title}</h3>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <StatBars title="One vertical slice (+480 lines)" rows={[...contract.files]} />
            <p className="mt-4 text-sm text-muted">{contract.reviewNote}</p>
          </div>
          <ul className="space-y-3">
            {contract.rules.map((r) => (
              <li key={r.rule} className="text-sm">
                <span className="font-medium text-foreground">{r.rule}.</span>{" "}
                <span className="text-muted">{r.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── 2. The flow, as BPMN ────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>{flow.title}</h3>
        <div className="mt-4">
          <BpmnDiagram />
        </div>
        <p className="mt-3 border-t border-border pt-3 text-sm text-muted">
          {flow.caption}
        </p>
      </div>

      {/* ─── 3. The orchestrator ─────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>{orchestrator.title}</h3>
        <ul className="mt-3 space-y-2.5">
          {orchestrator.points.map((p) => (
            <li key={p.slice(0, 32)} className="text-sm text-muted">
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-border pt-3 text-sm text-muted">
          {orchestrator.determinism}
        </p>
      </div>

      {/* ─── 3. The honest board ─────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>The packet, honestly: 8 verified / 3 blocked, exit 1</h3>
        <div className="mt-4 space-y-4">
          {gateBoard.map((row) => (
            <div key={row.status} className="flex items-baseline gap-4">
              <span
                className={`w-40 shrink-0 font-mono text-xs font-semibold ${
                  row.status === "VERIFIED" ? "text-success" : "text-danger"
                }`}
              >
                {row.status}{" "}
                <span className="text-2xl tabular-nums">{row.count}</span>
              </span>
              <p className="text-sm text-muted">{row.gates}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-border pt-3 text-sm text-muted">
          {blockedNote}
        </p>
      </div>

      {/* ─── 4. Week 8 runway ────────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>{week8.title}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          {week8.steps.map((s) => (
            <li key={s.slice(0, 32)} className="text-sm text-muted">
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* ─── 5. What this does NOT claim ─────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>What this does not claim</h3>
        <ul className="mt-3 space-y-2">
          {limitations.map((l) => (
            <li key={l.slice(0, 32)} className="text-sm text-muted">
              {l}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
