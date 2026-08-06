import {
  stats,
  shipped,
  locked,
  closedLoop,
  gaps,
  antiVacuity,
  contractParts,
  knownGaps,
} from "./data";

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">
        Week 6 was two jobs: give a reviewer something to look at, and freeze what a host has to
        honour. One shipped routes; the other shipped a schema plus a validator that does not
        trust its own fixtures.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">
              {s.label}
            </div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Part 1 */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          #105 — what a reviewer can now do
        </h3>
        <ul className="mt-3 space-y-2">
          {shipped.map((s) => (
            <li key={s.route} className="rounded-lg border border-border bg-surface p-3 text-sm">
              <div className="font-mono text-xs font-semibold">{s.route}</div>
              <div className="mt-1 text-muted">{s.note}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-border border-l-4 border-l-brand bg-surface p-4 text-sm">
        <div className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          What a policy write may never reach
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {locked.fields.map((f) => (
            <code
              key={f}
              className="rounded border border-border px-2 py-0.5 font-mono text-xs"
            >
              {f}
            </code>
          ))}
        </div>
        <p className="mt-2 text-muted">{locked.rule}</p>
      </div>

      <div className="rounded border border-border px-4 py-3 text-sm">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          A week 3 loose end, closed here
        </h3>
        <p className="mt-2 text-muted">{closedLoop}</p>
      </div>

      {/* Part 2 */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          #129 — eight owners&apos; fields, one frozen contract
        </h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {contractParts.map((c) => (
            <li key={c.name} className="rounded-lg border border-border bg-surface p-3 text-sm">
              <div className="font-mono text-xs font-semibold">{c.name}</div>
              <div className="mt-1 font-mono text-xs text-muted">{c.note}</div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Nine gaps the adversarial pass found — in my own rule engine, before review
        </h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {gaps.map((g) => (
            <li
              key={g}
              className="rounded-full border border-danger/40 bg-danger/5 px-3 py-1 font-mono text-xs text-muted"
            >
              {g}
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded border border-border px-4 py-3 text-sm text-muted">
          Two new error codes came out of it (<code>missing_required_field</code>,{" "}
          <code>invalid_enum_value</code>) and the fixture matrix grew from 3/17 to{" "}
          <span className="font-semibold text-foreground">4 valid / 20 invalid</span> — the
          coverage that had let those eight hide.
        </p>
      </div>

      <div className="rounded border border-border px-4 py-3 text-sm">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Why the validator does not read the fixture&apos;s own answer
        </h3>
        <p className="mt-2 text-muted">{antiVacuity}</p>
      </div>

      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          Known gaps — written into §11 of the contract, not left out of it
        </p>
        <ul className="mt-2 space-y-1.5">
          {knownGaps.map((k) => (
            <li key={k} className="text-muted">
              {k}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm font-semibold">PR #131 and PR #148 — both merged to main.</p>
    </section>
  );
}
