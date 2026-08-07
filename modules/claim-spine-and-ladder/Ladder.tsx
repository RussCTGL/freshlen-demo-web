// First match wins, top to bottom. Band 2 always fires, so band 3 is unreachable by arithmetic.

import { ladder } from "./data";
import { IconOff, IconCheck } from "./icons";

export function Ladder() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <ol className="space-y-1.5">
        {ladder.map((b) => (
          <li
            key={b.band}
            className={`flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border px-3 py-2 ${
              b.state === "fires"
                ? "border-brand bg-brand-tint"
                : b.state === "dead"
                  ? "border-dashed border-border bg-transparent opacity-55"
                  : "border-border bg-surface-raised"
            }`}
          >
            <span className="font-mono text-[10px] text-faint">{b.band}</span>
            <span
              className={`text-sm ${b.state === "fires" ? "font-semibold" : ""} ${
                b.state === "dead" ? "line-through decoration-faint" : ""
              }`}
            >
              {b.condition}
            </span>
            <span className="ml-auto flex items-center gap-1.5 font-mono text-xs">
              {b.state === "fires" && (
                <>
                  <IconCheck className="text-brand-strong" />
                  <span className="text-brand-strong">{b.outcome}</span>
                </>
              )}
              {b.state === "dead" && (
                <>
                  <IconOff className="text-faint" />
                  <span className="text-faint">{b.outcome}</span>
                </>
              )}
              {b.state === "plain" && <span className="text-muted">{b.outcome}</span>}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 border-t border-border pt-3 text-sm text-muted">
        Band 2 fires on every claim, so band 3 is dead code. The threshold that would enable it
        ships at <span className="font-mono text-foreground">2.0</span> on a scale that stops at{" "}
        <span className="font-mono text-foreground">1.0</span>. Not a flag someone can flip.
      </p>
    </div>
  );
}
