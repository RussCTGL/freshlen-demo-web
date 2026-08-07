import { Roadmap } from "./Roadmap";
import {
  story,
  roadmapCaption,
  shipped,
  inReview,
  handoff,
  honesty,
  limitations,
} from "./data";

const CARD = "rounded border border-border p-4";
const LABEL =
  "font-mono text-xs font-medium uppercase tracking-widest text-muted";

export default function View() {
  return (
    <section className="space-y-10">
      <p className="text-muted">{story.lede}</p>

      {/* ─── 1. The roadmap ──────────────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>The roadmap — this week, at freeze, and after</h3>
        <div className="mt-4">
          <Roadmap />
        </div>
        <p className="mt-3 border-t border-border pt-3 text-sm text-muted">
          {roadmapCaption}
        </p>
      </div>

      {/* ─── 2. Shipped this week, expanded ──────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>{shipped.title}</h3>
        <ul className="mt-4 space-y-4">
          {shipped.items.map((it) => (
            <li key={it.head} className="text-sm">
              <span className="font-medium text-foreground">{it.head}.</span>{" "}
              <span className="text-muted">{it.body}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-border pt-3">
          <p className="text-sm text-muted">{shipped.aggregateNote}</p>
          <p className="mt-1 break-all font-mono text-xs text-faint">
            {shipped.aggregateSha}
          </p>
        </div>
      </div>

      {/* ─── 3. In review at the freeze ──────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>{inReview.title}</h3>
        <p className="mt-3 text-sm text-muted">{inReview.body}</p>
      </div>

      {/* ─── 4. The handoff, with owners ─────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>{handoff.title}</h3>
        <div className="mt-4 space-y-5">
          {handoff.groups.map((g) => (
            <div key={g.owner}>
              <h4 className="text-sm font-medium text-foreground">
                {g.owner}
              </h4>
              <ul className="mt-2 space-y-1.5 pl-4">
                {g.items.map((item) => (
                  <li key={item.slice(0, 40)} className="list-disc text-sm text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 5. The honesty ledger ───────────────────────────────────── */}
      <div className={CARD}>
        <h3 className={LABEL}>{honesty.title}</h3>
        <p className="mt-3 text-sm text-muted">{honesty.body}</p>
      </div>

      {/* ─── 6. What this does NOT claim ─────────────────────────────── */}
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
