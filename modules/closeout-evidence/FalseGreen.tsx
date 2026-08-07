// Three broken states, one green light. Drawn as the funnel it actually was.

import { falseGreens } from "./data";

const Y = [26, 80, 134];

export function FalseGreen() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface p-4">
      <svg
        viewBox="0 0 720 196"
        role="img"
        aria-label="Three different broken conditions all funnel into a single green pass result."
        className="h-auto w-full min-w-150"
      >
        <text x="10" y="12" fontSize="9.5" fontFamily="ui-monospace, monospace"
          letterSpacing="1.2" fill="var(--color-faint)">
          WHAT WAS ACTUALLY TRUE
        </text>
        <text x="470" y="12" fontSize="9.5" fontFamily="ui-monospace, monospace"
          letterSpacing="1.2" fill="var(--color-faint)">
          WHAT THE CHECK REPORTED
        </text>

        {falseGreens.map((f, i) => (
          <g key={f.reality}>
            <rect x="10" y={Y[i]} width="340" height="42" rx="7"
              fill="var(--color-danger)" fillOpacity="0.06"
              stroke="var(--color-danger)" strokeOpacity="0.35" />
            <circle cx="30" cy={Y[i] + 21} r="3.2" fill="var(--color-danger)" />
            <text x="44" y={Y[i] + 25} fontSize="11" fill="var(--color-muted)">
              {f.reality}
            </text>
            {/* funnel line into the single lamp */}
            <path
              d={`M350 ${Y[i] + 21} H400 Q430 ${Y[i] + 21} 430 101 H482`}
              fill="none"
              stroke="var(--color-border-strong)"
              strokeWidth="1.2"
            />
          </g>
        ))}

        {/* the lamp */}
        <circle cx="512" cy="101" r="30" fill="var(--color-brand-tint)"
          stroke="var(--color-brand)" strokeWidth="1.6" />
        <path d="M500 101 l8 8 16-17" fill="none" stroke="var(--color-brand-strong)"
          strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />

        <text x="556" y="96" fontSize="15" fontWeight="600" fill="var(--color-brand-strong)">
          reported clean
        </text>
        <text x="556" y="114" fontSize="10" fontFamily="ui-monospace, monospace"
          fill="var(--color-faint)">
          3 times out of 3
        </text>
      </svg>
    </div>
  );
}
