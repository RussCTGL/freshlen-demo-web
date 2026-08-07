// The roadmap, drawn as three lanes top-down: shipped → in review → handed off.
// Built from the site's border/surface tokens (like the Journey/BPMN modules)
// but as reflowing HTML rather than a fixed-viewBox SVG, because the node count
// is high and every node must stay readable on a phone. Each node is a title
// plus one line; the detail lives in the prose sections below the visual.
// Meaning never rides on color alone — every lane carries its label in text.

import { lanes, type RoadmapLane, type RoadmapTone } from "./data";

const TONE_STYLES: Record<
  RoadmapTone,
  { lane: string; label: string; node: string; tag: string }
> = {
  shipped: {
    lane: "border-brand/40 bg-brand-tint",
    label: "text-brand-strong",
    node: "border-brand/30 bg-surface",
    tag: "text-brand-strong",
  },
  review: {
    lane: "border-warning/40 bg-warning/5",
    label: "text-warning",
    node: "border-warning/30 bg-surface",
    tag: "text-warning",
  },
  handoff: {
    lane: "border-border bg-surface-raised/50",
    label: "text-muted",
    node: "border-border bg-surface",
    tag: "text-faint",
  },
};

function Lane({ lane }: { lane: RoadmapLane }) {
  const tone = TONE_STYLES[lane.tone];
  return (
    <div className={`rounded-lg border p-4 ${tone.lane}`}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h4
          className={`font-mono text-xs font-semibold uppercase tracking-widest ${tone.label}`}
        >
          {lane.label}
        </h4>
        <span className="text-xs text-faint">{lane.sub}</span>
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {lane.nodes.map((n) => (
          <li
            key={n.title}
            className={`rounded border px-3 py-2 ${tone.node}`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-foreground">
                {n.title}
              </span>
              {n.tag ? (
                <span
                  className={`shrink-0 font-mono text-[10px] tracking-wide ${tone.tag}`}
                >
                  {n.tag}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-muted">
              {n.line}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Connector({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-3 py-1 pl-4"
      role="presentation"
      aria-hidden="true"
    >
      <span className="h-6 w-px bg-border-strong" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
        {label} ↓
      </span>
    </div>
  );
}

export function Roadmap() {
  return (
    <div>
      <Lane lane={lanes[0]} />
      <Connector label="freeze · Aug 7" />
      <Lane lane={lanes[1]} />
      <Connector label="handoff · owners named" />
      <Lane lane={lanes[2]} />
    </div>
  );
}
