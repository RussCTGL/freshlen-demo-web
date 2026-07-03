// 🔒 SHARED primitive — any module may reuse this; only the shell owner edits it.
// A simple horizontal bar list for showing count distributions.

export type StatRow = { name: string; count: number };

export function StatBars({ title, rows }: { title: string; rows: StatRow[] }) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <div>
      <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3 text-sm">
            <span className="w-36 shrink-0 text-muted">{r.name}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
              <span
                className="block h-2 rounded-full bg-brand"
                style={{ width: `${(r.count / max) * 100}%` }}
              />
            </span>
            <span className="w-8 shrink-0 text-right font-mono text-xs tabular-nums text-faint">
              {r.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
