const shopperSteps = [
  {
    step: "1",
    title: "Produce photo",
    body: "The shopper starts with one item photo and a shopper bearer token. The local demo uses a camera/file-picker fallback and records captured_in_app=false honestly.",
  },
  {
    step: "2",
    title: "Receipt evidence",
    body: "The shopper adds receipt evidence and fields: item label, store id, price paid, and purchase date.",
  },
  {
    step: "3",
    title: "Submit once",
    body: "The create request freezes its idempotency key plus normalized capture metadata, so a lost-response retry does not create duplicate claims.",
  },
  {
    step: "4",
    title: "Human review result",
    body: "The result page shows claim reference, provenance receipt, receipt fields, identity evidence, and fraud signals, then routes to human_review.",
  },
];

const evidenceRows = [
  ["PR", "#137 - Add Week 6 claim and review UI surfaces"],
  ["Shopper route", "/claim.html"],
  ["Reviewer route", "/business.html"],
  ["Local runner", "python scripts/demo_claim_loop.py"],
  ["TestFlight result", "#119 GAP - scanner works; full receipt-to-claim flow not present in iOS build"],
];

const reviewerFields = [
  "claim_id",
  "item_label",
  "store_id",
  "requested_amount_cents",
  "reason_code",
  "confidence",
  "evidence_summary",
];

export default function View() {
  return (
    <section className="space-y-8">
      <header className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Issue #106 / #107 - PR #137
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">
          Shopper claim flow to human review
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-muted">
          This is Ziyun&apos;s Week 6 surface: a shopper submits produce + receipt
          evidence, the system preserves one created claim across retries, and the
          result is routed to a human reviewer. The demo boundary is explicit:
          automatic payouts stay disabled while calibration remains RE-SCOPE.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="https://github.com/LawrenceHua/es-intern-freshlens/pull/137"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Open PR #137
          </a>
          <a
            href="https://github.com/LawrenceHua/es-intern-freshlens/issues/119"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand"
          >
            Device evidence #119
          </a>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {shopperSteps.map((item) => (
          <article key={item.step} className="rounded-2xl border border-border bg-surface p-4">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              Step {item.step}
            </span>
            <h2 className="mt-2 text-lg font-semibold text-foreground">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-border bg-surface p-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Shopper result
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">human_review</h2>
          <div className="mt-4 rounded-2xl border-l-4 border-warning bg-background p-4">
            <p className="font-semibold text-foreground">
              A team member will review this claim.
            </p>
            <dl className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-faint">
                  Claim reference
                </dt>
                <dd className="mt-1 font-mono text-foreground">clm_...</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-faint">
                  Provenance receipt
                </dt>
                <dd className="mt-1 font-mono text-foreground">rcpt_...</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-faint">
                  Identity
                </dt>
                <dd className="mt-1 text-foreground">expected apple / predicted unknown produce</dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-widest text-faint">
                  Fraud signals
                </dt>
                <dd className="mt-1 text-foreground">missing_metadata, blur_score</dd>
              </div>
            </dl>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            The visible result is intentionally advisory. It proves the claim path reaches a
            reviewable state without claiming an automatic refund.
          </p>
        </article>

        <article className="rounded-3xl border border-border bg-surface p-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Reviewer surface
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            Queue + guarded policy
          </h2>
          <div className="mt-4 rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">apple</p>
                <p className="font-mono text-xs text-muted">1 pending - $4.99</p>
              </div>
              <span className="rounded-full bg-brand-tint px-3 py-1 font-mono text-xs font-semibold text-brand">
                human-review-only
              </span>
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
              {reviewerFields.map((field) => (
                <li key={field} className="rounded border border-border bg-surface px-3 py-2">
                  <code>{field}</code>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 rounded-2xl border border-warning/40 bg-warning/10 p-4">
            <p className="font-semibold text-warning">Policy guardrail</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Calibration gate is RE-SCOPE, decision mode is human-review-only, and
              auto approval remains disabled. Policy save waits for a successful GET
              revision before sending expected_revision.
            </p>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-6">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Evidence boundary
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          What is proven, and what stays a GAP
        </h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-border">
              {evidenceRows.map(([label, value]) => (
                <tr key={label}>
                  <th className="w-40 bg-background px-4 py-3 font-mono text-xs uppercase tracking-widest text-faint">
                    {label}
                  </th>
                  <td className="px-4 py-3 text-muted">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted">
          The real iPhone TestFlight build reached the produce freshness result screen.
          The installed iOS app did not expose the full item + receipt return/claim path,
          so the device study was reported as GAP rather than overclaimed as a pass.
        </p>
      </section>
    </section>
  );
}
