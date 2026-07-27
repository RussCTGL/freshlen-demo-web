// Weekly Work-Sync Digest — 2026-W30 (RussCTGL).
// Data is a deterministic snapshot produced by es-intern-freshlens/scripts/work_sync.py
// (schema v1): git commit metadata + a sanitized activity export of public GitHub
// references. No PII, tokens, or private URLs. Missing sources are reported BLOCKED,
// never silently counted as zero work.

import { StatBars } from "@/components/StatBars";

type DigestEvent = {
  category: string;
  title: string;
  reference: string;
  date: string;
};

const SHIPPED: DigestEvent[] = [
  {
    category: "code",
    title: "[EVAL] Reproducible Week 6 UX/API completeness scorecard (#113) merged",
    reference: "https://github.com/LawrenceHua/es-intern-freshlens/pull/154",
    date: "2026-07-26",
  },
  {
    category: "code",
    title: "#121 work-sync MVP integrated into main via the #155 convergence baseline",
    reference: "https://github.com/LawrenceHua/es-intern-freshlens/pull/155",
    date: "2026-07-26",
  },
  {
    category: "docs",
    title:
      "monitor_event schema + contract-version pinning rules frozen into es_claim_host_v1 (PR #148)",
    reference: "https://github.com/LawrenceHua/es-intern-freshlens/pull/148",
    date: "2026-07-24",
  },
  {
    category: "device",
    title:
      "DEVICE-RESULT posted: background/resume scenario PASS on scan flow; claim-flow gap named",
    reference: "https://github.com/LawrenceHua/es-intern-freshlens/issues/119",
    date: "2026-07-24",
  },
  {
    category: "docs",
    title:
      "#129 owner artifact: contract-version compatibility rules + privacy-clean monitor_event schema",
    reference: "https://github.com/LawrenceHua/es-intern-freshlens/issues/129",
    date: "2026-07-22",
  },
  {
    category: "coordination",
    title: "#113 scorecard contract posted; all five sign-offs received and absorbed",
    reference: "https://github.com/LawrenceHua/es-intern-freshlens/issues/113",
    date: "2026-07-22",
  },
  {
    category: "coordination",
    title: "#121 Wednesday contract posted with working MVP (draft PR #133)",
    reference: "https://github.com/LawrenceHua/es-intern-freshlens/issues/121",
    date: "2026-07-21",
  },
];

const REVIEWS: DigestEvent[] = [
  {
    category: "review",
    title: "Reviewed PR #136 (claims report): 3 findings; row bound adopted upstream",
    reference: "https://github.com/LawrenceHua/es-intern-freshlens/pull/136",
    date: "2026-07-22",
  },
];

const ALL_EVENTS = [...SHIPPED, ...REVIEWS];

const BY_CATEGORY = ["code", "coordination", "docs", "device", "review"].map((name) => ({
  name,
  count: ALL_EVENTS.filter((e) => e.category === name).length,
}));

const BY_DAY = [
  ["Mon 07-20", "2026-07-20"],
  ["Tue 07-21", "2026-07-21"],
  ["Wed 07-22", "2026-07-22"],
  ["Thu 07-23", "2026-07-23"],
  ["Fri 07-24", "2026-07-24"],
  ["Sat 07-25", "2026-07-25"],
  ["Sun 07-26", "2026-07-26"],
].map(([name, date]) => ({
  name,
  count: ALL_EVENTS.filter((e) => e.date === date).length,
}));

const COVERAGE = [
  { source: "git_local", state: "OK", events: 1, reason: "commit metadata only" },
  { source: "meeting_notes", state: "OK", events: 7, reason: "sanitized export" },
  { source: "github", state: "BLOCKED", events: 0, reason: "not_configured — live adapter is roadmap M2" },
];

function EventList({ events }: { events: DigestEvent[] }) {
  return (
    <ul className="space-y-2">
      {events.map((event) => (
        <li key={event.reference + event.title} className="flex items-baseline gap-2 text-sm leading-6">
          <span className="shrink-0 rounded border border-border bg-surface px-1.5 font-mono text-xs text-muted">
            {event.category}
          </span>
          <span>
            {event.title}{" "}
            <a
              href={event.reference}
              className="underline decoration-dotted underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              {event.reference.split("/").slice(-2).join("/")}
            </a>{" "}
            <span className="font-mono text-xs text-faint">{event.date}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">
        The one-page weekly evidence digest, generated deterministically by{" "}
        <code>scripts/work_sync.py</code> (schema v1, two-run byte-identical) from git commit
        metadata plus a sanitized activity export of public GitHub references. Window:{" "}
        <strong>2026-07-20 → 2026-07-27</strong> (UTC−04:00).
      </p>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Events", value: ALL_EVENTS.length },
          { label: "Shipped", value: SHIPPED.length },
          { label: "Reviews given", value: REVIEWS.length },
          { label: "Sources OK", value: "2/3" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">{s.label}</div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <StatBars title="Focus by category" rows={BY_CATEGORY} />
        <StatBars title="Events by day" rows={BY_DAY} />
      </div>

      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Shipped (with evidence)
        </h3>
        <div className="mt-3">
          <EventList events={SHIPPED} />
        </div>
      </div>

      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Reviews given
        </h3>
        <div className="mt-3">
          <EventList events={REVIEWS} />
        </div>
      </div>

      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Source coverage
        </h3>
        <ul className="mt-3 space-y-2">
          {COVERAGE.map((row) => (
            <li key={row.source} className="flex items-center gap-3 text-sm">
              <span className="w-36 shrink-0 font-mono text-xs text-muted">{row.source}</span>
              <span
                className={`shrink-0 rounded px-1.5 font-mono text-xs font-semibold ${
                  row.state === "OK" ? "text-success" : "text-warning"
                }`}
              >
                {row.state}
              </span>
              <span className="w-8 shrink-0 text-right font-mono text-xs tabular-nums text-faint">
                {row.events}
              </span>
              <span className="text-xs text-muted">{row.reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          Honesty boundary
        </p>
        <p className="mt-2">
          The <code>github</code> source is BLOCKED (<code>not_configured</code>) — the live
          adapter is roadmap milestone M2, so GitHub-side work appears here only through the
          sanitized export, and missing sources are never counted as zero work. PR #173 (the
          Windows work-sync fix) and the #164 Windows triage landed minutes after this window
          closed — they belong to W31, not this page.
        </p>
      </div>
    </section>
  );
}
