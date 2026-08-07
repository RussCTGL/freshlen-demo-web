// What shipped, and what was handed to someone else. The completeness half of the card,
// held to the same row grammar as the verdict board so it reads at the same speed.

import { shipped, filed, discipline } from "./data";
import { IconCheck, IconWarn, IconOff } from "./icons";
import { Rows, Row } from "./ui";

export function Shipped() {
  return (
    <Rows>
      {shipped.map((s) => (
        <Row key={s.what} tone="good" icon={<IconCheck />} chip={s.tag}>
          {s.what}
        </Row>
      ))}
    </Rows>
  );
}

export function Filed() {
  return (
    <Rows>
      {filed.map((f) => {
        const closed = f.state === "closed";
        return (
          <Row
            key={f.what}
            edge
            tone={closed ? "good" : "warn"}
            icon={closed ? <IconCheck /> : <IconWarn />}
            chip={f.landed}
          >
            {f.what}
          </Row>
        );
      })}
    </Rows>
  );
}

export function Discipline() {
  return (
    <div className="rounded-lg border border-border bg-surface-raised p-4">
      <div className="flex items-center gap-2.5">
        <IconOff className="text-faint" />
        <span className="text-sm font-semibold">{discipline.title}</span>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-stretch">
        {/* three steps, drawn left to right */}
        <div className="flex min-w-0 items-stretch gap-1.5 overflow-x-auto">
          {discipline.steps.map((s, i) => (
            <div key={s.k} className="flex min-w-0 flex-1 items-center gap-1.5">
              <div className="min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2.5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
                  {s.k}
                </div>
                <div className="mt-1 text-sm leading-snug">{s.v}</div>
              </div>
              {i < discipline.steps.length - 1 && (
                <span className="shrink-0 text-faint" aria-hidden>
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

        <div className="flex flex-col justify-center rounded-lg border border-border bg-surface px-4 py-3 text-center">
          <div className="font-mono text-2xl font-semibold tabular-nums">
            {discipline.stat.value}
          </div>
          <div className="mt-0.5 max-w-36 text-xs leading-snug text-muted">
            {discipline.stat.label}
          </div>
        </div>
      </div>
    </div>
  );
}
