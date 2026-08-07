// Compact, low-text SVG diagram for the #196 section of this module (which door the
// system connects through by default). Inline SVG, theme-aware via CSS variables — same
// convention as Diagrams.tsx above / modules/closeout-gate-evidence/Bpmn.tsx.

const INK = "var(--foreground)";
const FAINT = "var(--faint)";
const SURFACE = "var(--surface)";
const BRAND = "var(--brand)";
const WARN = "var(--warning)";

function Box({
  cx,
  cy,
  w = 150,
  h = 52,
  label,
  color = "var(--border-strong)",
  dashed = false,
}: {
  cx: number;
  cy: number;
  w?: number;
  h?: number;
  label: string;
  color?: string;
  dashed?: boolean;
}) {
  const lines = label.split("\n");
  const top = cy - ((lines.length - 1) * 13) / 2;
  return (
    <g>
      <rect
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        rx={9}
        fill={SURFACE}
        stroke={color}
        strokeWidth={1.75}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      {lines.map((line, i) => (
        <text key={i} x={cx} y={top + i * 13 + 4} textAnchor="middle" fontSize={10.5} fontWeight={600} fill={INK}>
          {line}
        </text>
      ))}
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  label,
  color = FAINT,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  color?: string;
  dashed?: boolean;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <path
        d={`M ${x1} ${y1} L ${x2} ${y2}`}
        stroke={color}
        strokeWidth={1.75}
        strokeDasharray={dashed ? "4 3" : undefined}
        markerEnd="url(#arrowhead196)"
        fill="none"
      />
      {label ? (
        <text x={mx} y={my - 8} textAnchor="middle" fontSize={9} fontWeight={600} fill={color}>
          {label}
        </text>
      ) : null}
    </g>
  );
}

/** Which door the system tries first, before vs. after — the whole #196 PR as one picture. */
export function DoorsDiagram({ after }: { after: boolean }) {
  const system = { x: 80, y: 100 };
  const official = { x: 380, y: 44 };
  const rawHost = { x: 380, y: 156 };
  const placeholder = { x: 590, y: 156 };

  return (
    <svg
      viewBox="0 0 640 210"
      role="img"
      aria-label={
        after
          ? "After: the system tries the official /score door first; the raw-host door is locked behind a manual switch, falling back to an offline placeholder when the switch is off."
          : "Before: the system tried the unadvertised raw-host door first, ahead of the official /score door."
      }
      className="w-full"
    >
      <defs>
        <marker
          id="arrowhead196"
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

      <Box cx={system.x} cy={system.y} w={110} h={48} label="System" color={INK} />

      {after ? (
        <>
          <Arrow x1={system.x + 55} y1={system.y - 14} x2={official.x - 76} y2={official.y + 4} label="tries first" color={BRAND} />
          <Arrow
            x1={system.x + 55}
            y1={system.y + 14}
            x2={rawHost.x - 76}
            y2={rawHost.y - 4}
            label="locked — needs switch"
            color={WARN}
            dashed
          />
          <Arrow x1={rawHost.x + 76} y1={rawHost.y} x2={placeholder.x - 44} y2={placeholder.y} label="switch off" color={FAINT} dashed />
        </>
      ) : (
        <>
          <Arrow x1={system.x + 55} y1={system.y - 14} x2={official.x - 76} y2={official.y + 4} label="not tried" color={FAINT} dashed />
          <Arrow x1={system.x + 55} y1={system.y + 14} x2={rawHost.x - 76} y2={rawHost.y - 4} label="tries first" color={WARN} />
        </>
      )}

      <Box cx={official.x} cy={official.y} label={"Official door\n/score"} color={after ? BRAND : "var(--border-strong)"} />
      <Box cx={rawHost.x} cy={rawHost.y} label={"Raw-host door\ndirect login"} color={after ? WARN : WARN} />
      {after ? (
        <Box cx={placeholder.x} cy={placeholder.y} w={110} label={"Offline\nestimate"} color="var(--border-strong)" dashed />
      ) : null}
    </svg>
  );
}
