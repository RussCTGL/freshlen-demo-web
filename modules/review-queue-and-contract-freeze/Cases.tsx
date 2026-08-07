// Most of a contract is what it refuses. The case split makes that visible.

import { cases } from "./data";

export function Cases() {
  const total = cases.valid + cases.invalid;
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-3xl font-semibold tabular-nums">{total}</div>
          <div className="mt-0.5 text-sm text-muted">frozen contract cases</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm text-brand-strong">{cases.valid} accepted</div>
          <div className="font-mono text-sm text-danger">{cases.invalid} refused</div>
        </div>
      </div>

      <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-border">
        <span
          className="block bg-brand"
          style={{ width: `${(cases.valid / total) * 100}%` }}
        />
        <span
          className="block bg-danger"
          style={{ width: `${(cases.invalid / total) * 100}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-muted">{cases.note}</p>
    </div>
  );
}
