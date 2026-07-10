import {
  bugsFixed,
  testsPassing,
  fullSuite,
  bugs,
  sharedHelper,
  beforeAfter,
  notDone,
} from "./data";

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">
        Code review found three real bugs in <code>src/policy.py</code>&apos;s auto-approve
        band. The gate is off today (<code>min_confidence_for_auto</code> is an unreachable
        sentinel), but it&apos;s designed to flip on with a config change alone - no code review -
        so these had to be fixed before that flip becomes possible.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Bugs fixed", value: bugsFixed },
          { label: "test_policy.py", value: testsPassing },
          {
            label: "Full suite after merge",
            value: `${fullSuite.passed} passed, ${fullSuite.skipped} skipped`,
          },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">
              {s.label}
            </div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* The bugs */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          The bugs
        </h3>
        <ul className="mt-3 space-y-2">
          {bugs.map((b, i) => (
            <li
              key={i}
              className="rounded-lg border border-border border-l-4 border-l-danger bg-surface p-3 text-sm"
            >
              <div className="font-semibold">{b.title}</div>
              <div className="mt-1 text-muted">{b.detail}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* The fix */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          The fix - one shared eligibility check
        </h3>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-surface p-4 text-xs">
          <code>{sharedHelper}</code>
        </pre>
        <p className="mt-2 text-sm text-faint">
          All four conditions must hold: waste category, confidence at or above the calibrated
          floor, claim under the $5 cost-of-denial ceiling, account under its monthly cap.{" "}
          <code>adjudicate()</code>&apos;s Band 3 now calls this instead of repeating the logic.
          Band 2&apos;s comparison changed from <code>&gt;</code> to <code>&gt;=</code>.
        </p>
      </div>

      {/* Before / after */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Before / after
        </h3>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-faint">
              <th className="py-1.5 pr-4 font-medium">case</th>
              <th className="py-1.5 pr-4 font-medium">before</th>
              <th className="py-1.5 font-medium">after</th>
            </tr>
          </thead>
          <tbody>
            {beforeAfter.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-1.5 pr-4 text-muted">{r.case}</td>
                <td className={`py-1.5 pr-4 font-mono ${r.changed ? "text-danger" : "text-faint"}`}>
                  {r.before}
                </td>
                <td className={`py-1.5 font-mono ${r.changed ? "text-success" : "text-faint"}`}>
                  {r.after}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Why these calls */}
      <div className="rounded border border-border px-4 py-3 text-sm">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Why 71, not 70 - and &gt;=1.0, not &gt;1.0
        </h3>
        <p className="mt-2 text-muted">
          Not an arbitrary pick - <code>freshness.quality_for()</code> already draws the waste
          line at 71. The actual bug was <code>PROJECT_CONTEXT.md</code>&apos;s color table, which
          said &quot;70-100 Urgent&quot;. Fixed the doc to match the code&apos;s existing
          authority, not the reverse - logged in <code>TEAM.md</code>&apos;s Decisions Log, with a
          note for #53 to key UI colors off <code>quality_category</code> instead of re-hardcoding
          the split. Separately, the model legitimately returns <code>confidence == 1.0</code>;
          keeping <code>&gt;</code> would leave a hole where a perfect-confidence read slips
          through the &quot;disabled&quot; gate.
        </p>
      </div>

      {/* What's not done */}
      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          What&apos;s not done - handoff for #56
        </p>
        <p className="mt-2 text-muted">{notDone.criterion}</p>
        <p className="mt-2 text-muted">{notDone.status}</p>
        <p className="mt-2 text-muted">{notDone.reasoning}</p>
      </div>

      <p className="text-sm font-semibold">PR #65 - merged to main.</p>
    </section>
  );
}
