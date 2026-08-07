// Drawn, not described: two doors, the gate they both fail to open, and the spine behind it.
// The receipt door is open and, since this week, keeps what you put through it. The scan door
// is switched off. The spine needs a scored item, and only the scanner makes one.

import { journey } from "./data";

const SPINE_X = [30, 164, 298, 432, 566];
const NODE_W = 124;

export function Journey() {
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-border bg-surface p-4">
        <svg
          viewBox="0 0 720 264"
          role="img"
          aria-label="Two entry points feed a gate that requires a scored item; neither produces one, so the claim spine below is never reached on a phone."
          className="h-auto w-full min-w-160"
        >
          {/* ── the two doors ─────────────────────────────────────────── */}
          <g>
            <rect
              x="30" y="6" width="300" height="66" rx="8"
              fill="var(--color-surface-raised)"
              stroke="var(--color-border)"
              strokeDasharray="4 3"
            />
            <text x="46" y="28" fontSize="13" fontWeight="600" fill="var(--color-muted)">
              Scan produce
            </text>
            <text x="314" y="28" fontSize="10" textAnchor="end" fill="var(--color-faint)"
              fontFamily="ui-monospace, monospace" letterSpacing="1">
              OFF
            </text>
            {journey.doors[0].note.map((line, i) => (
              <text key={line} x="46" y={46 + i * 13} fontSize="10.5" fill="var(--color-faint)">
                {line}
              </text>
            ))}
          </g>

          <g>
            <rect
              x="390" y="6" width="300" height="66" rx="8"
              fill="var(--color-brand-tint)"
              stroke="var(--color-brand)"
              strokeOpacity="0.5"
            />
            <text x="406" y="28" fontSize="13" fontWeight="600" fill="var(--color-brand-strong)">
              Add from a receipt
            </text>
            <text x="674" y="28" fontSize="10" textAnchor="end" fill="var(--color-brand-strong)"
              fontFamily="ui-monospace, monospace" letterSpacing="1">
              OPEN
            </text>
            {journey.doors[1].note.map((line, i) => (
              <text key={line} x="406" y={46 + i * 13} fontSize="10.5" fill="var(--color-muted)">
                {line}
              </text>
            ))}
          </g>

          {/* ── both doors lead into the gate ─────────────────────────── */}
          <path d="M180 72 V100" stroke="var(--color-border-strong)" strokeWidth="1.4"
            strokeDasharray="4 3" fill="none" />
          <path d="M540 72 V100" stroke="var(--color-brand)" strokeWidth="1.6" fill="none" />
          <path d="M175 95 l5 5 5-5" stroke="var(--color-border-strong)"
            strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M535 95 l5 5 5-5" stroke="var(--color-brand)"
            strokeWidth="1.6" fill="none" strokeLinecap="round" />

          {/* ── the gate ──────────────────────────────────────────────── */}
          <rect x="30" y="100" width="660" height="52" rx="8"
            fill="var(--color-warning)" fillOpacity="0.08"
            stroke="var(--color-warning)" strokeOpacity="0.45" />
          {/* padlock */}
          <g transform="translate(48 114)" stroke="var(--color-warning)" strokeWidth="1.4" fill="none">
            <rect x="0" y="8" width="14" height="10" rx="2" />
            <path d="M3.4 8V5.6a3.6 3.6 0 0 1 7.2 0V8" strokeLinecap="round" />
          </g>
          <text x="76" y="124" fontSize="12.5" fontWeight="600" fill="var(--color-warning)">
            Gate — the spine needs a scored item, and neither door makes one
          </text>
          <text x="76" y="141" fontSize="10.5" fill="var(--color-muted)">
            A typed item carries no score. Only the scanner makes one, and it is off.
          </text>

          {/* ── the blocked step down to the spine ────────────────────── */}
          <path d="M360 152 V172" stroke="var(--color-danger)" strokeWidth="1.6"
            strokeDasharray="4 3" fill="none" />
          <path d="M300 176 H420" stroke="var(--color-danger)" strokeWidth="2.4"
            strokeLinecap="round" />
          <text x="432" y="180" fontSize="10" fill="var(--color-danger)"
            fontFamily="ui-monospace, monospace">
            stops here on a phone
          </text>

          {/* ── the spine, greyed because it is unreached ─────────────── */}
          {journey.spine.map((s, i) => (
            <g key={s}>
              <rect
                x={SPINE_X[i]} y="200" width={NODE_W} height="38" rx="6"
                fill="var(--color-surface-raised)"
                stroke="var(--color-border)"
                strokeDasharray="3 3"
              />
              <text
                x={SPINE_X[i] + NODE_W / 2} y="224" fontSize="11"
                textAnchor="middle" fill="var(--color-faint)"
              >
                {s}
              </text>
              {i < SPINE_X.length - 1 && (
                <path
                  d={`M${SPINE_X[i] + NODE_W} 219 h6 m0 0 l-3 -3 m3 3 l-3 3`}
                  stroke="var(--color-border-strong)" strokeWidth="1.2" fill="none"
                  strokeLinecap="round" strokeLinejoin="round"
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* the same spine, in the one place it does run */}
      <div className="grid gap-3 sm:grid-cols-2">
        {journey.lanes.map((l) => (
          <div
            key={l.label}
            className={`rounded-lg border px-4 py-3 ${
              l.ok ? "border-brand/40 bg-brand-tint" : "border-dashed border-border"
            }`}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-faint">
              {l.label}
            </div>
            <div
              className={`mt-1 text-lg font-semibold ${
                l.ok ? "text-brand-strong" : "text-faint"
              }`}
            >
              {l.verdict}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
