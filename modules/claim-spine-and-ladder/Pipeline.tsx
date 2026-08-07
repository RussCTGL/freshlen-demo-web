// Order of operations. Everything cheap and deterministic decides before the expensive call.

import { pipeline } from "./data";

export function Pipeline() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
        {pipeline.map((p, i) => (
          <div key={p.name} className="flex min-w-0 flex-1 items-stretch">
            <div
              className={`min-w-24 flex-1 rounded-md border px-2.5 py-2 ${
                p.model
                  ? "border-brand bg-brand-tint"
                  : "border-border bg-surface-raised"
              }`}
            >
              <div className="font-mono text-[10px] text-faint">{i + 1}</div>
              <div
                className={`mt-0.5 text-xs leading-tight ${
                  p.model ? "font-semibold text-brand-strong" : "text-foreground"
                }`}
              >
                {p.name}
              </div>
            </div>
            {i < pipeline.length - 1 && (
              <span className="flex items-center px-0.5 text-faint" aria-hidden>
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
      <p className="mt-3 border-t border-border pt-3 text-sm text-muted">
        Four cheap, deterministic checks reject what they can before the model is ever called. An
        outage of the model therefore cannot open the gate, because the gate was never the model.
      </p>
    </div>
  );
}
