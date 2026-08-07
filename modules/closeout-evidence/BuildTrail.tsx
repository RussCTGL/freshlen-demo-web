// Three artifacts on one day. Only one of them has a published origin.

import { buildTrail } from "./data";
import { RailDown } from "./ui";

export function BuildTrail() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <RailDown
        items={buildTrail.map((b) => ({
          key: b.role,
          tone: b.linked ? ("good" as const) : ("warn" as const),
          head: (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-sm font-semibold">{b.build}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                {b.time}
              </span>
            </div>
          ),
          body: (
            <>
              <div className="mt-0.5 text-sm">{b.role}</div>
              <div
                className={`mt-1 font-mono text-xs ${
                  b.linked ? "text-brand-strong" : "text-warning"
                }`}
              >
                {b.origin}
              </div>
            </>
          ),
        }))}
      />
    </div>
  );
}
