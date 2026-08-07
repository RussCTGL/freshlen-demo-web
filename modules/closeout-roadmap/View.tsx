import { Roadmap } from "./Roadmap";
import { story, chainCaption, thisWeek, claims, packet, handoff, limitations } from "./data";

const CARD = "rounded border border-border p-4";
const LABEL =
  "font-mono text-xs font-medium uppercase tracking-widest text-muted";

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">{story.lede}</p>

      {/* ─── The impact chain — the page ─────────────────────────────── */}
      <div className={CARD}>
        <Roadmap />
        {/* This week in commits — merged vs still in freeze review; the
            group labels carry the meaning, the border tone only echoes it. */}
        <div className="mt-4 space-y-2 border-t border-border pt-3">
          {thisWeek.map((g) => (
            <div
              key={g.label}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
            >
              <span className="w-44 shrink-0 font-mono text-[10px] uppercase tracking-widest text-faint">
                {g.label}
              </span>
              <ul className="flex flex-wrap gap-2">
                {g.commits.map((c) => (
                  <li
                    key={c.hash}
                    className="rounded border border-border bg-surface px-2 py-1 font-mono text-xs"
                  >
                    <span className="text-faint">{c.date}</span>{" "}
                    <span className="font-medium text-foreground">{c.hash}</span>{" "}
                    <span className="text-muted">{c.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-3 border-t border-border pt-3 text-sm text-muted">
          {chainCaption}
        </p>
      </div>

      {/* ─── Four claims: title · one sentence · check ───────────────── */}
      <div className="grid gap-4 md:grid-cols-2">
        {claims.map((c, i) => (
          <div key={c.title} className={CARD}>
            <h3 className="text-sm font-semibold text-foreground">
              <span className="font-mono text-xs text-faint">{i + 1}.</span>{" "}
              {c.title}
            </h3>
            <p className="mt-2 text-sm text-muted">{c.line}</p>
            <p className="mt-3 flex gap-2 border-t border-border pt-2">
              <span className="shrink-0 pt-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-info">
                Check
              </span>
              <span className="break-all font-mono text-xs leading-relaxed text-muted">
                {c.check}
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* ─── The final packet, gate by gate: 10 VERIFIED · 1 BLOCKED ────── */}
      <div className={CARD}>
        <h3 className={LABEL}>{packet.title}</h3>
        <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {packet.verified.map((g) => (
            <div key={g.name} className="flex items-baseline gap-2 text-sm">
              <span className="shrink-0 font-mono text-[10px] font-medium uppercase tracking-widest text-brand-strong">
                Verified
              </span>
              <span className="font-mono text-xs text-foreground">{g.name}</span>
              <span className="text-xs text-muted">— {g.line}</span>
            </div>
          ))}
          {packet.blocked.map((g) => (
            <div key={g.name} className="flex items-baseline gap-2 text-sm">
              <span className="shrink-0 font-mono text-[10px] font-medium uppercase tracking-widest text-warning">
                Blocked
              </span>
              <span className="font-mono text-xs text-foreground">{g.name}</span>
              <span className="text-xs text-muted">— {g.line}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 border-t border-border pt-3 text-sm text-muted">
          {packet.blockedNote}
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
