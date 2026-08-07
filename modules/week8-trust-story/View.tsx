const outcomes = [
  {
    number: "01",
    title: "Made each decision checkable",
    body: "A shopper or support person can check that a decision is genuine without receiving the secret used to create it.",
  },
  {
    number: "02",
    title: "Made silent edits visible",
    body: "If someone changes the store, amount, decision, or identity afterward, the record no longer passes the check.",
  },
  {
    number: "03",
    title: "Kept older records working",
    body: "We can improve how new records are protected while older, legitimate records remain checkable.",
  },
] as const;

function ResultCard({
  label,
  title,
  body,
  tone,
}: {
  label: string;
  title: string;
  body: string;
  tone: "good" | "bad";
}) {
  const styles =
    tone === "good"
      ? "border-success/30 bg-success/10 text-success"
      : "border-danger/30 bg-danger/10 text-danger";

  return (
    <article className={`rounded-2xl border p-5 sm:p-6 ${styles}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-current text-lg font-semibold">
          {tone === "good" ? "OK" : "!"}
        </span>
      </div>
      <h3 className="mt-7 text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
    </article>
  );
}

export default function View() {
  return (
    <section className="space-y-12">
      <header className="overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-success">
              Week 8 / Lezhi
            </p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              I made FreshLens decisions easier to trust.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              This week was not about adding another flashy feature. It was about making sure a
              decision can be checked later, cannot be quietly rewritten, and never looks more
              complete than it really is.
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

      <div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-faint">What I completed</p>
            <h3 className="mt-2 text-2xl font-semibold">Three improvements people can feel</h3>
          </div>
          <span className="hidden text-sm text-faint sm:block">No specialist knowledge required</span>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {outcomes.map((outcome) => (
            <article key={outcome.number} className="rounded-2xl border border-border bg-surface p-5">
              <span className="font-mono text-xs text-faint">{outcome.number}</span>
              <h4 className="mt-6 text-lg font-semibold">{outcome.title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted">{outcome.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-faint">The proof in one picture</p>
          <h3 className="mt-2 text-2xl font-semibold">One record. One small change. A clear answer.</h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            I checked both sides of the promise: the original record is accepted, while a copy with
            one important detail changed is rejected immediately.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ResultCard
            label="Original record"
            title="Matches what was decided"
            body="The shopper, support team, or another system can check it without being given a private secret."
            tone="good"
          />
          <ResultCard
            label="Edited copy"
            title="Change detected"
            body="A changed amount, store, decision, or identity is refused instead of being mistaken for the original."
            tone="bad"
          />
        </div>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-faint">I also tested the real phone experience</p>
        <h3 className="mt-2 text-2xl font-semibold">What works today - and what does not</h3>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-success/30 bg-success/5 p-5 sm:p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-success">Working on my phone</p>
            <h4 className="mt-4 text-xl font-semibold">Receipt items now stay saved</h4>
            <p className="mt-2 text-sm leading-6 text-muted">
              I added a test banana from a receipt, reopened the app, and the item was still in my
              inventory. I also recorded five real-world edge-case photos for future checks.
            </p>
          </article>

          <article className="rounded-2xl border border-warning/30 bg-warning/5 p-5 sm:p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">Still not available</p>
            <h4 className="mt-4 text-xl font-semibold">Scanning and claim submission remain paused</h4>
            <p className="mt-2 text-sm leading-6 text-muted">
              The app clearly says these services are not ready yet. I documented that limit rather
              than presenting an unfinished path as a completed shopper experience.
            </p>
          </article>
        </div>
      </div>

      <footer className="rounded-3xl border border-info/30 bg-info/5 p-6 text-center sm:p-8">
        <p className="font-mono text-xs uppercase tracking-widest text-info">My Week 8 takeaway</p>
        <p className="mx-auto mt-3 max-w-3xl text-xl font-semibold leading-relaxed sm:text-2xl">
          A trustworthy product is not one that claims everything works. It is one that proves what
          did happen, catches what changed, and is honest about what comes next.
        </p>
      </footer>
    </section>
  );
}
