// What shipped, and what was handed to someone else. The completeness half of the card.

import { shipped, filed, discipline } from "./data";
import { IconCheck, IconWarn, IconOff } from "./icons";

export function Shipped() {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
      {shipped.map((s) => (
        <li key={s.what} className="flex gap-3 px-4 py-3">
          <IconCheck className="mt-0.5 text-brand-strong" />
          <div>
            <div className="text-sm font-medium">{s.what}</div>
            <div className="mt-0.5 text-sm text-muted">{s.why}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function Filed() {
  return (
    <ul className="space-y-2">
      {filed.map((f) => (
        <li
          key={f.what}
          className={`flex flex-wrap items-start gap-x-3 gap-y-1.5 rounded-lg border border-l-4 p-3 ${
            f.state === "closed"
              ? "border-border border-l-brand bg-surface"
              : "border-warning/40 border-l-warning bg-warning/5"
          }`}
        >
          <span className="mt-0.5">
            {f.state === "closed" ? (
              <IconCheck className="text-brand-strong" />
            ) : (
              <IconWarn className="text-warning" />
            )}
          </span>
          <span className="min-w-52 flex-1 text-sm font-medium">{f.what}</span>
          <span
            className={`font-mono text-xs ${
              f.state === "closed" ? "text-muted" : "text-warning"
            }`}
          >
            {f.landed}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Discipline() {
  return (
    <div className="flex gap-3 rounded-lg border border-border bg-surface-raised p-4">
      <span className="mt-0.5">
        <IconOff className="text-faint" />
      </span>
      <div>
        <div className="text-sm font-semibold">{discipline.title}</div>
        <p className="mt-1 text-sm text-muted">{discipline.body}</p>
      </div>
    </div>
  );
}
