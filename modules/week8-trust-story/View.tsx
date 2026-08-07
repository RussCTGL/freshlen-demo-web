import type { ReactNode } from "react";

type Accent = "green" | "amber" | "red";

const accentStyles: Record<Accent, { border: string; text: string; soft: string }> = {
  green: {
    border: "border-l-success",
    text: "text-success",
    soft: "border-success/30 bg-success/10",
  },
  amber: {
    border: "border-l-warning",
    text: "text-warning",
    soft: "border-warning/30 bg-warning/10",
  },
  red: {
    border: "border-l-danger",
    text: "text-danger",
    soft: "border-danger/30 bg-danger/10",
  },
};

function Panel({
  index,
  title,
  accent,
  children,
  leftLabel,
  leftText,
  rightLabel,
  rightText,
}: {
  index: string;
  title: string;
  accent: Accent;
  children: ReactNode;
  leftLabel: string;
  leftText: string;
  rightLabel: string;
  rightText: string;
}) {
  const styles = accentStyles[accent];

  return (
    <article className={`overflow-hidden rounded-md border border-border border-l-[3px] ${styles.border} bg-surface`}>
      <header className="flex items-start justify-between gap-4 border-b border-border px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <span className={`font-mono text-sm font-semibold ${styles.text}`}>+</span>
          <h3 className="text-sm font-semibold leading-6 text-foreground sm:text-base">{title}</h3>
        </div>
        <span className="font-mono text-[10px] text-faint">{index}</span>
      </header>

      <div className="px-4 py-6 sm:px-6 sm:py-7">{children}</div>

      <footer className="grid border-t border-border sm:grid-cols-2">
        <div className="px-4 py-4 sm:px-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">{leftLabel}</p>
          <p className="mt-2 text-xs leading-5 text-muted sm:text-sm">{leftText}</p>
        </div>
        <div className="border-t border-border px-4 py-4 sm:border-l sm:border-t-0 sm:px-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-faint">{rightLabel}</p>
          <p className="mt-2 text-xs leading-5 text-muted sm:text-sm">{rightText}</p>
        </div>
      </footer>
    </article>
  );
}

function FlowNode({
  label,
  detail,
  accent = "green",
  dashed = false,
}: {
  label: string;
  detail: string;
  accent?: Accent;
  dashed?: boolean;
}) {
  const styles = accentStyles[accent];

  return (
    <div className={`min-w-0 rounded-md border p-4 ${dashed ? "border-dashed" : ""} ${styles.soft}`}>
      <p className={`font-mono text-[9px] uppercase tracking-[0.16em] ${styles.text}`}>{label}</p>
      <p className="mt-2 text-xs font-medium leading-5 text-foreground">{detail}</p>
    </div>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 text-center font-mono text-[9px] text-success sm:flex-col sm:gap-1 sm:py-0">
      <span className="whitespace-nowrap">{label}</span>
      <span aria-hidden="true">-&gt;</span>
    </div>
  );
}

export default function View() {
  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4 font-mono text-[9px] uppercase tracking-[0.22em] text-faint">
        <span>Four parts - one trust layer</span>
        <span>04 is complete</span>
      </div>

      <div className="grid gap-5 border-b border-border py-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-success">Week 8 / Lezhi / #156</p>
          <h2 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            A trustworthy seal for every FreshLens decision.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted">
          The signing layer shows where a decision came from, protects the private secret, keeps
          older records checkable, and rejects silent changes.
        </p>
      </div>

      <div className="space-y-3">
        <Panel
          index="01"
          title="One decision receives one exact digital seal"
          accent="green"
          leftLabel="What I delivered"
          leftText="Safe key creation and a signature tied to the exact decision details."
          rightLabel="Why it matters"
          rightText="The seal belongs to that record only; it cannot simply be reused somewhere else."
        >
          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <FlowNode label="Decision record" detail="Store, amount, outcome, and identity" />
            <Arrow label="exact details" />
            <FlowNode label="Private signing key" detail="Creates the seal without being exposed" accent="amber" />
            <Arrow label="signs" />
            <FlowNode label="Digital seal" detail="Attached to this decision only" />
          </div>
        </Panel>

        <Panel
          index="02"
          title="Checking a record never requires the private secret"
          accent="green"
          leftLabel="Safe separation"
          leftText="The public part checks; the private part signs. Their jobs stay separate."
          rightLabel="Who can check"
          rightText="A shopper, support person, or another system can confirm the record safely."
        >
          <div className="mx-auto max-w-xl">
            <div className="mx-auto w-fit rounded-md border border-border bg-surface-raised px-4 py-2 text-center font-mono text-[10px] text-muted">
              one record, with its digital seal attached
            </div>
            <div className="mx-auto h-5 w-px bg-border" />
            <div className="grid gap-3 sm:grid-cols-2">
              <FlowNode label="Public checking key" detail="Safe to share - confirms that the seal matches" />
              <FlowNode label="Private signing key" detail="Stays protected - never needed for checking" accent="amber" />
            </div>
          </div>
        </Panel>

        <Panel
          index="03"
          title="New keys can take over without losing the history"
          accent="amber"
          leftLabel="What changes over time"
          leftText="New decisions use the current key while older records keep their original key identity."
          rightLabel="The rule"
          rightText="Current signs and checks; previous checks history; unknown is rejected."
        >
          <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <FlowNode label="Current key" detail="Creates new seals and checks current records" />
            <Arrow label="later becomes" />
            <FlowNode label="Previous key" detail="Checks the older records that used it" accent="amber" />
            <div className="flex items-center justify-center gap-2 py-1 font-mono text-[9px] text-warning sm:flex-col sm:py-0">
              <span>no match</span>
              <span aria-hidden="true">-x</span>
            </div>
            <FlowNode label="Unknown key" detail="Rejected instead of trusted by mistake" accent="red" dashed />
          </div>
        </Panel>

        <Panel
          index="04"
          title="A silent edit can no longer look genuine"
          accent="red"
          leftLabel="Protected details"
          leftText="Amount, store, decision, identity, and every other signed field."
          rightLabel="Final result"
          rightText="Genuine records stay checkable; changed copies cannot pass as the original."
        >
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="space-y-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Original record</p>
              <FlowNode label="Seal matches" detail="Accepted as the decision FreshLens issued" />
            </div>
            <div className="hidden h-20 w-px bg-border sm:block" />
            <div className="space-y-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-faint">Changed copy</p>
              <FlowNode label="Seal fails" detail="Rejected after any protected detail changes" accent="red" />
            </div>
          </div>
        </Panel>
      </div>
    </section>
  );
}
