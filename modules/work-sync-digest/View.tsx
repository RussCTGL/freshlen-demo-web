// Weekly Work-Sync Digest — 2026-W30 (RussCTGL).
// Data is a deterministic snapshot produced by es-intern-freshlens/scripts/work_sync.py
// (schema v1): git commit metadata + a sanitized activity export of public GitHub
// references. No PII, tokens, or private URLs. Missing sources are reported BLOCKED,
// never silently counted as zero work.

type DigestEvent = {
  category: string;
  title: string;
  reference: string;
  date: string;
};

type SourceRow = {
  source: string;
  state: "OK" | "BLOCKED";
  events: number;
  reason: string;
};

const WEEK = "2026-W30";
const WINDOW = "2026-07-20 → 2026-07-27 (UTC−04:00)";
const GENERATED_AS_OF = "2026-07-27T04:00:00Z";

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

const COVERAGE: SourceRow[] = [
  { source: "git_local", state: "OK", events: 1, reason: "" },
  { source: "github", state: "BLOCKED", events: 0, reason: "not_configured (live adapter is roadmap M2)" },
  { source: "meeting_notes", state: "OK", events: 7, reason: "sanitized export" },
];

function EventList({ events }: { events: DigestEvent[] }) {
  return (
    <ul className="space-y-2">
      {events.map((event) => (
        <li key={event.reference + event.title} className="text-sm leading-6">
          <span className="mr-2 rounded bg-gray-200 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-700">
            {event.category}
          </span>
          {event.title}{" "}
          <a
            href={event.reference}
            className="underline decoration-dotted underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            {event.reference.split("/").slice(-2).join("/")}
          </a>{" "}
          <span className="text-xs text-gray-500">{event.date}</span>
        </li>
      ))}
    </ul>
  );
}

export default function View() {
  return (
    <section className="space-y-6">
      <div className="rounded border-l-4 border-gray-400 bg-gray-50 p-3 text-sm dark:bg-gray-800">
        <strong>Provenance:</strong> generated deterministically by{" "}
        <code>scripts/work_sync.py</code> (schema v1, two-run byte-identical) from git commit
        metadata plus a sanitized activity export of public GitHub references. Window: {WINDOW};
        generated as of {GENERATED_AS_OF}. Missing sources are reported BLOCKED below — never
        counted as zero work.
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold">Shipped (with evidence) — {WEEK}</h3>
        <EventList events={SHIPPED} />
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold">Reviews given</h3>
        <EventList events={REVIEWS} />
      </div>

      <div>
        <h3 className="mb-2 text-base font-semibold">Source coverage</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {["source", "state", "events", "reason"].map((header) => (
                <th key={header} className="border border-gray-300 px-2 py-1 text-left dark:border-gray-600">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COVERAGE.map((row) => (
              <tr key={row.source}>
                <td className="border border-gray-300 px-2 py-1 font-mono text-xs dark:border-gray-600">
                  {row.source}
                </td>
                <td
                  className={`border border-gray-300 px-2 py-1 font-semibold dark:border-gray-600 ${
                    row.state === "OK" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {row.state}
                </td>
                <td className="border border-gray-300 px-2 py-1 dark:border-gray-600">{row.events}</td>
                <td className="border border-gray-300 px-2 py-1 text-gray-500 dark:border-gray-600">
                  {row.reason}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500">
        Excluded honestly: PR #173 (Windows work-sync fix) and the #164 Windows triage landed
        minutes after the window closed — they belong to W31.
      </p>
    </section>
  );
}
