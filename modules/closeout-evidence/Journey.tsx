// The one picture worth having: the same six-step shopper journey, on two surfaces.
// Proven end to end in the offline harness; unreachable from step one on a real phone.

import { journey } from "./data";

function Dot({ state }: { state: "ok" | "stop" | "unreached" }) {
  if (state === "ok") {
    return <span className="block h-3 w-3 rounded-full bg-brand ring-4 ring-brand-tint" />;
  }
  if (state === "stop") {
    return (
      <span className="flex h-3 w-3 items-center justify-center rounded-full bg-danger ring-4 ring-danger/15">
        <span className="block h-1 w-1.5 rounded-[1px] bg-background" />
      </span>
    );
  }
  return <span className="block h-3 w-3 rounded-full border border-dashed border-faint" />;
}

function Lane({
  label,
  verdict,
  states,
  tone,
}: {
  label: string;
  verdict: string;
  states: ("ok" | "stop" | "unreached")[];
  tone: "brand" | "danger";
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-sm font-medium">{label}</span>
        <span
          className={`font-mono text-xs ${tone === "brand" ? "text-brand-strong" : "text-danger"}`}
        >
          {verdict}
        </span>
      </div>
      <div className="mt-2 flex items-center">
        {states.map((s, i) => (
          <div key={i} className="flex flex-1 items-center last:flex-none">
            <Dot state={s} />
            {i < states.length - 1 && (
              <span
                className={`h-px flex-1 ${
                  s === "ok" && states[i + 1] === "ok"
                    ? "bg-brand/50"
                    : "border-t border-dashed border-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Journey() {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      {/* step names */}
      <div className="flex gap-1">
        {journey.steps.map((s, i) => (
          <span
            key={s}
            className={`flex-1 font-mono text-[10px] uppercase leading-tight tracking-wide text-faint ${
              i === journey.steps.length - 1 ? "text-right" : ""
            }`}
          >
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-5">
        {journey.lanes.map((l) => (
          <Lane
            key={l.label}
            label={l.label}
            verdict={l.verdict}
            states={l.states}
            tone={l.tone}
          />
        ))}
      </div>

      <p className="mt-5 border-t border-border pt-3 text-sm text-muted">{journey.note}</p>
    </div>
  );
}
