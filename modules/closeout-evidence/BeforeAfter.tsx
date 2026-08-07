// The one thing that measurably improved for a shopper this week, and the one that did not.

import { beforeAfter } from "./data";
import { IconCheck, IconCross } from "./icons";

export function BeforeAfter() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {beforeAfter.map((c) => (
        <div
          key={c.when}
          className={`rounded-lg border p-4 ${
            c.good ? "border-brand/50 bg-brand-tint" : "border-border bg-surface-raised"
          }`}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
            {c.when}
          </div>
          <ul className="mt-3 space-y-2">
            {c.rows.map((r) => (
              <li key={r.text} className="flex items-start gap-2 text-sm">
                {r.ok ? (
                  <IconCheck className="mt-0.5 text-brand-strong" />
                ) : (
                  <IconCross className="mt-0.5 text-danger" />
                )}
                <span className={r.ok ? "" : "text-muted"}>{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
