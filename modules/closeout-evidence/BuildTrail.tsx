// Three artifacts on one day. Only one of them has a published origin.

import { buildTrail } from "./data";

export function BuildTrail() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <ol className="space-y-0">
        {buildTrail.map((b, i) => (
          <li key={b.role} className="flex gap-3">
            {/* rail */}
            <div className="flex flex-col items-center">
              <span
                className={`mt-1.5 block h-2.5 w-2.5 shrink-0 rounded-full ${
                  b.linked ? "bg-brand" : "bg-warning"
                }`}
              />
              {i < buildTrail.length - 1 && (
                <span className="w-px flex-1 border-l border-dashed border-border" />
              )}
            </div>

            <div className={i < buildTrail.length - 1 ? "pb-4" : ""}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-sm font-semibold">{b.build}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                  {b.time}
                </span>
              </div>
              <div className="mt-0.5 text-sm">{b.role}</div>
              <div
                className={`mt-1 font-mono text-xs ${
                  b.linked ? "text-brand-strong" : "text-warning"
                }`}
              >
                {b.origin}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
