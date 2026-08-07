// Three artifacts on one day, on a real time axis. Two share a published lineage.
// The third — the one testers and I actually installed — hangs off nothing.

import { buildTrail } from "./data";

const X = [30, 290, 550];
const W = 180;
const TICK = [120, 380, 640];

export function BuildTrail() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface p-4">
      <svg
        viewBox="0 0 760 206"
        role="img"
        aria-label="Timeline of three builds in one day; the evening build testers installed has no published origin linking it to the two verified earlier."
        className="h-auto w-full min-w-160"
      >
        {buildTrail.map((b, i) => {
          const y = b.linked ? 24 : 100;
          const stroke = b.linked ? "var(--color-brand)" : "var(--color-warning)";
          return (
            <g key={b.role}>
              <rect
                x={X[i]} y={y} width={W} height="62" rx="8"
                fill={b.linked ? "var(--color-brand-tint)" : "var(--color-warning)"}
                fillOpacity={b.linked ? 1 : 0.08}
                stroke={stroke}
                strokeOpacity={b.linked ? 0.5 : 0.45}
                strokeDasharray={b.linked ? undefined : "4 3"}
              />
              <text x={X[i] + 14} y={y + 22} fontSize="11.5" fontWeight="600"
                fontFamily="ui-monospace, monospace" fill="var(--color-foreground)">
                {b.build}
              </text>
              <text x={X[i] + 14} y={y + 38} fontSize="10.5" fill="var(--color-muted)">
                {b.role}
              </text>
              <text x={X[i] + 14} y={y + 53} fontSize="9.5"
                fontFamily="ui-monospace, monospace"
                fill={b.linked ? "var(--color-brand-strong)" : "var(--color-warning)"}>
                {b.origin}
              </text>

              {/* drop line to the time axis */}
              <path d={`M${TICK[i]} ${y + 62} V172`} stroke="var(--color-border)"
                strokeDasharray="3 3" />
              <circle cx={TICK[i]} cy="176" r="3.4"
                fill={b.linked ? "var(--color-brand)" : "var(--color-warning)"} />
              <text x={TICK[i]} y="196" fontSize="9.5" textAnchor="middle"
                fontFamily="ui-monospace, monospace" letterSpacing="1"
                fill="var(--color-faint)">
                {b.time}
              </text>
            </g>
          );
        })}

        {/* same artifact, announced then verified */}
        <path d="M210 55 H282 m0 0 l-5 -4 m5 4 l-5 4" fill="none" stroke="var(--color-brand)"
          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="246" y="45" fontSize="9" textAnchor="middle"
          fontFamily="ui-monospace, monospace" fill="var(--color-brand-strong)">
          same file
        </text>

        {/* the link that does not exist */}
        <path d="M470 66 Q516 66 516 118 H544" fill="none" stroke="var(--color-warning)"
          strokeWidth="1.4" strokeDasharray="4 4" />
        <g transform="translate(516 92)">
          <circle r="9" fill="var(--color-background)" stroke="var(--color-warning)" strokeWidth="1.2" />
          <path d="M-3.4 -3.4 l6.8 6.8 M3.4 -3.4 l-6.8 6.8" stroke="var(--color-warning)"
            strokeWidth="1.5" strokeLinecap="round" />
        </g>
        <text x="530" y="88" fontSize="9" fontFamily="ui-monospace, monospace"
          fill="var(--color-warning)">
          no published link
        </text>

        {/* the time axis */}
        <path d="M20 176 H740" stroke="var(--color-border)" />
      </svg>
    </div>
  );
}
