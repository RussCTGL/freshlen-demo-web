// What shipped, and what was handed to someone else. The completeness half of the card,
// held to the same row grammar as the verdict board so it reads at the same speed.

import { shipped, filed, discipline } from "./data";
import { IconCheck, IconWarn, IconOff } from "./icons";
import { Rows, Row, RailDown } from "./ui";

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

      <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <RailDown
          items={discipline.steps.map((s) => ({
            key: s.k,
            tone: "off" as const,
            head: (
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                  {s.k}
                </span>
                <span className="text-sm">{s.v}</span>
              </div>
            ),
          }))}
        />

        <div className="rounded-lg border border-border bg-surface px-4 py-3 text-center">
          <div className="font-mono text-2xl font-semibold tabular-nums">
            {discipline.stat.value}
          </div>
          <div className="mt-0.5 max-w-40 text-xs leading-snug text-muted">
            {discipline.stat.label}
          </div>
        </div>
      </div>
    </div>
  );
}
