// The verdict board as a dot plot rather than six sentences with icons.
// Three columns, six rows, one dot each — the shape of the week is the pattern of the dots.

import { board, boardColumns, type Verdict } from "./data";

const column: Record<Verdict, string> = {
  works: "works",
  fails: "announced",
  mismatch: "announced",
  "by-design": "off",
};

const dot: Record<string, string> = {
  good: "bg-brand ring-brand-tint",
  bad: "bg-danger ring-danger/15",
  off: "bg-faint ring-border",
};

const head: Record<string, string> = {
  good: "text-brand-strong",
  bad: "text-danger",
  off: "text-faint",
};

export function Board() {
  const count = (key: string) => board.filter((b) => column[b.verdict] === key).length;

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <div className="min-w-140">
        {/* column headers */}
        <div className="grid grid-cols-[1fr_repeat(3,8rem)] items-end border-b border-border px-4 py-2.5">
          <span />
          {boardColumns.map((c) => (
            <span key={c.key} className="text-center">
              <span
                className={`block font-mono text-[10px] font-semibold uppercase tracking-widest ${
                  head[c.tone]
                }`}
              >
                {c.label}
              </span>
              <span className="mt-0.5 block font-mono text-xs tabular-nums text-faint">
                {count(c.key)}
              </span>
            </span>
          ))}
        </div>

        {board.map((b) => (
          <div
            key={b.item}
            className="grid grid-cols-[1fr_repeat(3,8rem)] items-center border-b border-border px-4 py-2.5 last:border-0"
          >
            <span className="pr-6">
              <span className="block text-sm leading-snug">{b.item}</span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wide text-faint">
                {b.label}
              </span>
            </span>
            {boardColumns.map((c) => {
              const on = column[b.verdict] === c.key;
              return (
                <span key={c.key} className="flex items-center justify-center">
                  {on ? (
                    <span className={`block h-3 w-3 rounded-full ring-4 ${dot[c.tone]}`} />
                  ) : (
                    <span className="block h-px w-3 bg-border" />
                  )}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
