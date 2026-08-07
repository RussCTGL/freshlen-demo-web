import { lead, board, numbers, findings, claimLimit, type Verdict } from "./data";
import { Journey } from "./Journey";
import { BeforeAfter } from "./BeforeAfter";
import { Divergence } from "./Divergence";
import { FalseGreen } from "./FalseGreen";
import { BuildTrail } from "./BuildTrail";
import { Shipped, Filed, Discipline } from "./Ledger";
import {
  IconCheck,
  IconCross,
  IconOff,
  IconWarn,
  IconSplit,
  IconGauge,
  IconTags,
} from "./icons";

// Shared palette across every week card: green works, red is broken, amber is a
// known gap, neutral is deliberately switched off. Same colour, same meaning.
const verdictStyle: Record<Verdict, { chip: string; Icon: typeof IconCheck }> = {
  works: { chip: "border-brand/40 bg-brand-tint text-brand-strong", Icon: IconCheck },
  fails: { chip: "border-danger/40 bg-danger/5 text-danger", Icon: IconCross },
  "by-design": { chip: "border-border bg-surface-raised text-muted", Icon: IconOff },
  mismatch: { chip: "border-warning/40 bg-warning/5 text-warning", Icon: IconWarn },
};

const findingIcon = { split: IconSplit, gauge: IconGauge, tags: IconTags };
const findingArt = { "01": Divergence, "02": FalseGreen, "03": BuildTrail };
const accent: Record<string, string> = {
  danger: "border-l-danger text-danger",
  warning: "border-l-warning text-warning",
};

function SectionTitle({ children, count }: { children: React.ReactNode; count?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
        {children}
      </h3>
      {count && <span className="font-mono text-xs text-faint">{count}</span>}
    </div>
  );
}

export default function View() {
  return (
    <section className="space-y-10">
      {/* Lead */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-faint">
          Freeze week · one job
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{lead}</p>
      </div>

      {/* Verdict board */}
      <div>
        <SectionTitle>Where we actually stand</SectionTitle>
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

      {/* Numbers */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {numbers.map((n) => (
          <div key={n.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-3xl font-semibold tabular-nums">{n.value}</div>
            <div className="mt-1 text-sm leading-snug text-muted">{n.label}</div>
          </div>
        ))}
      </div>

      {/* How far a shopper gets */}
      <div>
        <SectionTitle>How far a shopper gets on a phone today</SectionTitle>
        <div className="mt-3">
          <Journey />
        </div>
      </div>

      {/* What changed */}
      <div>
        <SectionTitle>What changed for a shopper between two nights</SectionTitle>
        <div className="mt-3">
          <BeforeAfter />
        </div>
      </div>

      {/* What shipped */}
      <div>
        <SectionTitle count="5 pull requests">What shipped this week</SectionTitle>
        <div className="mt-3">
          <Shipped />
        </div>
      </div>

      {/* What was handed over */}
      <div>
        <SectionTitle count="2 of 3 already closed">
          Defects I filed instead of fixing
        </SectionTitle>
        <div className="mt-3">
          <Filed />
        </div>
        <div className="mt-3">
          <Discipline />
        </div>
      </div>

      {/* Findings */}
      <div>
        <SectionTitle count="all still open">Three things that need someone other than me</SectionTitle>
        <div className="mt-3 space-y-3">
          {findings.map((f) => {
            const Icon = findingIcon[f.icon as keyof typeof findingIcon];
            const Art = findingArt[f.n as keyof typeof findingArt];
            return (
              <div
                key={f.n}
                className={`rounded-lg border border-border border-l-4 bg-surface p-4 ${
                  accent[f.tone]
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">
                    <Icon />
                  </span>
                  <h4 className="text-base font-semibold leading-snug text-foreground">
                    {f.title}
                  </h4>
                  <span className="ml-auto font-mono text-xs text-faint">{f.n}</span>
                </div>

                <dl className="mt-3 space-y-2">
                  {f.lines.map((l) => (
                    <div key={l.k} className="sm:flex sm:gap-4">
                      <dt className="font-mono text-[11px] uppercase tracking-wide text-faint sm:w-44 sm:shrink-0 sm:pt-0.5">
                        {l.k}
                      </dt>
                      <dd className="text-sm text-foreground">{l.v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4">
                  <Art />
                </div>

                <p className="mt-4 flex flex-wrap items-baseline gap-2 border-t border-border pt-3">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-faint">
                    Next
                  </span>
                  <span className="text-sm text-muted">{f.next}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* The boundary */}
      <p className="rounded-lg border border-border bg-surface-raised p-4 text-sm text-muted">
        {claimLimit}
      </p>

      <p className="font-mono text-xs text-faint">
        Detail: issues #164, #177, #226 · PRs #210, #212.
      </p>
    </section>
  );
}
