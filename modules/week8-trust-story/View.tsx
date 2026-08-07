const deliverables = [
  {
    number: "01",
    title: "Create keys safely",
    built: "FreshLens can create the private signing key and the public checking key it needs.",
    meaning: "The private key stays protected, while the public key can be shared for checking records.",
  },
  {
    number: "02",
    title: "Seal every decision",
    built: "Each decision receives a unique digital signature tied to its exact original details.",
    meaning: "The seal belongs to that record only; it cannot simply be copied onto a different decision.",
  },
  {
    number: "03",
    title: "Check it later",
    built: "The public checking key can confirm whether a record and its seal still match.",
    meaning: "A shopper, support person, or another system can check the record without receiving the private key.",
  },
  {
    number: "04",
    title: "Change keys responsibly",
    built: "Every signature carries a key identifier, and new signing keys can replace older ones.",
    meaning: "FreshLens knows which public key should check each record, so older records remain understandable after an update.",
  },
  {
    number: "05",
    title: "Keep secrets out of sight",
    built: "Private signing material is supplied through a protected setup instead of being placed inside the product.",
    meaning: "People using or reviewing FreshLens do not need to see, copy, or share the private secret.",
  },
] as const;

export default function View() {
  return (
    <section className="space-y-12">
      <header className="overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-success">
              Week 8 / Lezhi / #156
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              I gave every FreshLens decision a trustworthy seal.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              This week I built the part that shows where a decision came from, keeps its private
              proof safe, and makes later changes easy to spot.
            </p>
          </div>

          <div className="rounded-2xl border border-success/30 bg-success/10 p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-success">The simple promise</p>
            <p className="mt-3 text-2xl font-semibold leading-snug">
              Genuine records pass. Changed records do not.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-3 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-3 sm:p-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-faint">Assigned segment</p>
          <p className="mt-2 font-semibold">Decision signing</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-faint">Foundation</p>
          <p className="mt-2 font-semibold">Ed25519 digital signatures</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-faint">Primary deliverable</p>
          <p className="mt-2 font-semibold">Create, sign, check, update, reject changes</p>
        </div>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-faint">What I delivered</p>
        <h3 className="mt-2 text-2xl font-semibold">The full signing path, explained simply</h3>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {deliverables.map((item) => (
            <article key={item.number} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <span className="font-mono text-xs text-faint">{item.number}</span>
              <h4 className="mt-6 text-xl font-semibold">{item.title}</h4>
              <div className="mt-4 space-y-4 text-sm leading-6 text-muted">
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-widest text-foreground">What I built</p>
                  <p className="mt-1">{item.built}</p>
                </div>
                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-widest text-foreground">Why it matters</p>
                  <p className="mt-1">{item.meaning}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-faint">How it protects people</p>
        <h3 className="mt-2 text-2xl font-semibold">A silent edit can no longer look genuine.</h3>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base sm:leading-7">
          If someone changes an important detail after a decision is issued, the seal no longer
          matches. FreshLens rejects that changed copy instead of treating it as the original.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-success/30 bg-success/10 p-5 sm:p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-success">Original record</p>
            <p className="mt-4 text-xl font-semibold">Seal matches</p>
            <p className="mt-2 text-sm leading-6 text-muted">The record is accepted as the decision FreshLens issued.</p>
          </article>

          <article className="rounded-2xl border border-danger/30 bg-danger/10 p-5 sm:p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-danger">Changed record</p>
            <p className="mt-4 text-xl font-semibold">Seal does not match</p>
            <p className="mt-2 text-sm leading-6 text-muted">The changed copy is rejected instead of being trusted.</p>
          </article>
        </div>
      </div>

      <footer className="rounded-3xl border border-info/30 bg-info/5 p-6 text-center sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-info">My Week 8 result</p>
        <p className="mx-auto mt-3 max-w-3xl text-xl font-semibold leading-relaxed sm:text-2xl">
          FreshLens decisions can now be issued safely, checked by others, updated responsibly,
          and rejected when someone changes the record.
        </p>
      </footer>
    </section>
  );
}
