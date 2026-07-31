import {
  candidate,
  headline,
  authorityMatrix,
  states,
  errorClasses,
  designRules,
  evidence,
  baseline,
  classification,
  limitations,
  recipeHeadline,
  recipeProof,
  recipeParadox,
  recipeGates,
  recipeOrdering,
  type Cell,
  type StateNode,
} from "./data";

/* ---------- small local primitives ---------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
      {children}
    </h3>
  );
}

function Stamp({ tone, children }: { tone: string; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    verified: "border-success/40 text-success",
    blocked: "border-danger/40 text-danger",
    waiting: "border-warning/40 text-warning",
    neutral: "border-border-strong text-faint",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function MatrixCell({ cell }: { cell: Cell }) {
  return (
    <td className="border-b border-border px-3 py-2 text-center align-middle">
      <span
        className={
          cell.deny
            ? "font-mono text-xs font-semibold text-danger"
            : "text-xs text-success"
        }
      >
        {cell.text}
      </span>
      {cell.note ? (
        <span className="ml-1 font-mono text-[10px] text-faint">({cell.note})</span>
      ) : null}
    </td>
  );
}

function StateChip({ node }: { node: StateNode }) {
  const styles: Record<StateNode["kind"], string> = {
    normal: "border-border-strong text-foreground",
    current: "border-brand bg-brand-tint font-semibold text-brand-strong",
    terminal: "border-foreground/60 font-semibold text-foreground",
    unreachable: "border-dashed border-faint text-faint line-through",
  };
  return (
    <span
      className={`whitespace-nowrap rounded border px-2.5 py-1 font-mono text-xs ${styles[node.kind]}`}
    >
      {node.name}
    </span>
  );
}

/* ---------- the view ---------- */

