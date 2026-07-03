// 🔒 SHARED primitive — any module may reuse this; only the shell owner edits it.
// A simple horizontal bar list for showing count distributions.

export type StatRow = { name: string; count: number };

export function StatBars({ title, rows }: { title: string; rows: StatRow[] }) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3 text-sm">
            <span className="w-36 shrink-0 text-gray-500">{r.name}</span>
            <span className="h-2 flex-1 rounded bg-black/5 dark:bg-white/10">
              <span
                className="block h-2 rounded bg-emerald-500/80"
                style={{ width: `${(r.count / max) * 100}%` }}
              />
            </span>
            <span className="w-8 shrink-0 text-right tabular-nums text-gray-400">{r.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
