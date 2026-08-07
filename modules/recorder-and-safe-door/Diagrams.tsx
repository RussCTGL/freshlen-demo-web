// Compact, low-text SVG diagrams for the observability module. Inline SVG,
// theme-aware via CSS variables — same convention as
// modules/closeout-gate-evidence/Bpmn.tsx.

import type { FlowStep } from "./data";

const INK = "var(--foreground)";
const FAINT = "var(--faint)";
const SURFACE = "var(--surface)";
const BRAND = "var(--brand)";
const OK = "var(--success)";
const WARN = "var(--warning)";

function Node({
  cx,
  cy,
  w = 128,
  h = 46,
  label,
  sub,
  color = "var(--border-strong)",
}: {
  cx: number;
  cy: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  color?: string;
}) {
  const lines = label.split("\n");
  const labelTop = cy - ((lines.length - 1) * 12) / 2 - (sub ? 6 : 0);
  return (
    <g>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={8}
        fill={SURFACE}
        stroke={color}
        strokeWidth={1.75}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={cx}
          y={labelTop + i * 12 + 4}
          textAnchor="middle"
          fontSize={10.5}
          fontWeight={600}
          fill={INK}
        >
          {line}
        </text>
      ))}
      {sub ? (
        <text x={cx} y={cy + h / 2 - 8} textAnchor="middle" fontSize={9} fill={FAINT}>
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function ArrowRight({
  x1,
  x2,
  y,
  label,
  color = FAINT,
}: {
  x1: number;
  x2: number;
  y: number;
  label?: string;
  color?: string;
}) {
  return (
    <g>
      <path
        d={`M ${x1} ${y} H ${x2}`}
        stroke={color}
        strokeWidth={1.5}
        markerEnd="url(#arrowhead)"
        fill="none"
      />
      {label ? (
        <text x={(x1 + x2) / 2} y={y - 7} textAnchor="middle" fontSize={9} fill={color}>
          {label}
        </text>
      ) : null}
    </g>
  );
}

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="arrowhead"
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="6.5"
        markerHeight="6.5"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill={FAINT} />
      </marker>
    </defs>
  );
}

/** One ID, four stops — the whole "why one ID matters" idea as a picture, not a paragraph. */
export function TraceDiagram() {
  const y = 74;
  const xs = [88, 258, 428, 598];
  const labels = ["Submitted", "Scored", "Decided", "Reported"];
  return (
    <svg
      viewBox="0 0 660 150"
      role="img"
      aria-label="One claim ID moves through four stops — submitted, scored, decided, reported — every stop tagged with the same ID."
      className="w-full"
    >
      <ArrowDefs />
      <text x={330} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={BRAND}>
        one ID · every stop
      </text>
      {xs.slice(0, -1).map((x, i) => (
        <ArrowRight key={i} x1={x + 64} x2={xs[i + 1] - 64} y={y} />
      ))}
      {xs.map((x, i) => (
        <Node key={i} cx={x} cy={y} label={labels[i]} color={BRAND} />
      ))}
      <text x={330} y={128} textAnchor="middle" fontSize={9} fill={FAINT}>
        other claims log at the same moment, each under its own ID — never mixed up
      </text>
    </svg>
  );
}

const flowTagColor: Record<FlowStep["tag"], string> = {
  normal: "var(--border-strong)",
  problem: WARN,
  recovered: OK,
};

/** Renders confirmedFlow / missingConfirmationFlow as a left-to-right picture instead of a chat log. */
export function FlowDiagram({ steps }: { steps: FlowStep[] }) {
  const y = 60;
  const w = 660;
  const n = steps.length;
  const margin = 90;
  const gap = n > 1 ? (w - margin * 2) / (n - 1) : 0;
  const xs = steps.map((_, i) => margin + gap * i);

  return (
    <svg
      viewBox={`0 0 ${w} 110`}
      role="img"
      aria-label={steps.map((s) => s.label).join(" then ")}
      className="w-full"
    >
      <ArrowDefs />
      {xs.slice(0, -1).map((x, i) => (
        <ArrowRight key={i} x1={x + 66} x2={xs[i + 1] - 66} y={y} color={flowTagColor[steps[i + 1].tag]} />
      ))}
      {steps.map((s, i) => (
        <g key={i}>
          <text x={xs[i]} y={y - 34} textAnchor="middle" fontSize={9} fontWeight={600} fill={FAINT}>
            {s.actor === "system" ? "SYSTEM" : "ANCHOR SERVICE"}
          </text>
          <Node cx={xs[i]} cy={y} w={132} h={50} label={s.label} color={flowTagColor[s.tag]} />
        </g>
      ))}
    </svg>
  );
}
