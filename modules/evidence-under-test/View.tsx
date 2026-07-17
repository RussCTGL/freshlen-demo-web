import { suite, guards, verified, fakeTable } from "./data";

/** One bar per test group — the count is always printed beside the mark, so the
 *  reading never rides on color alone. */
function GuardChart() {
  const max = Math.max(...guards.map((g) => g.count), 1);
  return (
    <div>
      <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
        What each test guards
      </h3>
      <ul className="mt-3 space-y-2.5">
        {guards.map((g) => (
          <li key={g.label} className="text-sm">
            <div className="flex items-center gap-3">
              <span className="w-44 shrink-0 font-mono text-xs text-muted">{g.label}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                <span
                  className="block h-2 rounded-full bg-brand"
                  style={{ width: `${(g.count / max) * 100}%` }}
                />
              </span>
              <span className="w-8 shrink-0 text-right font-mono text-xs font-semibold tabular-nums">
                {g.count}
              </span>
            </div>
            <p className="ml-[11.75rem] mt-0.5 font-mono text-xs text-faint">{g.test}</p>
          </li>
        ))}
      </ul>
      <ul className="mt-3 space-y-1 border-t border-border pt-3">
        {verified.map((v) => (
          <li key={v.label} className="text-xs text-faint">
            <span className="font-mono text-muted">verified · {v.label}</span> — {v.note}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The honest boundary: fakes the pixel detector catches (and this suite regression-tests)
 *  vs. fakes that are the capture layer's job by design. */
function FakeBoundary() {
  return (
    <div>
      <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
        Fake type &rarr; caught by &rarr; in this test?
      </h3>
      <ul className="mt-3 space-y-1.5">
        {fakeTable.map((r) => (
          <li key={r.fake} className="flex items-center gap-3 text-sm">
            <span className="w-32 shrink-0 font-mono text-xs">{r.fake}</span>
            <span className="w-48 shrink-0 font-mono text-xs text-muted">
              {r.caughtBy === "image" ? "image detector" : "capture layer"}
              <span className="text-faint"> · {r.note}</span>
            </span>
            <span className="flex-1" />
            <span
              className={`shrink-0 font-mono text-xs font-semibold ${
                r.tested ? "text-brand" : "text-faint"
              }`}
            >
              {r.tested ? "✓ regression-tested" : "— capture layer"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function View() {
  return (
    <section className="space-y-6">
      <p className="text-sm text-muted">
        The evidence gate is only as trustworthy as its tests. This is the trust layer:{" "}
        <strong>{suite.offlineTests} offline test cases</strong> lock every branch of the gate —
        with no AI key and no network — plus a fraud regression net over the #85 gold set. It stays
        advisory throughout: the tests prove the code <em>routes</em> as designed; they never
        confirm a food-safety fact.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Offline test cases",
            value: suite.offlineTests,
            note: "12 core (#98) + 8 fraud net (#100)",
          },
          {
            label: "Fraud fixtures caught",
            value: `${suite.fraudFixtures.caught} / ${suite.fraudFixtures.total}`,
            note: "solid-color + blurry, from Mohan's #85 set",
          },
          {
            label: "Needs AI key or network",
            value: suite.needsKeyOrNetwork ? "yes" : "no",
            note: "conftest strips ES_API_* / ANTHROPIC_API_KEY",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">{s.label}</div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
            <p className="mt-1 text-xs text-faint">{s.note}</p>
          </div>
        ))}
      </div>

      <GuardChart />

      <p className="text-sm text-muted">
        Two of the gate promises — cap/duplicate <em>ordering</em> and the audit evidence block —
        were already proven by #78, so #79 <strong>verifies</strong> them rather than duplicating
        the tests. Writing a copy would just add noise to the suite.
      </p>

      <FakeBoundary />

      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          Finding · what makes this shippable
        </p>
        <p className="mt-2">
          Auto-approve is off — every claim still routes to a human. What makes the gate shippable
          isn&apos;t the score, it&apos;s that <strong>every path is tested</strong> and the fraud
          net is green ({suite.fraudFixtures.caught}/{suite.fraudFixtures.total}). And the fakes this
          suite doesn&apos;t test — screenshots, AI-made images — aren&apos;t a gap: they are the{" "}
          <strong>capture layer&apos;s</strong> job (in-app capture + metadata), not the pixel
          detector&apos;s, by design.
        </p>
      </div>
    </section>
  );
}
