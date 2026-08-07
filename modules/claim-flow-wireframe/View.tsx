const screens = [
  {
    number: "01",
    title: "Snap the item",
    question: "What item are you claiming?",
    body: "Start with an in-app item photo. Camera-permission and photo-quality problems return the shopper to a clear retake action.",
    action: "Take photo",
  },
  {
    number: "02",
    title: "Add the purchase",
    question: "What did you buy?",
    body: "Collect item name, price, store, purchase date, and receipt photo together because they describe one purchase.",
    action: "Continue",
  },
  {
    number: "03",
    title: "Review the evidence",
    question: "Is everything correct?",
    body: "Show both photos and purchase fields before submission. Scores remain advisory; policy and a reviewer decide.",
    action: "Submit claim",
  },
  {
    number: "04",
    title: "Explain what happens next",
    question: "What is the claim state?",
    body: "Show human review, remaining cap, provenance receipt ID, and a recovery path without claiming payment or guaranteed approval.",
    action: "Done",
  },
];

const decisions = [
  ["One question per screen", "Reduce cognitive load and make the next action obvious."],
  ["No dead ends", "Every error offers edit, retake, or restart recovery."],
  ["Advisory language", "Never say the AI confirms or guarantees spoilage."],
  ["Evidence before outcome", "Item and receipt context are reviewable before policy runs."],
];

export default function View() {
  return (
    <section className="space-y-10">
      <header className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border bg-brand-tint px-6 py-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Program Week 3 · Issue #37 · PR #47 · Owner Ziyun
          </p>
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Design the claim journey before writing the UI
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Week 3 was the starting contract for the shopper experience. I wrote a
            234-line Markdown wireframe that made the item photo, receipt evidence,
            advisory copy, human-review state, provenance receipt, and recovery paths
            visible before Week 6 turned them into browser and native surfaces.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://github.com/LawrenceHua/es-intern-freshlens/issues/37" target="_blank" rel="noreferrer" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
              Issue #37
            </a>
            <a href="https://github.com/LawrenceHua/es-intern-freshlens/pull/47" target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
              Merged PR #47
            </a>
            <a href="https://github.com/LawrenceHua/es-intern-freshlens/blob/main/docs/wireframes/claim-flow-v0.md" target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">
              Source wireframe
            </a>
          </div>
        </div>
      </header>

      <section>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Four-screen contract
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-foreground">One question, one next action</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {screens.map((screen) => (
            <article key={screen.number} className="flex min-h-[26rem] flex-col rounded-[2.25rem] border-[7px] border-slate-950 bg-[#f7f2e7] p-5 text-slate-950 shadow-lg">
              <div className="mx-auto h-4 w-20 rounded-full bg-slate-950" />
              <p className="mt-8 font-mono text-xs font-semibold text-emerald-800">SCREEN {screen.number}</p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight">{screen.title}</h3>
              <p className="mt-3 text-sm font-semibold text-emerald-900">{screen.question}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{screen.body}</p>
              <div className="mt-auto pt-8">
                <div className="rounded-xl bg-emerald-800 px-4 py-3 text-center font-semibold text-white">
                  {screen.action}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <article className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            UX decisions
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Small rules that shaped later builds</h2>
          <div className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {decisions.map(([title, body]) => (
              <div key={title} className="grid gap-2 bg-background p-4 sm:grid-cols-[12rem_1fr]">
                <p className="font-semibold text-foreground">{title}</p>
                <p className="text-sm leading-6 text-muted">{body}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-warning/40 bg-warning/10 p-6 sm:p-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-warning">
            Week 3 boundary
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">A wireframe, not runtime proof</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            PR #47 established the intended shopper sequence and copy. It did not prove a
            deployed backend, a physical-device path, an automatic approval, or money movement.
            Under the program&apos;s RE-SCOPE gate, otherwise eligible claims remain human-review-only.
          </p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Deliverable", "claim-flow-v0.md"],
              ["Size", "234 lines"],
              ["Outcome copy", "advisory"],
              ["Runtime", "planned for Week 6"],
            ].map(([term, value]) => (
              <div key={term} className="rounded-2xl border border-border bg-surface p-4">
                <dt className="font-mono text-[11px] uppercase tracking-widest text-faint">{term}</dt>
                <dd className="mt-1 font-semibold text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          Evolution
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">From paper contract to native evidence</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ["Week 3", "Wireframe", "Four shopper screens and recovery copy."],
            ["Week 5", "Evidence flow", "Receipt, identity, and fraud context."],
            ["Week 6", "Browser UX", "Shopper wizard and guarded reviewer surface."],
            ["Week 8", "Native proof", "Exact-build claim entry and fail-closed result."],
          ].map(([week, title, body]) => (
            <article key={week} className="rounded-2xl border border-border bg-background p-5">
              <p className="font-mono text-xs font-semibold text-brand">{week}</p>
              <h3 className="mt-2 font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
