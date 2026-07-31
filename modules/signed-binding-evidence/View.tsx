import {
  evidenceLabels,
  resultCards,
  flowSteps,
  caseRows,
  evidenceRows,
  takeaway,
  type Tone,
} from "./data";

const TONE_BORDER: Record<Tone, string> = {
  success: "border-success/40",
  danger: "border-danger/40",
  warning: "border-warning/40",
};

const TONE_TEXT: Record<Tone, string> = {
  success: "text-success",
  danger: "text-danger",
  warning: "text-warning",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
      {children}
    </h3>
  );
}

function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest ${TONE_BORDER[tone]} ${TONE_TEXT[tone]}`}
    >
      {children}
    </span>
  );
}

export default function View() {
  return (
    <div className="space-y-10">
      {/* A. Hero — title is already rendered by the shell header; this is the subtitle + evidence badges */}
      <div>
        <p className="max-w-2xl text-sm text-muted">
          A signed decision is accepted only when its content, identity, and anchor still
          match.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {evidenceLabels.map((label) => (
            <Badge key={label} tone="success">
              {label}
            </Badge>
          ))}
        </div>
      </div>

      {/* B. Three large result cards */}
      <section>
        <div className="grid gap-4 sm:grid-cols-3">
          {resultCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-lg border bg-surface p-5 ${TONE_BORDER[card.tone]}`}
            >
              <p className="font-mono text-xs uppercase tracking-widest text-faint">
                {card.title}
              </p>
              <p className={`mt-2 font-mono text-2xl font-bold ${TONE_TEXT[card.tone]}`}>
                {card.status}
              </p>
              <p className="mt-2 text-sm text-muted">{card.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* C. Flow diagram */}
      <section>
        <SectionTitle>Verification flow</SectionTitle>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {flowSteps.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium">
                {step}
              </span>
              {i < flowSteps.length - 1 ? (
                <span className="text-faint" aria-hidden="true">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* D. Before / attack / result examples */}
      <section>
        <SectionTitle>Attack &amp; valid cases</SectionTitle>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {caseRows.map((row) => (
            <div key={row.label} className="rounded-lg border border-border bg-surface p-4">
              <p className="text-sm font-semibold">{row.label}</p>
              <p className="mt-1.5 text-xs text-muted">{row.input}</p>
              <div className="mt-3">
                <Badge tone={row.result === "ACCEPTED" ? "success" : "danger"}>
                  {row.result}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* E. Evidence summary */}
      <section>
        <SectionTitle>Evidence summary</SectionTitle>
        <div className="mt-3 divide-y divide-border rounded-lg border border-border bg-surface">
          {evidenceRows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 px-4 py-2.5"
            >
              <span className="text-sm text-muted">{row.label}</span>
              <span className={`font-mono text-xs font-semibold ${TONE_TEXT[row.tone]}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* F. Final takeaway */}
      <section className="rounded-lg border border-brand/30 bg-brand-tint p-5">
        <p className="text-sm font-medium text-foreground">{takeaway}</p>
      </section>
    </div>
  );
}
