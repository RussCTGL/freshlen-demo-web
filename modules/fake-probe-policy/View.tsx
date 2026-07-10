const results = [
  {
    label: "Total fake rows",
    value: "20",
    detail: "AI-generated rows evaluated",
  },
  {
    label: "Auto-approve eligible",
    value: "0",
    detail: "0 of 20",
  },
  {
    label: "Below policy gate",
    value: "20",
    detail: "20 of 20",
  },
  {
    label: "Worst-case count",
    value: "0",
    detail: "Matches shared policy",
  },
];

export default function View() {
  return (
    <section className="space-y-8">
      {/* Run summary */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Real probe run
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {results.map((result) => (
            <div key={result.label} className="rounded-xl border p-4">
              <p className="text-xs text-gray-500">{result.label}</p>
              <p className="mt-2 text-3xl font-semibold">{result.value}</p>
              <p className="mt-1 text-xs text-gray-500">{result.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Distribution */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Policy-band distribution
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Auto-approve eligible</span>
              <span className="font-mono">0 / 20</span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-0 rounded-full bg-gray-900" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span>Below policy gate</span>
              <span className="font-mono">20 / 20</span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-full rounded-full bg-gray-900" />
            </div>
          </div>
        </div>
      </div>

      {/* Policy status */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Shared policy status
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border p-4">
            <p className="text-xs text-gray-500">Configured gate</p>
            <p className="mt-2 text-2xl font-semibold">2.0</p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-xs text-gray-500">Normal confidence range</p>
            <p className="mt-2 text-2xl font-semibold">0–1</p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-xs text-gray-500">Gate state</p>
            <p className="mt-2 text-2xl font-semibold">Disabled</p>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          2.0 is a disabled sentinel outside the model’s 0–1 confidence range.
        </p>
      </div>

      {/* Verification table */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Verification
        </p>

        <div className="mt-4 overflow-hidden rounded-xl border">
          <div className="grid grid-cols-[1fr_auto] border-b p-4 text-sm">
            <span>Uses shared policy predicate</span>
            <span className="font-semibold">✓ Yes</span>
          </div>

          <div className="grid grid-cols-[1fr_auto] border-b p-4 text-sm">
            <span>Hardcoded 0.80 threshold removed</span>
            <span className="font-semibold">✓ Yes</span>
          </div>

          <div className="grid grid-cols-[1fr_auto] border-b p-4 text-sm">
            <span>Probe result matches policy</span>
            <span className="font-semibold">✓ Yes</span>
          </div>

          <div className="grid grid-cols-[1fr_auto] p-4 text-sm">
            <span>Fake samples auto-approved</span>
            <span className="font-semibold">0</span>
          </div>
        </div>
      </div>

      {/* Final result */}
      <div className="rounded-xl border p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Result
        </p>

        <p className="mt-3 text-lg font-semibold">
          0 of 20 fake samples enter the auto-approve band.
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Human review remains in the loop.
        </p>
      </div>
    </section>
  );
}
