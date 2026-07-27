// Weekly Work-Sync Digest — 2026-W30 (RussCTGL).
// Demos the substance of what shipped this week: the UX/API scorecard, the
// work-sync pipeline, the frozen host-contract sections, and the device study —
// with each artifact's own verified numbers and evidence links. All references
// are public GitHub URLs; no PII, tokens, or private URLs.

const LINKS = {
  pr154: "https://github.com/LawrenceHua/es-intern-freshlens/pull/154",
  pr155: "https://github.com/LawrenceHua/es-intern-freshlens/pull/155",
  pr148: "https://github.com/LawrenceHua/es-intern-freshlens/pull/148",
  pr136: "https://github.com/LawrenceHua/es-intern-freshlens/pull/136",
  issue119: "https://github.com/LawrenceHua/es-intern-freshlens/issues/119",
  issue129: "https://github.com/LawrenceHua/es-intern-freshlens/issues/129",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
      {children}
    </h3>
  );
}

function Evidence({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="underline decoration-dotted underline-offset-2"
      target="_blank"
      rel="noreferrer"
    >
      {label}
    </a>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="font-mono text-xs uppercase tracking-widest text-faint">{label}</div>
      <div className="mt-1.5 font-mono text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export default function View() {
  return (
    <section className="space-y-10">
      <p className="text-muted">
        What shipped in <strong>2026-W30</strong> — the artifact details, each with its own
        verified numbers and public evidence. Rolled up deterministically by{" "}
        <code>scripts/work_sync.py</code> (#121), which itself shipped this week.
      </p>

      {/* ---------------------------------------------------------------- #113 */}
      <div className="space-y-4">
        <SectionTitle>1 · UX/API completeness scorecard — merged to main</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-4">
          <Tile label="Checks green" value="56/56" />
          <Tile label="Check families" value="10" />
          <Tile label="Anti-false-green tests" value="28" />
          <Tile label="Two-run diff" value="empty" />
        </div>
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          <li>
            <code>scripts/ui_smoke.py</code>: offline, same-process TestClient harness grading
            every Week 6 surface — envelope shape, DOM landmarks, accessibility structure,
            advisory-copy rules, auth isolation, report columns, provenance honesty,
            policy guardrails, determinism, and the #140 <strong>role matrix</strong> (seeded
            shopper / two store reviewers / policy admin; shopper review→403, cross-store
            queue→empty, admin threshold-write→rejected naming the RE-SCOPE lock).
          </li>
          <li>
            <strong>Cannot false-green:</strong> every required family has a test that plants a
            failure and proves exit 1 — including probes contributed adversarially in review
            (Tony&apos;s header-only report, Jinming&apos;s form-vs-JSON wrong-reason pass), both
            pinned as permanent tests.
          </li>
          <li>
            <strong>Determinism is self-enforcing:</strong> the harness runs its whole suite twice
            per invocation and a mismatch is itself a required failure; output is sanitized
            (ids/timestamps/paths) and byte-identical across runs.
          </li>
          <li>
            <strong>#129 version pin:</strong> the report names its consumed host-contract version
            (<code>&quot;1.0&quot;</code>); an unknown or divergent version is a required failure —
            never coerced to latest.
          </li>
        </ul>
        <p className="text-sm text-faint">
          Evidence: <Evidence href={LINKS.pr154} label="PR #154 (merged, 2 approvals)" /> — five
          teammate sign-offs absorbed; review findings closed same-day.
        </p>
      </div>

      {/* ---------------------------------------------------------------- #121 */}
      <div className="space-y-4">
        <SectionTitle>2 · Work-sync pipeline — integrated via the convergence baseline</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-4">
          <Tile label="Event schema" value="v1" />
          <Tile label="Adapters" value="3" />
          <Tile label="Suite (Windows)" value="46 ✓" />
          <Tile label="Rerun output" value="byte-identical" />
        </div>
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          <li>
            Turns git metadata, GitHub items, and sanitized meeting/AI exports into one
            <code> work_event</code> stream: stable <code>event_key</code> dedup (exact +
            rebase-collapse), single-line redacted titles, provenance block on every event.
          </li>
          <li>
            <strong>Missing work is never counted as zero:</strong> a source that cannot be read
            reports <code>BLOCKED</code> with a reason on the page itself — this digest&apos;s own
            coverage table shows <code>github: BLOCKED (not_configured)</code> because the live
            adapter is roadmap M2.
          </li>
          <li>
            Deterministic by construction: fixed <code>--as-of</code>, key-sorted JSON, no
            timestamps or machine paths in output — two runs diff empty, same discipline the
            scorecard uses.
          </li>
        </ul>
        <p className="text-sm text-faint">
          Evidence: <Evidence href={LINKS.pr155} label="#155 convergence (integrates #133)" /> —
          this page is rendered from its real W30 output.
        </p>
      </div>

      {/* ---------------------------------------------------------------- #129 */}
      <div className="space-y-4">
        <SectionTitle>3 · Host-contract sections — frozen verbatim into es_claim_host_v1</SectionTitle>
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          <li>
            <strong>Contract-version compatibility rules:</strong> pinned-set validation
            (<code>SUPPORTED_CONTRACT_VERSIONS</code>); a version outside the set fails with
            <code> unsupported_contract_version</code> — never interpreted as the latest. Adopted
            into the frozen schema&apos;s <code>$defs/contract_version</code> and enforced by
            fixture <code>invalid_unknown_contract_version.json</code>.
          </li>
          <li>
            <strong>monitor_event schema:</strong> nine stable event names (funnel, latency,
            queue-age, duplicate, cap, denial, override, access-denied, model-disagreement) with a
            structural privacy guarantee — no free-text field exists; every string is a closed
            enum, opaque ref, or timestamp; confidence and scores travel as bands that cannot be
            re-inverted. Enforced by fixture <code>invalid_raw_observability_payload.json</code>.
          </li>
        </ul>
        <p className="text-sm text-faint">
          Evidence: <Evidence href={LINKS.issue129} label="#129 owner artifact" /> ·{" "}
          <Evidence href={LINKS.pr148} label="PR #148 (frozen schema + fixtures, merged)" />
        </p>
      </div>

      {/* ---------------------------------------------------------------- #119 */}
      <div className="space-y-4">
        <SectionTitle>4 · Device study — background/resumed-app scenario (assigned owner)</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {["Interruption point", "Variant", "Result"].map((h) => (
                  <th key={h} className="border border-border px-2 py-1 text-left font-mono text-xs uppercase tracking-wider text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Mid-capture (framing)", "short 10s / long minutes", "Camera resumes LIVE; framing discarded — no data loss (low)"],
                ["During analysis (spinner)", "short / long", "Analysis COMPLETED while backgrounded — no re-fire, no duplicate"],
                ["During analysis", "screen lock", "NOT INTERRUPTIBLE — result renders faster than the lock transition"],
                ["Result screen", "short / long", "Result STILL DISPLAYED — survives extended backgrounding"],
                ["Force-quit (labeled case)", "swipe-away + relaunch", "Fresh session — expected iOS behavior, boundary noted"],
              ].map((row) => (
                <tr key={row[0] + row[1]}>
                  {row.map((cell, i) => (
                    <td key={i} className="border border-border px-2 py-1">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          <strong>The gap that matters:</strong> the claim flow is <code>NOT_PRESENT</code> in
          build 3.4.5, so the financially risky case — backgrounding during claim submission —
          is untestable by construction and must re-run when that flow ships (ties to the #137
          create-retry idempotency gate). iPhone 17 Pro Max / iOS 26.3.1(a) / 3.4.5 (2026072201).
        </p>
        <p className="text-sm text-faint">
          Evidence: <Evidence href={LINKS.issue119} label="DEVICE-RESULT v1 on #119" />
        </p>
      </div>

      {/* ---------------------------------------------------------------- reviews */}
      <div className="space-y-4">
        <SectionTitle>5 · Review shipped upstream</SectionTitle>
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          <li>
            <Evidence href={LINKS.pr136} label="PR #136 (claims report)" /> — three findings, all
            verified empirically in a worktree; the missing row bound landed upstream as{" "}
            <code>MAX_CLAIM_REPORT_ROWS = 5000</code>, credited to the review.
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          Honesty boundary
        </p>
        <p className="mt-2">
          Window: 2026-07-20 → 2026-07-27 (UTC−04:00). PR #173 (the Windows work-sync fix) and
          the #164 Windows baseline triage landed minutes after this window closed — they belong
          to W31. Scorecard evidence is source-structure proof, not rendered-browser or
          physical-device proof; the device rows above are the physical-device evidence.
        </p>
      </div>
    </section>
  );
}
