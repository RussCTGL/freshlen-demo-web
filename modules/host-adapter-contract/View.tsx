import {
  candidate,
  delivered,
  asks,
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
  recipeWhatItIs,
  recipeStages,
  recipeHeadline,
  recipeHeadlineWhy,
  paradoxVerdict,
  recipeProof,
  recipeGates,
  recipeOrdering,
  type Cell,
  type StateNode,
  type Stage,
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

/**
 * This page gets exported to PDF and sent on, so print has to be treated as a
 * real output, not an afterthought. Three things break by default:
 * every status colour drops out (browsers strip backgrounds when printing),
 * a collapsed <details> prints as nothing at all, and a visual gets sliced in
 * half across a page boundary. Scoped to this module only.
 */
const PRINT_CSS = `
@media print {
  /* Site chrome is interactive furniture: sticky week tabs and a nav rail that
     print as dead links across the top of every page. This rule only exists on
     this route's stylesheet, so no other module's print output is affected. */
  body > header, body > nav { display: none !important; }

  [data-lane="158"] * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* A collapsed <details> prints as nothing, which would silently drop every
     explanation from the PDF. Chromium hides the closed content with
     content-visibility (and, more recently, the ::details-content pseudo), so
     display alone does not reopen it — all three overrides are needed. */
  [data-lane="158"] details > summary { display: none !important; }
  [data-lane="158"] details > *:not(summary) {
    display: block !important;
    content-visibility: visible !important;
  }
  [data-lane="158"] details::details-content {
    content-visibility: visible !important;
    display: block !important;
    opacity: 1 !important;
    block-size: auto !important;
  }
  [data-lane="158"] details > p { border-left-width: 2px; }

  [data-lane="158"] [data-block] { break-inside: avoid; page-break-inside: avoid; }
  [data-lane="158"] figure { break-inside: avoid; page-break-inside: avoid; }
  [data-lane="158"] table { break-inside: auto; }
  [data-lane="158"] tr { break-inside: avoid; }
}
`;

/** A short "how to read this" line placed next to the thing it explains. */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex gap-2 text-[13px] leading-relaxed text-muted">
      <span aria-hidden className="select-none font-mono text-faint">
        ↳
      </span>
      <span>{children}</span>
    </p>
  );
}

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

/**
 * §05 — the stage rail. The single picture that answers "what is missing", read
 * left to right. Stage state is carried by a label and a fill, never by hue
 * alone.
 */
