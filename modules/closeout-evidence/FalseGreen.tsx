// What was true, next to what the check said. Three times.

import { falseGreens } from "./data";

export function FalseGreen() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="grid grid-cols-[1fr_auto_5.5rem] items-center gap-x-3 border-b border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-faint">
        <span>What was actually true</span>
        <span />
        <span className="text-right">It reported</span>
      </div>
      {falseGreens.map((f) => (
        <div
          key={f.reality}
          className="grid grid-cols-[1fr_auto_5.5rem] items-center gap-x-3 border-b border-border px-4 py-2.5 text-sm last:border-0"
        >
          <span className="text-muted">{f.reality}</span>
          <span className="text-faint" aria-hidden>
            <svg viewBox="0 0 20 8" className="h-2 w-5" fill="none">
              <path
                d="M0 4h17m0 0-3-3m3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="flex items-center justify-end gap-1.5 font-mono text-xs text-brand-strong">
            <span className="block h-2 w-2 rounded-full bg-brand ring-4 ring-brand-tint" />
            {f.reading}
          </span>
        </div>
      ))}
    </div>
  );
}
