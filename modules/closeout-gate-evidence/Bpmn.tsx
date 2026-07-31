// BPMN-style flow of one orchestrator run (scripts/run_closeout_gates.py).
// Vertical layout so it fits the content column without horizontal scroll.
// Inline SVG, theme-aware via CSS variables; every end state is labeled in
// text so meaning never rides on color alone.

const INK = "var(--foreground)";
const MUTED = "var(--muted)";
const FAINT = "var(--faint)";
const LINE = "var(--border-strong)";
const SURFACE = "var(--surface)";
const OK = "var(--success)";
const WARN = "var(--warning)";
const ERR = "var(--danger)";

function Task({
  y,
  h = 48,
  title,
  sub,
  loop = false,
}: {
  y: number;
  h?: number;
  title: string;
  sub?: string;
  loop?: boolean;
}) {
  const x = 115;
  const w = 170;
  const cy = y + h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={SURFACE} stroke={LINE} strokeWidth={1.5} />
      <text
        x={x + w / 2}
        y={sub ? cy - (loop ? 10 : 4) : cy + 4}
        textAnchor="middle"
        fontSize={11.5}
        fontWeight={600}
        fill={INK}
      >
        {title}
      </text>
      {sub ? (
        <text
          x={x + w / 2}
          y={cy + (loop ? 4 : 12)}
          textAnchor="middle"
          fontSize={9}
          fill={MUTED}
        >
          {sub}
        </text>
      ) : null}
      {loop ? (
        <text x={x + w / 2} y={y + h - 8} textAnchor="middle" fontSize={10} fill={FAINT}>
          ↻ ×11
        </text>
      ) : null}
    </g>
  );
}

function Gateway({ cy, label }: { cy: number; label: string }) {
  const cx = 200;
  const half = 26;
  return (
    <g>
      <polygon
        points={`${cx},${cy - half} ${cx + half},${cy} ${cx},${cy + half} ${cx - half},${cy}`}
        fill={SURFACE}
        stroke={LINE}
        strokeWidth={1.5}
      />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={MUTED}>
        ×
      </text>
      <text x={cx - 34} y={cy + 4} textAnchor="end" fontSize={10} fill={MUTED}>
        {label}
      </text>
    </g>
  );
}

function EndEvent({
  cx,
  cy,
  color,
  code,
  notes,
  side = "below",
}: {
  cx: number;
  cy: number;
  color: string;
  code: string;
  notes: string[];
  side?: "below" | "right";
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={13} fill={SURFACE} stroke={color} strokeWidth={3.5} />
      {side === "below" ? (
        <>
          <text
            x={cx}
            y={cy + 32}
            textAnchor="middle"
            fontSize={11.5}
            fontWeight={700}
            fontFamily="var(--font-geist-mono, monospace)"
            fill={color}
          >
            {code}
          </text>
          {notes.map((n, i) => (
            <text key={n} x={cx} y={cy + 45 + i * 12} textAnchor="middle" fontSize={9.5} fill={MUTED}>
              {n}
            </text>
          ))}
        </>
      ) : (
        <>
          <text
            x={cx + 22}
            y={cy - 1}
            fontSize={11.5}
            fontWeight={700}
            fontFamily="var(--font-geist-mono, monospace)"
            fill={color}
          >
            {code}
          </text>
          {notes.map((n, i) => (
            <text key={n} x={cx + 22} y={cy + 11 + i * 12} fontSize={9.5} fill={MUTED}>
              {n}
            </text>
          ))}
        </>
      )}
    </g>
  );
}

function Edge({ d, label, lx, ly }: { d: string; label?: string; lx?: number; ly?: number }) {
  return (
    <g>
      <path d={d} fill="none" stroke={FAINT} strokeWidth={1.5} markerEnd="url(#arrow)" />
      {label ? (
        <text x={lx} y={ly} fontSize={9.5} fill={FAINT}>
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function BpmnDiagram() {
  return (
    <svg
      viewBox="0 0 660 648"
      role="img"
      aria-label="BPMN-style flow: load and check the registry, bind the source commit, run the 11 gates in frozen order, write and self-validate the packet, then end at exit 0 (every gate verified), exit 1 (honest non-green), or exit 2 (run refused)."
      className="w-full"
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={FAINT} />
        </marker>
      </defs>

      {/* Start event */}
      <circle cx={200} cy={28} r={12} fill={SURFACE} stroke={LINE} strokeWidth={1.5} />
      <text x={222} y={32} fontSize={9.5} fill={MUTED}>
        run
      </text>

      {/* Main vertical rail */}
      <Edge d="M 200 40 V 56" />
      <Task y={58} title="Load & check registry" sub="frozen 11-gate set" />
      <Edge d="M 200 106 V 126" />
      <Gateway cy={154} label="registry valid?" />
      <Edge d="M 200 180 V 198" label="yes" lx={206} ly={194} />
      <Task y={200} title="Bind source commit" sub="record clean / dirty" />
      <Edge d="M 200 248 V 266" />
      <Task
        y={268}
        h={64}
        title="Run gates in frozen order"
        sub="no shell · timeout · redact · hash · #186 record"
        loop
      />
      <Edge d="M 200 332 V 350" />
      <Gateway cy={378} label="source unchanged?" />
      <Edge d="M 200 404 V 422" label="yes" lx={206} ly={418} />
      <Task y={424} title="Write & self-validate packet" sub="aggregate + normalized" />
      <Edge d="M 200 472 V 490" />
      <Gateway cy={518} label="all VERIFIED?" />

      {/* exit 0 */}
      <Edge d="M 200 544 V 573" label="yes" lx={206} ly={562} />
      <EndEvent cx={200} cy={588} color={OK} code="exit 0" notes={["every gate verified"]} />

      {/* exit 1 */}
      <Edge d="M 226 518 H 341" label="no" lx={240} ly={512} />
      <EndEvent
        cx={356}
        cy={518}
        color={WARN}
        code="exit 1"
        notes={["honest non-green", "today: 8 verified / 3 blocked"]}
        side="right"
      />

      {/* error rail into exit 2 */}
      <Edge d="M 226 154 H 558" label="invalid" lx={460} ly={148} />
      <Edge d="M 226 378 H 558" label="changed" lx={460} ly={372} />
      <Edge d="M 285 448 H 558" label="violations" lx={452} ly={442} />
      <Edge d="M 560 156 V 573" />
      <EndEvent cx={560} cy={588} color={ERR} code="exit 2" notes={["run refused,", "nothing quotable"]} />
    </svg>
  );
}
