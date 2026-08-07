import { checks, guard, falseGreen, gate, gates, cards, done, left } from "./data";

const CARD = "rounded border border-border p-5";
const LABEL =
  "font-mono text-xs font-medium uppercase tracking-widest text-muted";
const BIG = "font-mono text-5xl tabular-nums";

export default function View() {
  return (
    <section className="space-y-6">
      {/* 1 — the problem */}
      <p className="text-lg text-foreground">
        Nobody checked the evidence behind a model number. It was a page of
        instructions a person read.{" "}
        <span className="text-brand">Now it is a command.</span>
      </p>

      {/* 2 — what I built */}
      <div className={CARD}>
        <h3 className={LABEL}>What it checks</h3>
        <ol className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {checks.map((c, i) => (
            <li key={c} className="flex gap-3 text-sm">
              <span className="font-mono text-faint tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={
                  i === 9 || i === 10 ? "text-danger" : "text-foreground"
                }
              >
                {c}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm text-muted">
          Digests are recomputed from disk, never trusted from the file.
        </p>
      </div>

      {/* 3 — proof it is not a rubber stamp */}
      <div className={CARD}>
        <h3 className={LABEL}>It can say no</h3>
        <div className="mt-3 flex items-baseline gap-4">
          <span className={`${BIG} text-foreground`}>
            {guard.checks}
            <span className="text-faint">/{guard.checks}</span>
          </span>
          <span className="font-mono text-sm text-warning">{guard.status}</span>
        </div>
        <p className="mt-4 text-sm text-muted">{guard.line}</p>
        <div className="mt-5 border-t border-border pt-4">
          <div className="flex items-baseline gap-4">
            <span className={`${BIG} text-danger`}>{falseGreen.gates}</span>
            <span className="text-sm text-muted">gates, one signature</span>
          </div>
          <p className="mt-4 text-sm text-foreground">{falseGreen.line}</p>
          <p className="mt-2 text-sm text-muted">{falseGreen.detail}</p>
          <p className="mt-2 text-sm text-muted">{falseGreen.fixed}</p>
        </div>
      </div>

      {/* 4 — what it says today */}
      <div className={CARD}>
        <h3 className={LABEL}>What it says today</h3>
        <div className="mt-3 flex items-baseline gap-4">
          <span className={`${BIG} text-foreground`}>
            {gate.passed}
            <span className="text-faint">/{gate.total}</span>
          </span>
          <span className="font-mono text-sm text-danger">
            BLOCKED · exit {gate.exitCode}
          </span>
        </div>
        <ul className="mt-5 space-y-2">
          {gate.blockers.map((b) => (
            <li key={b.plain} className="flex flex-wrap items-baseline gap-2 text-sm">
              <span className="text-danger">✕</span>
              <span className="text-foreground">{b.plain}</span>
              <span className="text-faint">— {b.who}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-sm text-muted">All four gates I own, blocked:</p>
          <ul className="mt-3 space-y-2">
            {gates.map((g) => (
              <li key={g.name} className="flex flex-wrap items-baseline gap-2 text-sm">
                <span className="font-mono text-danger">{g.name}</span>
                <span className="text-muted">{g.why}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5 — what is missing */}
      <div className={CARD}>
        <h3 className={LABEL}>What is missing</h3>
        <div className="mt-3 flex items-baseline gap-4">
          <span className={`${BIG} text-foreground`}>
            {cards.blocked}
            <span className="text-faint">/{cards.total}</span>
          </span>
          <span className="text-sm text-muted">
            model cards describe something we cannot check
          </span>
        </div>
        <ul className="mt-5 space-y-2">
          {cards.lines.map((l) => (
            <li key={l} className="flex gap-2 text-sm text-muted">
              <span className="text-warning">!</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-foreground">
          A card exists because the thing does not. An absence nobody writes
          down becomes a confident answer later.
        </p>
      </div>

      {/* 6 — done and left */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className={CARD}>
          <h3 className={LABEL}>Done this week</h3>
          <ul className="mt-4 space-y-2">
            {done.map((d) => (
              <li key={d} className="flex gap-2 text-sm text-foreground">
                <span className="text-brand">✓</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={CARD}>
          <h3 className={LABEL}>Left to do</h3>
          <ul className="mt-4 space-y-2">
            {left.map((l) => (
              <li key={l.what} className="flex flex-wrap items-baseline gap-2 text-sm">
                <span className="text-faint">→</span>
                <span className="text-muted">{l.what}</span>
                <span className="text-faint">— {l.who}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7 — last line */}
      <p className="text-sm text-muted">
        Nothing here says the model is good. It says what is missing, and who
        has to fix it.
      </p>
    </section>
  );
}