export default function View() {
  return (
    <section className="space-y-10">
      {/* ---- what this is ---- */}
      <div className="space-y-3">
        <p className="text-muted">
          This lane delivers the contract another application implements to talk to FreshLens:
          the endpoint and role matrix, the claim state machine, a closed error vocabulary, the
          money rules, a seven-step integration order and a four-level rollback. Everything below
          was re-run on <code>{candidate.commit}</code> before it was written down.
        </p>
        <p className="font-mono text-xs text-faint">
          {candidate.repo} · contract v{candidate.contractVersion} · {candidate.environment}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {headline.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">
              {s.label}
            </div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">
              {s.value}
            </div>
            <div className="mt-0.5 font-mono text-xs text-muted">{s.note}</div>
          </div>
        ))}
      </div>

      {/* ---- authority ---- */}
      <div>
        <SectionTitle>
          Server-derived authority — 8 operations across 4 roles
        </SectionTitle>
        <p className="mt-2 text-sm text-muted">
          A caller that supplies <code>reviewer_id</code>, <code>account_id</code> or{" "}
          <code>store_id</code> is rejected on <strong>presence alone</strong> — including a value
          that happens to be correct — with <code>403 authority_override_denied</code>. That check
          runs before resource scope, so impersonation is never masked behind a cross-store error.
        </p>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-surface-raised">
                <th className="border-b border-border-strong px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-muted">
                  Operation
                </th>
                <th className="border-b border-border-strong px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-muted">
                  Route
                </th>
                <th className="border-b border-border-strong px-3 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
                  shopper
                </th>
                <th className="border-b border-border-strong px-3 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
                  reviewer
                </th>
                <th className="border-b border-border-strong px-3 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
                  policy_admin
                </th>
              </tr>
            </thead>
            <tbody>
              {authorityMatrix.map((row) => (
                <tr key={row.route}>
                  <td className="border-b border-border px-3 py-2">{row.operation}</td>
                  <td className="border-b border-border px-3 py-2 font-mono text-xs text-muted">
                    {row.route}
                  </td>
                  <MatrixCell cell={row.shopper} />
                  <MatrixCell cell={row.reviewer} />
                  <MatrixCell cell={row.policyAdmin} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- state machine ---- */}
      <div>
        <SectionTitle>Claim state machine</SectionTitle>
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-4">
          <StateChip node={states[0]} />
          <span className="text-faint">→</span>
          <StateChip node={states[1]} />
          <span className="text-faint">→</span>
          <StateChip node={states[2]} />
          <span className="text-faint">→</span>
          <StateChip node={states[3]} />
          <span className="text-faint">/</span>
          <StateChip node={states[4]} />
          <span className="px-2 text-faint">|</span>
          <StateChip node={states[5]} />
          <span className="font-mono text-xs text-faint">
            unreachable while the calibration gate is RE-SCOPE
          </span>
        </div>
        <p className="mt-2 text-sm text-muted">
          <code>approved</code> and <code>declined</code> are terminal; re-reviewing either is{" "}
          <code>409 invalid_transition</code>. An evaluation that <em>numerically</em> qualifies
          for auto-approval still routes to <code>human_review</code>, every time —{" "}
          <strong>that is success, not an error</strong>, and <code>status</code> stays{" "}
          <code>ok</code>. In-flight state is a status value and never an error code, so a host
          polling status cannot mistake &quot;not done yet&quot; for a completed decision.
        </p>
      </div>

      {/* ---- error classes ---- */}
      <div>
        <SectionTitle>Closed error set — 21 codes in two classes</SectionTitle>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {errorClasses.map((c) => (
            <div key={c.name} className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{c.name}</span>
                <span className="font-mono text-2xl font-semibold tabular-nums">{c.count}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Stamp tone={c.recovery ? "verified" : "neutral"}>
                  {c.recovery ? "carries recovery_action" : "no recovery_action"}
                </Stamp>
                <Stamp tone="neutral">claim status {c.claimStatus}</Stamp>
              </div>
              <p className="mt-2 font-mono text-xs leading-relaxed text-muted">{c.examples}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {designRules.map((r) => (
            <div
              key={r.rule}
              className="rounded-lg border border-border border-l-4 border-l-brand bg-surface p-3 text-sm"
            >
              <div className="font-semibold">{r.rule}</div>
              <p className="mt-1 text-muted">{r.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---- evidence ---- */}
      <div>
        <SectionTitle>Evidence — command, actual output, candidate commit</SectionTitle>
        <p className="mt-2 text-sm text-muted">
          A row may only cite what its commit actually contains. The contract validator is real
          and passing, but it lives in an unmerged pull request, so it is recorded as a limitation
          rather than quoted as if it ran on the candidate.
        </p>
        <ul className="mt-3 space-y-2">
          {evidence.map((row) => (
            <li
              key={row.command}
              className={`rounded-lg border border-border border-l-4 bg-surface p-3 ${
                row.status === "verified" ? "border-l-success" : "border-l-warning"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <code className="font-mono text-xs">{row.command}</code>
                <Stamp tone={row.status === "verified" ? "verified" : "waiting"}>
                  {row.status === "verified" ? "verified" : "not on candidate"}
                </Stamp>
              </div>
              <div className="mt-1.5 font-mono text-sm font-semibold tabular-nums">
                {row.output}
              </div>
              {row.detail ? (
                <p className="mt-1 text-xs text-muted">{row.detail}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      {/* ---- baseline ---- */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <SectionTitle>Baseline — re-measured, never adjusted</SectionTitle>
        <div className="mt-2 font-mono text-sm tabular-nums">
          main {baseline.commit} = <strong>{baseline.passed.toLocaleString()} passed</strong> /{" "}
          {baseline.failed} failed / {baseline.errors} errors
        </div>
        <p className="mt-2 text-sm text-muted">{baseline.note}</p>
      </div>

      {/* ---- classification ---- */}
      <div>
        <SectionTitle>Three things, three different statuses</SectionTitle>
        <p className="mt-2 text-sm text-muted">
          Friday acceptance requires the host adapter to be classified separately from native
          navigation, archive and device status. This is the distinction a terminal cannot express.
        </p>
        <ul className="mt-3 space-y-2">
          {classification.map((c) => (
            <li
              key={c.id}
              className={`rounded-lg border border-border border-l-4 bg-surface p-4 ${
                c.status === "verified"
                  ? "border-l-success"
                  : c.status === "blocked"
                    ? "border-l-danger"
                    : "border-l-warning"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-semibold text-faint">{c.id}</span>
                  <span className="font-semibold">{c.title}</span>
                </div>
                <Stamp
                  tone={
                    c.status === "verified"
                      ? "verified"
                      : c.status === "blocked"
                        ? "blocked"
                        : "waiting"
                  }
                >
                  {c.stamp}
                </Stamp>
              </div>
              <p className="mt-1.5 text-sm text-muted">{c.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* ---- recipe track ---- */}
      <div>
        <SectionTitle>Recipe track #86–88 — the honest critical path</SectionTitle>
        <p className="mt-2 text-sm text-muted">{recipeOrdering.overdue}</p>

        <div className="mt-3 rounded-lg border border-border border-l-4 border-l-brand bg-surface p-4">
          <p className="font-semibold">{recipeHeadline}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {recipeProof.map((p) => (
              <div key={p.label} className="rounded border border-border p-2.5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
                  {p.label}
                </div>
                <div className="mt-0.5 font-mono text-sm font-semibold tabular-nums">
                  {p.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* the paradox */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-danger">
              Production — approved rows only
            </div>
            <ul className="mt-2 space-y-1.5">
              {recipeParadox.production.map((m) => (
                <li key={m.metric} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-muted">{m.metric}</span>
                  <span className="flex items-baseline gap-2">
                    <span
                      className={`font-mono font-semibold tabular-nums ${m.bad ? "text-danger" : ""}`}
                    >
                      {m.value}
                    </span>
                    {m.floor ? (
                      <span className="font-mono text-[10px] text-faint">{m.floor}</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-success">
              Diagnostic — same evaluator, draft rows
            </div>
            <ul className="mt-2 space-y-1.5">
              {recipeParadox.diagnostic.map((m) => (
                <li key={m.metric} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-muted">{m.metric}</span>
                  <span className="font-mono font-semibold tabular-nums text-success">
                    {m.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted">{recipeParadox.explanation}</p>

        {/* the gate chain */}
        <ul className="mt-4 space-y-2">
          {recipeGates.map((g) => (
            <li
              key={g.id}
              className={`rounded-lg border border-border border-l-4 bg-surface p-3.5 ${
                g.state === "done"
                  ? "border-l-success"
                  : g.state === "blocked"
                    ? "border-l-danger"
                    : g.state === "waiting"
                      ? "border-l-warning"
                      : "border-l-faint"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-semibold tabular-nums text-faint">
                    {g.id}
                  </span>
                  <span className="text-sm font-semibold">{g.title}</span>
                </div>
                <Stamp
                  tone={
                    g.state === "done"
                      ? "verified"
                      : g.state === "blocked"
                        ? "blocked"
                        : g.state === "waiting"
                          ? "waiting"
                          : "neutral"
                  }
                >
                  {g.stamp}
                </Stamp>
              </div>
              <p className="mt-1.5 text-sm text-muted">{g.detail}</p>
              <p className="mt-1 font-mono text-[11px] text-faint">owner: {g.owner}</p>
            </li>
          ))}
        </ul>

        {/* ordering constraint */}
        <div className="mt-3 rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
            The ordering constraint is real and easy to get wrong
          </p>
          <p className="mt-2 text-muted">{recipeOrdering.warning}</p>
          <p className="mt-2 flex flex-wrap items-center gap-2 font-mono text-xs">
            {recipeOrdering.order.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                {i > 0 ? <span className="text-faint">→</span> : null}
                <span className="rounded border border-border-strong px-2 py-0.5">{step}</span>
              </span>
            ))}
            <span className="ml-2 text-faint">never {recipeOrdering.wrong}</span>
          </p>
          <p className="mt-2 text-muted">{recipeOrdering.conclusion}</p>
        </div>
      </div>

      {/* ---- limitations ---- */}
      <div>
        <SectionTitle>Said out loud — the two limitations inside this lane</SectionTitle>
        <ul className="mt-3 space-y-2">
          {limitations.map((l) => (
            <li
              key={l.title}
              className="rounded-lg border border-border border-l-4 border-l-danger bg-surface p-3 text-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-semibold">{l.title}</span>
                <span className="font-mono text-[11px] text-faint">{l.owner}</span>
              </div>
              <p className="mt-1 text-muted">{l.consequence}</p>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm font-semibold">
        Lane #158 · three pull requests green and awaiting a human approval · nine cross-reviews
        delivered this week.
      </p>
    </section>
  );
}
