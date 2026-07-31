import {
  candidate,
  headline,
  authorityMatrix,
  states,
  errorCodes,
  errorClasses,
  corpus,
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

/* ------------------------------------------------------------------ */
/* primitives                                                          */
/* ------------------------------------------------------------------ */

const TONE: Record<string, { text: string; border: string; dot: string; bg: string }> = {
  verified: { text: "text-success", border: "border-success/45", dot: "bg-success", bg: "bg-success/8" },
  blocked: { text: "text-danger", border: "border-danger/45", dot: "bg-danger", bg: "bg-danger/8" },
  waiting: { text: "text-warning", border: "border-warning/45", dot: "bg-warning", bg: "bg-warning/8" },
  neutral: { text: "text-faint", border: "border-border-strong", dot: "bg-faint", bg: "bg-surface-raised" },
};

function SectionTitle({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-border-strong pb-2">
      <span className="font-mono text-xs font-semibold tabular-nums text-brand">{n}</span>
      <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
        {children}
      </h3>
    </div>
  );
}

function Stamp({ tone, children }: { tone: string; children: React.ReactNode }) {
  const t = TONE[tone] ?? TONE.neutral;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest ${t.border} ${t.text}`}
    >
      <span className={`size-1.5 rounded-full ${t.dot}`} />
      {children}
    </span>
  );
}

/** Progressive disclosure: the claim stays visible, the paragraph folds away. */
function Why({ children }: { children: React.ReactNode }) {
  return (
    <details className="group mt-2">
      <summary className="cursor-pointer list-none font-mono text-[10px] uppercase tracking-widest text-faint transition-colors hover:text-brand">
        <span className="group-open:hidden">+ why</span>
        <span className="hidden group-open:inline">− why</span>
      </summary>
      <p className="mt-2 border-l-2 border-border pl-3 text-sm leading-relaxed text-muted">
        {children}
      </p>
    </details>
  );
}

/* ------------------------------------------------------------------ */
/* section-specific visuals                                            */
/* ------------------------------------------------------------------ */

/** §2 — the grid reads as a shape: filled = allowed, hollow = denied. */
function MatrixCell({ cell }: { cell: Cell }) {
  return (
    <td className="border-b border-border p-1 text-center align-middle">
      <span
        className={`inline-flex min-w-[92px] items-center justify-center gap-1.5 rounded px-2 py-1 text-[11px] ${
          cell.deny
            ? "bg-danger/8 font-mono font-semibold text-danger"
            : "bg-success/10 text-success"
        }`}
      >
        <span aria-hidden>{cell.deny ? "✕" : "●"}</span>
        {cell.text}
      </span>
      {cell.note ? (
        <span className="ml-1 font-mono text-[10px] text-faint">{cell.note}</span>
      ) : null}
    </td>
  );
}

function StateChip({ node }: { node: StateNode }) {
  const styles: Record<StateNode["kind"], string> = {
    normal: "border-border-strong bg-surface text-foreground",
    current: "border-brand bg-brand-tint font-semibold text-brand-strong",
    terminal: "border-foreground/50 bg-surface font-semibold text-foreground ring-1 ring-inset ring-foreground/20",
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

/** §4 — 21 codes drawn as 21 objects, so the closed set is countable by eye. */
const STATUS_TONE: Record<number, string> = {
  401: "border-danger/40 text-danger",
  403: "border-danger/40 text-danger",
  409: "border-warning/40 text-warning",
  400: "border-warning/40 text-warning",
  429: "border-info/50 text-info",
  502: "border-info/50 text-info",
  503: "border-info/50 text-info",
  504: "border-info/50 text-info",
};

function CodeChip({ code, status }: { code: string; status: number }) {
  return (
    <li
      className={`flex items-center gap-1.5 rounded border bg-surface px-2 py-1 ${STATUS_TONE[status]}`}
    >
      <span className="font-mono text-[10px] font-bold tabular-nums opacity-70">{status}</span>
      <code className="font-mono text-[11px] text-foreground">{code}</code>
    </li>
  );
}

/**
 * §8 — the corpus meter. Forty cells: what is authored, what is reviewed, what
 * is missing. This is the number the whole recipe track turns on, so it is the
 * one thing on the page drawn at full size.
 */
function CorpusMeter() {
  const cells = Array.from({ length: corpus.floor }, (_, i) => {
    if (i < corpus.reviewed) return "reviewed";
    if (i < corpus.authored) return "draft";
    return "missing";
  });
  const style: Record<string, string> = {
    reviewed: "bg-success border-success",
    draft: "bg-warning/25 border-warning",
    missing: "border-dashed border-border-strong",
  };
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
          Corpus against the Friday floor
        </span>
        <span className="font-mono text-sm tabular-nums">
          <strong className="text-warning">{corpus.authored}</strong>
          <span className="text-faint"> authored / </span>
          <strong className="text-success">{corpus.reviewed}</strong>
          <span className="text-faint"> reviewed / </span>
          <strong className="text-foreground">{corpus.floor}</strong>
          <span className="text-faint"> required</span>
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {cells.map((k, i) => (
          <span
            key={i}
            className={`h-6 w-6 rounded border ${style[k]}`}
            title={`record ${i + 1}: ${k}`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[10px] text-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-success bg-success" /> reviewed — none yet
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-warning bg-warning/25" /> authored, draft
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-dashed border-border-strong" /> still to
          write — ours
        </span>
      </div>
    </div>
  );
}

/** §8 — floors as bars with a marker, not as two numbers in a list. */
function FloorBar({
  metric,
  value,
  floor,
  tone,
}: {
  metric: string;
  value: string;
  floor?: string;
  tone: "bad" | "good";
}) {
  const v = Number.parseFloat(value);
  const pct = Number.isNaN(v) ? 0 : Math.max(0, Math.min(1, v)) * 100;
  const f = floor ? Number.parseFloat(floor.replace(/[^\d.]/g, "")) * 100 : null;
  return (
    <li className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1.5">
      <span className="text-xs text-muted">{metric}</span>
      <span
        className={`font-mono text-xs font-semibold tabular-nums ${
          tone === "bad" ? "text-danger" : "text-success"
        }`}
      >
        {value}
      </span>
      <span className="col-span-2 relative h-1.5 rounded-full bg-border">
        <span
          className={`absolute inset-y-0 left-0 rounded-full ${
            tone === "bad" ? "bg-danger" : "bg-success"
          }`}
          style={{ width: `${pct}%` }}
        />
        {f !== null ? (
          <span
            className="absolute -top-0.5 h-2.5 w-px bg-foreground"
            style={{ left: `${f}%` }}
            title={floor}
          />
        ) : null}
      </span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* the view                                                            */
/* ------------------------------------------------------------------ */

export default function View() {
  const caller = errorCodes.filter((e) => e.cls === "caller");
  const dependency = errorCodes.filter((e) => e.cls === "dependency");

  return (
    <section className="space-y-12">
      {/* ============ 1. verdict board ============ */}
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {classification.map((c) => {
            const t = TONE[c.status === "partial" ? "waiting" : c.status];
            return (
              <div
                key={c.id}
                className={`flex flex-col gap-2 rounded-lg border p-4 ${t.border} ${t.bg}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                    {c.id}
                  </span>
                  <Stamp tone={c.status === "partial" ? "waiting" : c.status}>{c.stamp}</Stamp>
                </div>
                <div className="text-sm font-semibold leading-snug">{c.title}</div>
                <dl className="mt-auto grid gap-1 pt-1">
                  {c.facts.map((f) => (
                    <div key={f.k} className="flex items-baseline justify-between gap-2">
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-faint">
                        {f.k}
                      </dt>
                      <dd className={`font-mono text-xs font-semibold tabular-nums ${t.text}`}>
                        {f.v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <Why>{c.detail}</Why>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {headline.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-surface px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
                {s.label}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-semibold tabular-nums text-foreground">
                  {s.value}
                </span>
                <span className="font-mono text-[11px] text-muted">{s.note}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="font-mono text-[11px] text-faint">
          {candidate.repo} · contract v{candidate.contractVersion} · re-run on{" "}
          <code>{candidate.commit}</code> · {candidate.environment}
        </p>
      </div>

      {/* ============ 2. authority grid ============ */}
      <div className="space-y-3">
        <SectionTitle n="01">Server-derived authority · 8 operations × 4 roles</SectionTitle>
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="bg-surface-raised">
                {["Operation", "Route", "shopper", "reviewer", "policy_admin"].map((h, i) => (
                  <th
                    key={h}
                    className={`border-b border-border-strong px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted ${
                      i < 2 ? "text-left" : "text-center"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {authorityMatrix.map((row) => (
                <tr key={row.route} className="hover:bg-surface-raised/50">
                  <td className="border-b border-border px-3 py-1.5 text-[13px]">
                    {row.operation}
                  </td>
                  <td className="border-b border-border px-3 py-1.5 font-mono text-[11px] text-faint">
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
        <p className="text-sm text-muted">
          A caller that supplies <code>reviewer_id</code>, <code>account_id</code> or{" "}
          <code>store_id</code> is rejected on <strong>presence alone</strong> — including a value
          that happens to be correct — with <code>403 authority_override_denied</code>, checked
          before resource scope so impersonation is never masked behind a cross-store error.
        </p>
      </div>

      {/* ============ 3. state machine ============ */}
      <div className="space-y-3">
        <SectionTitle n="02">Claim state machine</SectionTitle>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface p-4">
          <StateChip node={states[0]} />
          <span className="text-faint">→</span>
          <StateChip node={states[1]} />
          <span className="text-faint">→</span>
          <StateChip node={states[2]} />
          <span className="text-faint">→</span>
          <StateChip node={states[3]} />
          <span className="text-faint">/</span>
          <StateChip node={states[4]} />
          <span className="mx-1 h-5 w-px bg-border-strong" />
          <StateChip node={states[5]} />
          <span className="font-mono text-[11px] text-faint">
            unreachable while the calibration gate is RE-SCOPE
          </span>
        </div>
        <p className="text-sm text-muted">
          <code>approved</code> and <code>declined</code> are terminal; re-reviewing either is{" "}
          <code>409 invalid_transition</code>. An evaluation that <em>numerically</em> qualifies for
          auto-approval still routes to <code>human_review</code>, every time —{" "}
          <strong>that is success, not an error</strong>, and <code>status</code> stays{" "}
          <code>ok</code>.
        </p>
      </div>

      {/* ============ 4. the closed error set, drawn ============ */}
      <div className="space-y-3">
        <SectionTitle n="03">Closed error set · 21 codes, two classes</SectionTitle>

        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="text-sm font-semibold">
              Caller fault{" "}
              <span className="font-mono text-xs font-normal text-faint">
                — status unchanged, no recovery_action
              </span>
            </span>
            <span className="font-mono text-2xl font-semibold tabular-nums">{caller.length}</span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {caller.map((e) => (
              <CodeChip key={e.code} {...e} />
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3 border-t border-border pt-4">
            <span className="text-sm font-semibold">
              Dependency{" "}
              <span className="font-mono text-xs font-normal text-faint">
                — status guaranteed unchanged, carries recovery_action
              </span>
            </span>
            <span className="font-mono text-2xl font-semibold tabular-nums text-info">
              {dependency.length}
            </span>
          </div>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {dependency.map((e) => (
              <CodeChip key={e.code} {...e} />
            ))}
          </ul>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-faint">
            the set is closed — a code outside these 21 is a contract violation, not a new error
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {designRules.map((r) => (
            <div key={r.rule} className="rounded-lg border border-border bg-surface p-3.5">
              <div className="text-sm font-semibold leading-snug">{r.rule}</div>
              <Why>{r.why}</Why>
            </div>
          ))}
        </div>
        <p className="font-mono text-[11px] text-faint">
          {errorClasses.map((c) => `${c.name}: claim status ${c.claimStatus}`).join("  ·  ")}
        </p>
      </div>

      {/* ============ 5. evidence ledger ============ */}
      <div className="space-y-3">
        <SectionTitle n="04">Evidence · command → actual output</SectionTitle>
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full min-w-[680px] text-sm">
            <tbody>
              {evidence.map((row) => (
                <tr key={row.command} className="border-b border-border last:border-0">
                  <td className="w-1.5 p-0">
                    <span
                      className={`block h-full min-h-[3rem] w-1.5 ${
                        row.status === "verified" ? "bg-success" : "bg-warning"
                      }`}
                    />
                  </td>
                  <td className="px-3 py-2.5 align-top">
                    <code className="font-mono text-[11px] text-muted">{row.command}</code>
                    <div className="mt-1 font-mono text-sm font-semibold tabular-nums">
                      {row.output}
                    </div>
                    {row.detail ? <Why>{row.detail}</Why> : null}
                  </td>
                  <td className="px-3 py-2.5 text-right align-top">
                    <Stamp tone={row.status === "verified" ? "verified" : "waiting"}>
                      {row.status === "verified" ? "verified" : "not on candidate"}
                    </Stamp>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm tabular-nums">
          <span className="text-[10px] uppercase tracking-widest text-faint">
            Baseline, re-measured
          </span>
          <span>
            main {baseline.commit} ={" "}
            <strong className="text-success">{baseline.passed.toLocaleString()} passed</strong> /{" "}
            <strong className="text-danger">{baseline.failed} failed</strong> / {baseline.errors}{" "}
            errors
          </span>
        </div>
        <Why>{baseline.note}</Why>
      </div>

      {/* ============ 6. recipe track ============ */}
      <div className="space-y-3">
        <SectionTitle n="05">Recipe track #86–88 · the honest critical path</SectionTitle>

        <p className="text-sm font-semibold leading-relaxed">{recipeHeadline}</p>

        <CorpusMeter />

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-danger/35 bg-surface p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-danger">
              Production — approved rows only
            </div>
            <ul className="mt-3 space-y-2.5">
              {recipeParadox.production.map((m) => (
                <FloorBar
                  key={m.metric}
                  metric={m.metric}
                  value={m.value}
                  floor={m.floor}
                  tone={m.bad ? "bad" : "good"}
                />
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-success/35 bg-surface p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-success">
              Diagnostic — same evaluator, draft rows
            </div>
            <ul className="mt-3 space-y-2.5">
              {recipeParadox.diagnostic.map((m) => (
                <FloorBar key={m.metric} metric={m.metric} value={m.value} tone="good" />
              ))}
            </ul>
          </div>
        </div>
        <p className="text-sm text-muted">{recipeParadox.explanation}</p>

        {/* gate rail */}
        <ol className="grid gap-2 md:grid-cols-2">
          {recipeGates.map((g) => {
            const tone =
              g.state === "done" ? "verified" : g.state === "blocked" ? "blocked" : "waiting";
            const t = TONE[tone];
            return (
              <li
                key={g.id}
                className={`flex flex-col rounded-lg border bg-surface p-3.5 ${
                  g.state === "done" ? "border-border opacity-70" : t.border
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold tabular-nums text-faint">
                    {g.id}
                  </span>
                  <Stamp tone={tone}>{g.stamp}</Stamp>
                </div>
                <div className="mt-1.5 text-sm font-semibold leading-snug">{g.title}</div>
                <div className="mt-1 font-mono text-[10px] text-faint">{g.owner}</div>
                <Why>{g.detail}</Why>
              </li>
            );
          })}
        </ol>

        <div className="rounded-lg border border-warning/40 bg-warning/5 p-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-warning">
              Order is load-bearing
            </span>
            {recipeOrdering.order.map((step, i) => (
              <span key={step} className="flex items-center gap-2 font-mono text-xs">
                {i > 0 ? <span className="text-faint">→</span> : null}
                <span className="rounded border border-border-strong bg-surface px-2 py-0.5">
                  {step}
                </span>
              </span>
            ))}
            <span className="font-mono text-xs text-danger line-through decoration-danger/60">
              {recipeOrdering.wrong}
            </span>
          </div>
          <p className="mt-3 text-sm text-muted">{recipeOrdering.warning}</p>
          <Why>{recipeOrdering.conclusion}</Why>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {recipeProof.map((p) => (
            <div key={p.label} className="rounded border border-border bg-surface px-3 py-2">
              <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
                {p.label}
              </div>
              <div className="mt-0.5 font-mono text-sm font-semibold tabular-nums">{p.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ 7. limitations ============ */}
      <div className="space-y-3">
        <SectionTitle n="06">Said out loud · the two limitations inside this lane</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {limitations.map((l) => (
            <div key={l.title} className="rounded-lg border border-danger/35 bg-surface p-3.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold leading-snug">{l.title}</span>
                <span className="shrink-0 font-mono text-[10px] text-faint">{l.owner}</span>
              </div>
              <Why>{l.consequence}</Why>
            </div>
          ))}
        </div>
      </div>

      <p className="border-t border-border-strong pt-4 font-mono text-xs text-muted">
        Lane #158 · three pull requests green and awaiting a human approval · nine cross-reviews
        delivered this week.
      </p>
    </section>
  );
}