function StageRail({ stages }: { stages: Stage[] }) {
  const look: Record<Stage["state"], { chip: string; bar: string; num: string }> = {
    done: { chip: "text-success", bar: "bg-success", num: "border-success bg-success text-surface" },
    active: {
      chip: "text-warning",
      bar: "bg-warning",
      num: "border-warning bg-warning text-surface",
    },
    waiting: { chip: "text-faint", bar: "bg-border-strong", num: "border-border-strong text-faint" },
    separate: {
      chip: "text-faint",
      bar: "bg-border",
      num: "border-dashed border-border-strong text-faint",
    },
  };
  return (
    <ol className="grid gap-x-2 gap-y-4 sm:grid-cols-5">
      {stages.map((s) => {
        const l = look[s.state];
        return (
          <li key={s.n} className="flex flex-col gap-2">
            <span className={`h-1 w-full rounded-full ${l.bar}`} />
            <span className="flex items-center gap-2">
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] font-bold tabular-nums ${l.num}`}
              >
                {s.n}
              </span>
              <span className="text-[13px] font-semibold leading-tight">{s.label}</span>
            </span>
            <span className="flex flex-col gap-0.5 pl-7">
              <span className={`font-mono text-xs font-semibold tabular-nums ${l.chip}`}>
                {s.status}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                {s.owner}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * §05 — the paradox as one chart on one shared 0–1 axis, rather than two panels
 * the reader has to compare across. Two series, so: a legend, plus a direct
 * label on every bar (the tritan separation of the brand/info pair sits in the
 * 6–8 band, which is only legal with that secondary encoding).
 */
function ParadoxChart() {
  return (
    <figure className="rounded-lg border border-border bg-surface p-5">
      <figcaption className="space-y-1.5">
        <div className="text-sm font-semibold">{paradoxVerdict.title}</div>
        <p className="text-[13px] leading-relaxed text-muted">{paradoxVerdict.lede}</p>
      </figcaption>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[10px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-brand" /> approved rows only — what production
          counts
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-info" /> draft rows — same evaluator
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-px bg-foreground" /> required floor
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm opacity-60"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, var(--border-strong) 0 1px, transparent 1px 4px)",
            }}
          />{" "}
          not measured — not the same as zero
        </span>
      </div>

      <div className="mt-5 space-y-6">
        {paradoxVerdict.rows.map((r) => {
          const floorPct = r.floor * 100;
          const bars = [
            { v: r.approved, label: r.approvedLabel, fill: "bg-brand", name: "approved" },
            { v: r.draft, label: r.draftLabel, fill: "bg-info", name: "draft" },
          ];
          return (
            <div key={r.metric} className="grid grid-cols-[1fr_5.5rem] gap-x-3">
              <div className="col-span-2 mb-1 font-mono text-xs text-muted">{r.metric}</div>

              {/* plot column — the ONLY box the 0–1 scale is measured against, so
                  the floor rule and the bar fills share one coordinate space */}
              <div className="relative pt-4">
                <span
                  className="absolute top-2.5 bottom-0 z-10 w-px bg-foreground"
                  style={{ left: `${floorPct}%` }}
                  aria-hidden
                />
                <span
                  className="absolute top-0 z-10 -translate-x-full whitespace-nowrap pr-1.5 font-mono text-[10px] tabular-nums text-muted"
                  style={{ left: `${floorPct}%` }}
                >
                  floor {r.floor.toFixed(2)}
                </span>

                <div className="space-y-1">
                  {bars.map((b) => (
                    <div key={b.name} className="relative h-3.5 rounded-sm bg-surface-raised">
                      {b.v === null ? (
                        /* no data is not zero: a hatched track, never a filled length */
                        <span
                          className="absolute inset-0 rounded-sm opacity-60"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(135deg, var(--border-strong) 0 1px, transparent 1px 6px)",
                          }}
                        />
                      ) : b.v === 0 ? (
                        /* zero is a real measurement: an origin stub, so the row
                           reads as a bar at zero rather than a missing row */
                        <span
                          className={`absolute inset-y-0 left-0 w-0.5 rounded-sm ${b.fill}`}
                        />
                      ) : (
                        <span
                          className={`absolute inset-y-0 left-0 rounded-sm ${b.fill}`}
                          style={{ width: `${b.v * 100}%` }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* axis */}
                <div className="mt-1 flex justify-between border-t border-border pt-1 font-mono text-[10px] tabular-nums text-faint">
                  <span>0</span>
                  <span>1.0</span>
                </div>
              </div>

              {/* value column, outside the plot box */}
              <div className="flex flex-col gap-1 pt-4">
                {bars.map((b) => (
                  <span
                    key={b.name}
                    className={`flex h-3.5 items-center font-mono text-[11px] font-semibold tabular-nums ${
                      b.v === null ? "text-faint" : b.v < r.floor ? "text-danger" : "text-muted"
                    }`}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 border-t border-border pt-3 text-[13px] leading-relaxed text-muted">
        {paradoxVerdict.clean}
      </p>
    </figure>
  );
}

/* FloorBar was replaced by ParadoxChart, which puts both series on one axis. */

/* ------------------------------------------------------------------ */
/* the view                                                            */
/* ------------------------------------------------------------------ */

export default function View() {
  const caller = errorCodes.filter((e) => e.cls === "caller");
  const dependency = errorCodes.filter((e) => e.cls === "dependency");
  const shipped = recipeGates.filter((g) => g.state === "done");
  const remaining = recipeGates.filter((g) => g.state !== "done");

  return (
    <section data-lane="158" className="space-y-12">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      {/* Only appears in the PDF, where the site chrome does not travel with it. */}
      <div className="hidden print:mb-6 print:flex print:items-baseline print:justify-between print:gap-4 print:border-b print:border-border-strong print:pb-3">
        <span className="text-sm font-semibold">
          Lane #158 — Host adapter contract, server-derived authority
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Jinming Cao · Week 7 · 27–31 July 2026
        </span>
      </div>

      {/* ============ 0. what I did / what is stuck ============ */}
      <div data-block className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        {/* delivered */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2.5">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              What I built this week
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
              lane #158 · adapter
            </span>
          </div>
          <ol className="mt-3 space-y-3">
            {delivered.map((d, i) => (
              <li key={d.what} className="grid grid-cols-[auto_1fr] gap-x-3">
                <span className="mt-0.5 flex size-5 items-center justify-center rounded-full border border-brand/50 font-mono text-[10px] font-bold tabular-nums text-brand">
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-semibold leading-snug">{d.what}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-success/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-success">
                      {d.proof}
                    </span>
                    <span className="font-mono text-[10px] text-faint">{d.ref}</span>
                  </div>
                  <Why>{d.detail}</Why>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* asks */}
        <div className="rounded-lg border border-danger/40 bg-danger/5 p-5">
          <div className="flex items-baseline justify-between gap-3 border-b border-danger/25 pb-2.5">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-danger">
              What is stuck, and who can unstick it
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
              {asks.filter((a) => a.severity === "blocking").length} blocking
            </span>
          </div>
          <ul className="mt-3 space-y-3">
            {asks.map((a) => (
              <li key={a.what} className="grid grid-cols-[auto_1fr] gap-x-3">
                <span
                  className={`mt-1.5 size-2 shrink-0 rounded-full ${
                    a.severity === "blocking" ? "bg-danger" : "bg-warning"
                  }`}
                />
                <div>
                  <div className="text-sm font-semibold leading-snug">{a.what}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-faint">
                    needs: <span className="text-muted">{a.owner}</span>
                  </div>
                  <Why>{a.why}</Why>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-danger/25 pt-3 text-[13px] leading-relaxed text-muted">
            None of the four is waiting on code. Three need a decision from one person; the fourth
            needs an owner named.
          </p>
        </div>
      </div>

      {/* ============ 1. verdict board ============ */}
      <div data-block className="space-y-4">
        <Note>
          The evidence for all of the above, in three lanes. Each card carries the numbers that
          decide it; everything further down is the working.
        </Note>
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
      <div data-block className="space-y-3">
        <SectionTitle n="01">Server-derived authority · 8 operations × 4 roles</SectionTitle>
        <Note>
          Green is allowed and names the scope the server derives; red is a refusal. The caller
          never states its own role.
        </Note>
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
        <div className="rounded-lg border border-brand/40 bg-brand-tint/40 px-4 py-3">
          <div className="text-sm font-semibold">
            Supplying your own <code>reviewer_id</code>, <code>account_id</code> or{" "}
            <code>store_id</code> is refused on presence alone — even when the value is correct.
          </div>
          <Why>
            The check returns <code>403 authority_override_denied</code> before resource scope is
            evaluated, so an impersonation attempt is never masked behind a cross-store error.
          </Why>
        </div>
      </div>

      {/* ============ 3. state machine ============ */}
      <div data-block className="space-y-3">
        <SectionTitle n="02">Claim state machine</SectionTitle>
        <Note>
          Boxed states are terminal. <code>auto_approved</code> is struck through because the
          calibration gate holds it unreachable.
        </Note>
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
        <div className="rounded-lg border border-brand/40 bg-brand-tint/40 px-4 py-3">
          <div className="text-sm font-semibold">
            An evaluation that numerically qualifies for auto-approval still routes to{" "}
            <code>human_review</code>, every time. That is success, not an error.
          </div>
          <Why>
            <code>status</code> stays <code>ok</code>: in-flight state is a status value and never
            an error code, so a host polling for progress cannot mistake &quot;not done yet&quot;
            for a completed decision. Re-reviewing a terminal claim is{" "}
            <code>409 invalid_transition</code>.
          </Why>
        </div>
      </div>

      {/* ============ 4. the closed error set, drawn ============ */}
      <div data-block className="space-y-3">
        <SectionTitle n="03">Closed error set · 21 codes, two classes</SectionTitle>
        <Note>
          One chip per code, coloured by HTTP status. The two classes differ in one way that
          matters: only a dependency failure carries a <code>recovery_action</code>.
        </Note>

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
      <div data-block className="space-y-3">
        <SectionTitle n="04">Evidence · command → actual output</SectionTitle>
        <Note>
          A row may only cite what its commit actually contains — which is why the contract
          validator, real and passing but living in an unmerged PR, is amber rather than green.
        </Note>
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
      <div data-block className="space-y-3">
        <SectionTitle n="05">Recipe track #86–88 · the honest critical path</SectionTitle>

        {/* A. what the feature actually is */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
            What #86–88 is, before any status
          </div>
          <ol className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
            {recipeWhatItIs.map((s, i) => (
              <li key={s.step} className="flex flex-1 items-center gap-2">
                {i > 0 ? (
                  <span aria-hidden className="shrink-0 text-faint">
                    →
                  </span>
                ) : null}
                <span className="flex-1 rounded border border-border bg-surface-raised px-3 py-2">
                  <span className="block text-[13px] font-semibold leading-snug">{s.step}</span>
                  <span className="mt-0.5 block font-mono text-[10px] text-faint">{s.note}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            A separate feature from the claim path, built on the same frozen produce vocabulary.{" "}
            <strong>{recipeHeadline}</strong>
          </p>
          <Why>{recipeHeadlineWhy}</Why>
        </div>

        {/* B. one picture of where it stands */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
            Where it stands · five stages, in order
          </div>
          <div className="mt-4">
            <StageRail stages={recipeStages} />
          </div>
          <p className="mt-4 border-t border-border pt-3 text-[13px] leading-relaxed text-muted">
            Stage 1 is finished and proven. <strong>Stage 2 is ours and nobody is blocking it.</strong>{" "}
            Stage 3 is one person&apos;s signature and cannot be done by us. Stage 5 sits behind a
            separate gate entirely.
          </p>
        </div>

        {/* C. stage 2 in detail */}
        <CorpusMeter />

        {/* D. why the headline number looks alarming */}
        <ParadoxChart />

        {/* E. the four gates, separated from the three shipped issues */}
        <div className="grid gap-3 lg:grid-cols-[auto_1fr]">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-success">
              Shipped
            </div>
            <ul className="mt-2.5 space-y-1.5">
              {shipped.map((g) => (
                <li key={g.id} className="flex items-center gap-2 whitespace-nowrap">
                  <span aria-hidden className="font-mono text-xs text-success">
                    ✓
                  </span>
                  <span className="font-mono text-xs font-semibold text-muted">{g.id}</span>
                  <span className="text-[13px]">{g.title}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-warning">
              Between here and serving · four gates, in dependency order
            </div>
            <ol className="mt-2.5 space-y-2">
              {remaining.map((g) => {
                const tone = g.state === "blocked" ? "blocked" : "waiting";
                return (
                  <li key={g.id} className="grid grid-cols-[auto_1fr] gap-x-3">
                    <span className="mt-0.5 font-mono text-[11px] font-bold tabular-nums text-faint">
                      {g.id}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-[13px] font-semibold leading-snug">{g.title}</span>
                        <Stamp tone={tone}>{g.stamp}</Stamp>
                      </div>
                      {g.plain ? (
                        <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{g.plain}</p>
                      ) : null}
                      <div className="mt-1 font-mono text-[10px] text-faint">{g.owner}</div>
                      <Why>{g.detail}</Why>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

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
      <div data-block className="space-y-3">
        <SectionTitle n="06">Said out loud · the two limitations inside this lane</SectionTitle>
        <Note>
          Both are #158&apos;s own. Limitations belonging to other lanes are deliberately not
          listed here.
        </Note>
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
        Lane #158 · Jinming Cao · every figure re-run on <code>{candidate.commit}</code> before it
        was written down.
      </p>
    </section>
  );
}
