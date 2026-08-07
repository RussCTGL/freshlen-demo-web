import { Roadmap } from "./Roadmap";
import { story, delta, thisWeek, gates, gatesNote, handoff, limitations } from "./data";

const CARD = "rounded border border-border p-4";
const LABEL =
  "font-mono text-xs font-medium uppercase tracking-widest text-muted";

const WEEK_DAYS = ["Mon 3", "Tue 4", "Wed 5", "Thu 6", "Fri 7"];

/** One big-number half of the scoreboard. Text labels carry the meaning. */
function PacketCount({ v, b, label }: { v: number; b: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-4xl font-semibold tracking-tight">
        <span className="text-brand-strong">{v} V</span>{" "}
        <span className="text-warning">/ {b} B</span>
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-faint">
        {label}
      </div>
    </div>
  );
}

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">{story.lede}</p>

      {/* ─── The scoreboard: the week in two numbers ───────────────────── */}
      <div className={CARD}>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-2">
          <PacketCount {...delta.before} />
          <span className="text-2xl text-faint" aria-hidden="true">
            →
          </span>
          <PacketCount {...delta.after} />
        </div>
        <p className="mt-3 border-t border-border pt-3 text-center text-sm text-muted">
          {delta.footnote}
        </p>
      </div>

      {/* ─── The week-over-week chain ──────────────────────────────────── */}
      <div className={CARD}>
        <Roadmap />
      </div>

      {/* ─── This week in commits: a Mon–Fri timeline ──────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>This week in commits · Aug 3–7</h3>
        <div className="mt-3 space-y-3">
          {thisWeek.map((g) => (
            <div key={g.label}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
                {g.label}
              </div>
              <div className="mt-1 grid grid-cols-5 gap-2">
                {WEEK_DAYS.map((d, i) => (
                  <div key={d} className="flex flex-col items-center gap-1">
                    <span className="font-mono text-[10px] uppercase text-faint">
                      {d}
                    </span>
                    {g.commits
                      .filter((c) => c.day === i + 3)
                      .map((c) => (
                        <span
                          key={c.hash}
                          className="rounded border border-border bg-surface px-2 py-1 text-center font-mono text-xs"
                        >
                          <span className="font-medium text-foreground">
                            {c.hash}
                          </span>
                          <br />
                          <span className="text-[10px] text-muted">
                            {c.label}
                          </span>
                        </span>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── The final packet as a gate wall: 10 VERIFIED · 1 BLOCKED ──── */}
      <div className={CARD}>
        <h3 className={LABEL}>The final packet — 10 verified · 1 blocked</h3>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {gates.map((g) => (
            <div
              key={g.name}
              className={`rounded border px-3 py-2 ${
                g.status === "VERIFIED"
                  ? "border-brand/40 bg-brand-tint"
                  : "border-warning/60 bg-warning/10"
              }`}
            >
              <span
                className={`font-mono text-[10px] font-medium uppercase tracking-widest ${
                  g.status === "VERIFIED" ? "text-brand-strong" : "text-warning"
                }`}
              >
                {g.status}
              </span>
              <div className="mt-0.5 break-all font-mono text-xs text-foreground">
                {g.name}
              </div>
              {g.note ? (
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {g.note}
                </p>
              ) : null}
            </div>
          ))}
        </div>
        <p className="mt-3 border-t border-border pt-3 text-sm text-muted">
          {gatesNote}
        </p>
      </div>

      {/* ─── Handoff: owner → noun phrase ────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>{handoff.title}</h3>
        <dl className="mt-3 space-y-2">
          {handoff.rows.map((r) => (
            <div key={r.owner} className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm">
              <dt className="w-44 shrink-0 font-medium text-foreground">
                {r.owner}
              </dt>
              <dd className="text-muted">{r.line}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ─── What this does NOT claim ────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>What this does not claim</h3>
        <ul className="mt-3 space-y-1">
          {limitations.map((l) => (
            <li key={l.slice(0, 40)} className="text-sm text-muted">
              {l}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
