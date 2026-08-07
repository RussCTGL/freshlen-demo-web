// Corrected picture. The receipt door is open and, since this week, keeps what you put through it.
// The scan door is switched off. The claim spine needs a scored item, and only the scanner makes one.

import { journey } from "./data";
import { IconCheck, IconOff, IconLock } from "./icons";

export function Journey() {
  return (
    <div className="space-y-4">
      {/* two doors */}
      <div className="grid gap-3 sm:grid-cols-2">
        {journey.doors.map((d) => (
          <div
            key={d.name}
            className={`rounded-lg border p-4 ${
              d.open ? "border-brand/50 bg-brand-tint" : "border-border bg-surface-raised"
            }`}
          >
            <div className="flex items-center gap-2">
              {d.open ? (
                <IconCheck className="text-brand-strong" />
              ) : (
                <IconOff className="text-faint" />
              )}
              <span className="text-sm font-semibold">{d.name}</span>
              <span
                className={`ml-auto font-mono text-xs ${
                  d.open ? "text-brand-strong" : "text-faint"
                }`}
              >
                {d.state}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">{d.note}</p>
          </div>
        ))}
      </div>

      {/* the gate between the doors and the spine */}
      <div className="flex items-stretch gap-3 rounded-lg border border-warning/40 bg-warning/5 p-4">
        <span className="mt-0.5">
          <IconLock className="text-warning" />
        </span>
        <div>
          <div className="text-sm font-semibold">{journey.gate.title}</div>
          <p className="mt-1 text-sm text-muted">{journey.gate.note}</p>
        </div>
      </div>

      {/* the spine, twice */}
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {journey.spine.map((s, i) => (
            <div key={s} className="flex min-w-0 flex-1 items-center">
              <div className="min-w-20 flex-1 rounded-md border border-border bg-surface-raised px-2 py-1.5 text-center text-xs leading-tight">
                {s}
              </div>
              {i < journey.spine.length - 1 && (
                <span className="px-0.5 text-faint" aria-hidden>
                  <svg viewBox="0 0 8 12" className="h-3 w-2" fill="none">
                    <path
                      d="m2 2 4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {journey.lanes.map((l) => (
            <div
              key={l.label}
              className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-md border px-3 py-2 ${
                l.ok ? "border-brand/40 bg-brand-tint" : "border-dashed border-border"
              }`}
            >
              <span className="text-sm">{l.label}</span>
              <span
                className={`font-mono text-xs ${l.ok ? "text-brand-strong" : "text-faint"}`}
              >
                {l.verdict}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
