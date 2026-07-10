export default function View() {
  const results = [
    ["Total fake rows", "20"],
    ["Auto-approve eligible", "0"],
    ["Below policy gate", "20"],
    ["Worst-case count", "0"],
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {results.map(([label, value]) => (
          <div key={label} className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Auto-approve eligible</p>
        <div className="mt-2 h-2 rounded-full bg-gray-200">
          <div className="h-2 w-0 rounded-full bg-gray-900" />
        </div>
        <p className="mt-2 text-sm">0 / 20</p>
      </div>

      <div className="rounded-lg border p-4">
        <p className="text-sm text-gray-500">Below policy gate</p>
        <div className="mt-2 h-2 rounded-full bg-gray-200">
          <div className="h-2 w-full rounded-full bg-gray-900" />
        </div>
        <p className="mt-2 text-sm">20 / 20</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Policy value</p>
          <p className="mt-2 text-2xl font-semibold">2.0</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Confidence range</p>
          <p className="mt-2 text-2xl font-semibold">0–1</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Gate status</p>
          <p className="mt-2 text-2xl font-semibold">Disabled</p>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <p className="font-semibold">
          0 of 20 fake samples enter the auto-approve band.
        </p>
        <p className="mt-1 text-sm text-gray-500">
          The value 2.0 is a disabled sentinel, not a model confidence score.
        </p>
      </div>
    </section>
  );
}
