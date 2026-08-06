import { gate, checks, gates, cards, guard, falseGreen } from "./data";

const CARD = "rounded border border-border p-5";
const LABEL =
  "font-mono text-xs font-medium uppercase tracking-widest text-muted";
const BIG = "font-mono text-5xl tabular-nums";

export default function View() {
  return (
    <section className="space-y-6">
      <p className="text-lg text-foreground">
        Checking the evidence behind a model number was a checklist a person
        read. <span className="text-brand">Now it is a command.</span>
      </p>

      {/* 1 — the result */}
      <div className={CARD}>
        <h3 className={LABEL}>Run it today</h3>
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
      </div>

      {/* 2 — what it checks */}
      <div className={CARD}>
        <h3 className={LABEL}>What the 13 checks are</h3>
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

      {/* 3 — the four gates */}
      <div className={CARD}>
        <h3 className={LABEL}>The four gates I own</h3>
        <div className="mt-3 flex items-baseline gap-4">
          <span className={`${BIG} text-danger`}>4</span>
          <span className="text-sm text-muted">blocked, none of them mine to clear</span>
        </div>
        <ul className="mt-5 space-y-2">
          {gates.map((g) => (
            <li key={g.name} className="flex flex-wrap items-baseline gap-2 text-sm">
              <span className="font-mono text-danger">{g.name}</span>
              <span className="text-muted">{g.why}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4 — what is missing */}
      <div className={CARD}>
        <h3 className={LABEL}>Model cards</h3>
        <div className="mt-3 flex items-baseline gap-4">
          <span className={`${BIG} text-foreground`}>
            {cards.blocked}
            <span className="text-faint">/{cards.total}</span>
          </span>
          <span className="text-sm text-muted">describe something we cannot check</span>
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
          A card exists because the thing does not. An absence nobody wrote down
          becomes a confident answer later.
        </p>
      </div>

      {/* 5 — it refuses */}
      <div className={CARD}>
        <h3 className={LABEL}>It refuses anyway</h3>
        <div className="mt-3 flex items-baseline gap-4">
          <span className={`${BIG} text-foreground`}>
            {guard.checks}
            <span className="text-faint">/{guard.checks}</span>
          </span>
          <span className="font-mono text-sm text-warning">{guard.status}</span>
        </div>
        <p className="mt-4 text-sm text-muted">{guard.line}</p>
      </div>

      {/* 6 — the bug */}
      <div className={CARD}>
        <h3 className={LABEL}>It had a bug</h3>
        <div className="mt-3 flex items-baseline gap-4">
          <span className={`${BIG} text-danger`}>{falseGreen.gates}</span>
          <span className="text-sm text-muted">gates, one signature</span>
        </div>
        <p className="mt-4 text-sm text-foreground">{falseGreen.line}</p>
        <p className="mt-2 text-sm text-muted">{falseGreen.detail}</p>
        <p className="mt-2 text-sm text-muted">{falseGreen.fixed}</p>
      </div>

      <p className="text-sm text-muted">
        Nothing here says the model is good. It says what is missing.
      </p>
    </section>
  );
}
