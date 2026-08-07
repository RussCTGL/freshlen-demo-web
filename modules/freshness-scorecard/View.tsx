import { story, stats, cases, floorProof, findings, provenance } from "./data";

const CARD = "rounded border border-border p-4";
const LABEL =
  "font-mono text-xs font-medium uppercase tracking-widest text-muted";

const TONE_TILE: Record<string, string> = {
  hit: "border-brand/40 bg-brand-tint",
  "safe-miss": "border-warning/60 bg-warning/10",
  "unsafe-miss": "border-danger/60 bg-danger/10",
};

const TONE_TAG: Record<string, string> = {
  hit: "text-brand-strong",
  "safe-miss": "text-warning",
  "unsafe-miss": "text-danger",
};

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">{story.lede}</p>

      {/* ─── Headline numbers ─────────────────────────────────────────── */}
      <div className={CARD}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-mono text-3xl font-semibold tracking-tight text-foreground">
                {s.value}
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-faint">
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 border-t border-border pt-3 text-center text-sm text-muted">
          {provenance}
        </p>
      </div>

      {/* ─── The case wall: 10 synthetic images, HIT/MISS labeled ──────── */}
      <div className={CARD}>
        <h3 className={LABEL}>The scorecard — 10 synthetic cases</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {cases.map((c) => (
            <div
              key={c.name}
              className={`rounded border px-3 py-2 ${TONE_TILE[c.tone]}`}
            >
              <span
                className={`font-mono text-[10px] font-medium uppercase tracking-widest ${TONE_TAG[c.tone]}`}
              >
                {c.hit ? "Hit" : "Miss"}
              </span>
              <div className="mt-0.5 break-all font-mono text-xs text-foreground">
                {c.name}
              </div>
              <div className="mt-0.5 font-mono text-xs text-muted">
                {c.score} · {c.expected}→{c.actual}
              </div>
              {c.note ? (
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {c.note}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* ─── The floor bites ──────────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>{floorProof.title}</h3>
        <p className="mt-3 text-sm text-muted">{floorProof.line}</p>
      </div>

      {/* ─── What it caught — documented, not hidden ───────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>What it caught — documented, not hidden</h3>
        <ul className="mt-3 space-y-1">
          {findings.map((f) => (
            <li key={f.slice(0, 40)} className="text-sm text-muted">
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
