const pdfUrl =
  "https://github.com/LawrenceHua/es-intern-freshlens/blob/main/docs/wireframes/evidence-flow-v0.pdf";

const sourceUrl =
  "https://github.com/LawrenceHua/es-intern-freshlens/blob/main/docs/wireframes/evidence-flow-v0.md";

const screens = [
  {
    title: "1. Item photo",
    body: "Start with one clear action: capture the item photo in-app so the evidence is tied to the claim.",
  },
  {
    title: "2. Purchase details",
    body: "Collect the receipt fields consumed by parse_receipt_text: item label, price in cents, store id, and purchase date.",
  },
  {
    title: "3. Claim review",
    body: "Show the photo, purchase details, identity result, and fraud risk before the shopper sees a decision.",
  },
  {
    title: "4. Decision",
    body: "Explain auto approval, human review, or pre-model duplicate decline with a receipt id and verify link.",
  },
];

const evidenceStates = [
  {
    key: 'identity_result["match"] is False',
    message: "The photo does not appear to show the receipt item. A human reviewer will check.",
  },
  {
    key: 'identity_result["match"] is None',
    message: "The system could not verify the photo automatically, so the copy stays softer and routes to review.",
  },
  {
    key: 'fraud_signals["risk_level"] == "high"',
    message: "A high-risk evidence signal asks for human verification instead of an automatic decline.",
  },
];

const fieldGroups = [
  {
    label: "Receipt parse",
    fields: ["receipt_info.item_label", "receipt_info.item_price_cents", "receipt_info.errors"],
  },
  {
    label: "Identity match",
    fields: ["identity_result.match", "identity_result.predicted", "identity_result.confidence"],
  },
  {
    label: "Fraud signals",
    fields: ["fraud_signals.risk_level", "fraud_signals.signals", "fraud_signals.advisory"],
  },
  {
    label: "Decision",
    fields: ["decision.outcome", "decision.reason_code", "decision.provenance_receipt_id"],
  },
];

export default function View() {
  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          Issue #82 - Week 5 evidence quality
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">
          Evidence-backed shopper claim flow
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
          This wireframe is the UX contract for turning Week 5 evidence outputs into a shopper-facing
          claim flow. It connects receipt parsing, photo identity matching, fraud signals, and policy
          decisions without using harsh or overconfident language.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Open PDF artifact
          </a>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand"
          >
            View Markdown source
          </a>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {screens.map((screen) => (
          <article key={screen.title} className="rounded-2xl border border-border bg-surface p-4">
            <h2 className="text-base font-semibold text-foreground">{screen.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{screen.body}</p>
          </article>
        ))}
      </div>

      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-3xl border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-foreground">Evidence states covered</h2>
          <div className="mt-4 space-y-3">
            {evidenceStates.map((state) => (
              <div key={state.key} className="rounded-2xl border border-border bg-background p-4">
                <code className="text-sm font-semibold text-brand">{state.key}</code>
                <p className="mt-2 text-sm leading-6 text-muted">{state.message}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold text-foreground">Field mapping</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            The wireframe maps each visible UI label back to the current Week 5 response shape.
          </p>
          <div className="mt-4 space-y-3">
            {fieldGroups.map((group) => (
              <div key={group.label} className="rounded-2xl bg-background p-4">
                <h3 className="text-sm font-semibold text-foreground">{group.label}</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted">
                  {group.fields.map((field) => (
                    <li key={field}>
                      <code>{field}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold text-foreground">What this contributes</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-muted">
          The backend work tells us whether receipt data parsed cleanly, whether the photo appears
          to match the receipt item, whether fraud-risk signals are high, and what decision the
          policy flow produced. This artifact defines how those signals should be explained to a
          shopper: uncertainty goes to human review, duplicate gates are described clearly, and the
          receipt id stays visible for later verification.
        </p>
      </section>
    </section>
  );
}
