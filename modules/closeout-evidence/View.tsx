import { lead, board, numbers, findings, claimLimit, type Verdict } from "./data";
import { Journey } from "./Journey";
import { BeforeAfter } from "./BeforeAfter";
import { Divergence } from "./Divergence";
import { FalseGreen } from "./FalseGreen";
import { BuildTrail } from "./BuildTrail";
import { Shipped, Filed, Discipline } from "./Ledger";
import { IconCheck, IconCross, IconOff, IconWarn, IconSplit, IconGauge, IconTags } from "./icons";
import { Section, Rows, Row, Note, type Tone } from "./ui";

// Shared palette across every week card: green works, red is broken, amber is a
// known gap, neutral is deliberately switched off. Same colour, same meaning.
const verdictTone: Record<Verdict, Tone> = {
  works: "good",
  fails: "bad",
  "by-design": "off",
  mismatch: "warn",
};
const verdictIcon: Record<Verdict, typeof IconCheck> = {
  works: IconCheck,
  fails: IconCross,
  "by-design": IconOff,
  mismatch: IconWarn,
};

const findingIcon = { split: IconSplit, gauge: IconGauge, tags: IconTags };
const findingArt = { "01": Divergence, "02": FalseGreen, "03": BuildTrail };
const findingTone: Record<string, Tone> = { danger: "bad", warning: "warn" };
const findingEdge: Record<string, string> = {
  danger: "border-l-danger",
  warning: "border-l-warning",
};

export default function View() {
  return (
    <div className="space-y-12">
      {/* Lead */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-faint">
          Freeze week · one job
        </p>
        <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{lead}</p>
      </div>

      <Section title="Where we actually stand" count="6 capabilities">
        <Rows>
          {board.map((b) => {
            const Icon = verdictIcon[b.verdict];
            return (
              <Row key={b.item} tone={verdictTone[b.verdict]} icon={<Icon />} chip={b.label}>
                {b.item}
              </Row>
            );
          })}
        </Rows>
      </Section>

      <Section title="The week in four numbers">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {numbers.map((n) => (
            <div key={n.label} className="rounded-lg border border-border bg-surface p-4">
              <div className="font-mono text-3xl font-semibold tabular-nums">{n.value}</div>
              <div className="mt-1 text-sm leading-snug text-muted">{n.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How far a shopper gets on a phone today">
        <Journey />
      </Section>

      <Section title="What changed for a shopper between two nights" count="one build apart">
        <BeforeAfter />
      </Section>

      <Section title="What shipped this week" count="5 pull requests">
        <Shipped />
      </Section>

      <Section title="Defects I filed instead of fixing" count="2 of 3 already closed">
        <div className="space-y-3">
          <Filed />
          <Discipline />
        </div>
      </Section>

      <Section title="Three things that need someone other than me" count="2 still open">
        <div className="space-y-3">
          {findings.map((f) => {
            const Icon = findingIcon[f.icon as keyof typeof findingIcon];
            const Art = findingArt[f.n as keyof typeof findingArt];
            const tone = findingTone[f.tone];
            return (
              <article
                key={f.n}
                className={`rounded-lg border border-border border-l-4 bg-surface p-4 ${
                  findingEdge[f.tone]
                }`}
              >
                {/* header: same three slots on every finding */}
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 ${tone === "bad" ? "text-danger" : "text-warning"}`}>
                    <Icon />
                  </span>
                  <h4 className="text-base font-semibold leading-snug">{f.title}</h4>
                  <span className="ml-auto font-mono text-xs text-faint">{f.n}</span>
                </div>

                {/* the picture does the explaining */}
                <div className="mt-4">
                  <Art />
                </div>

                {/* footer: two cells, identical on every finding */}
                <dl className="mt-4 grid gap-x-6 gap-y-3 border-t border-border pt-3 sm:grid-cols-2">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-faint">
                      Who it hits
                    </dt>
                    <dd className="mt-1 text-sm">{f.impact}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-faint">
                      {f.open ? "Next owner" : "Closed"}
                    </dt>
                    <dd className={`mt-1 text-sm ${f.open ? "" : "text-muted"}`}>{f.next}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </Section>

      <Note icon={<IconOff />} title="What none of this lets us claim" body={claimLimit} />

      <p className="font-mono text-xs text-faint">
        Detail: issues #164, #177, #226 · PRs #210, #212.
      </p>
    </div>
  );
}
