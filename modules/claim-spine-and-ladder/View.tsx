import { lead, board, numbers, decisions, claimLimit, type Verdict } from "./data";
import { Pipeline } from "./Pipeline";
import { Ladder } from "./Ladder";
import { IconCheck, IconCross, IconOff, IconWarn } from "./icons";

// Shared palette across every week card: green works, red is broken, amber is a
// known gap, neutral is deliberately switched off. Same colour, same meaning.
const verdictStyle: Record<Verdict, { chip: string; Icon: typeof IconCheck }> = {
  works: { chip: "border-brand/40 bg-brand-tint text-brand-strong", Icon: IconCheck },
  fails: { chip: "border-danger/40 bg-danger/5 text-danger", Icon: IconCross },
  pending: { chip: "border-warning/40 bg-warning/5 text-warning", Icon: IconWarn },
  "by-design": { chip: "border-border bg-surface-raised text-muted", Icon: IconOff },
  mismatch: { chip: "border-warning/40 bg-warning/5 text-warning", Icon: IconWarn },
};

const cardIcon = { check: IconCheck, cross: IconCross, off: IconOff };
const accent: Record<string, string> = {
  brand: "border-l-brand text-brand-strong",
  danger: "border-l-danger text-danger",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
      {children}
    </h3>
  );
}

export default function View() {
  return (
    <section className="space-y-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-faint">First working loop</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{lead}</p>
      </div>

      <div>
        <SectionTitle>Where it stood at the end of the week</SectionTitle>
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {board.map((b) => {
            const { chip, Icon } = verdictStyle[b.verdict];
            return (
              <li
                key={b.item}
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3"
              >
                <span className="text-sm">{b.item}</span>
                <span
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs ${chip}`}
                >
                  <Icon />
                  {b.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {numbers.map((n) => (
          <div key={n.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-3xl font-semibold tabular-nums">{n.value}</div>
            <div className="mt-1 text-sm leading-snug text-muted">{n.label}</div>
          </div>
        ))}
      </div>

      <div>
        <SectionTitle>What runs, in what order</SectionTitle>
        <div className="mt-3">
          <Pipeline />
        </div>
      </div>

      <div>
        <SectionTitle>The decision ladder, first match wins</SectionTitle>
        <div className="mt-3">
          <Ladder />
        </div>
      </div>

      <div>
        <SectionTitle>Three decisions that are still holding</SectionTitle>
        <div className="mt-3 space-y-3">
          {decisions.map((d) => {
            const Icon = cardIcon[d.icon as keyof typeof cardIcon];
            return (
              <div
                key={d.n}
                className={`rounded-lg border border-border border-l-4 bg-surface p-4 ${
                  accent[d.tone]
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">
                    <Icon />
                  </span>
                  <h4 className="text-base font-semibold leading-snug text-foreground">
                    {d.title}
                  </h4>
                  <span className="ml-auto font-mono text-xs text-faint">{d.n}</span>
                </div>

                <dl className="mt-3 space-y-2">
                  {d.lines.map((l) => (
                    <div key={l.k} className="sm:flex sm:gap-4">
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-faint sm:w-44 sm:shrink-0 sm:pt-0.5">
                        {l.k}
                      </dt>
                      <dd className="text-sm text-foreground">{l.v}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-4 border-t border-border pt-3 font-mono text-xs text-faint">
                  {d.tail}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <p className="rounded-lg border border-border bg-surface-raised p-4 text-sm text-muted">
        {claimLimit}
      </p>

      <p className="font-mono text-xs text-faint">Detail: issues #30, #35 · PRs #46, #50.</p>
    </section>
  );
}
