import { Roadmap } from "./Roadmap";
import {
  story,
  chainCaption,
  claims,
  handoff,
  limitations,
} from "./data";

const CARD = "rounded border border-border p-4";
const LABEL =
  "font-mono text-xs font-medium uppercase tracking-widest text-muted";

export default function View() {
  return (
    <section className="space-y-10">
      <p className="text-muted">{story.lede}</p>

      {/* ─── 1. The impact chain ─────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>Before → the machinery → what the project can now do</h3>
        <div className="mt-4">
          <Roadmap />
        </div>
        <p className="mt-3 border-t border-border pt-3 text-sm text-muted">
          {chainCaption}
        </p>
      </div>

      {/* ─── 2. The four claims ──────────────────────────────────────── */}
      {claims.map((c, i) => (
        <div key={c.title} className={CARD}>
          <h3 className="text-sm font-semibold text-foreground">
            <span className="font-mono text-xs text-faint">{i + 1}.</span>{" "}
            {c.title}
          </h3>
          <dl className="mt-3 space-y-3">
            <div className="flex gap-3">
              <dt className="w-14 shrink-0 pt-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-faint">
                Before
              </dt>
              <dd className="text-sm text-muted">{c.before}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-14 shrink-0 pt-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-brand-strong">
                After
              </dt>
              <dd className="text-sm text-muted">{c.after}</dd>
            </div>
          </dl>
          <div className="mt-3 flex gap-3 border-t border-border pt-3">
            <span className="w-14 shrink-0 pt-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-info">
              Check
            </span>
            <p className="break-words font-mono text-xs leading-relaxed text-muted">
              {c.check}
            </p>
          </div>
        </div>
      ))}

      {/* ─── 3. Handoff, compact ─────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>{handoff.title}</h3>
        <div className="mt-4 space-y-4">
          {handoff.groups.map((g) => (
            <div key={g.owner}>
              <h4 className="text-sm font-medium text-foreground">{g.owner}</h4>
              <p className="mt-1 text-sm text-muted">{g.line}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 4. What this does NOT claim ─────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>What this does not claim</h3>
        <ul className="mt-3 space-y-2">
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
