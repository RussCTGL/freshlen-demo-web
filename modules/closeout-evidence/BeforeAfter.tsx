// The one thing that measurably improved for a shopper this week, and the one that did not —
// drawn as the two inventory screens, because that is what a shopper actually sees.

import { beforeAfter } from "./data";
import { IconCheck, IconCross } from "./icons";
import { Pair, PairCell } from "./ui";

type Screen = (typeof beforeAfter)[number]["screen"];

function Phone({ screen, good }: { screen: Screen; good: boolean }) {
  return (
    <svg
      viewBox="0 0 168 250"
      role="img"
      aria-label={`Inventory screen showing ${screen.total}`}
      className="mx-auto h-auto w-full max-w-38"
    >
      {/* device */}
      <rect x="2" y="2" width="164" height="246" rx="18"
        fill="var(--color-surface)" stroke="var(--color-border-strong)" strokeWidth="1.4" />
      <rect x="62" y="9" width="44" height="4" rx="2" fill="var(--color-border)" />

      {/* screen */}
      <rect x="12" y="22" width="144" height="216" rx="10" fill="var(--color-background)"
        stroke="var(--color-border)" />

      <text x="24" y="46" fontSize="12" fontWeight="600" fill="var(--color-foreground)">
        Inventory
      </text>
      <text x="144" y="46" fontSize="10" textAnchor="end" fontFamily="ui-monospace, monospace"
        fill={good ? "var(--color-brand-strong)" : "var(--color-danger)"}>
        {screen.total}
      </text>
      <path d="M24 56 H144" stroke="var(--color-border)" />

      {screen.items.length === 0 ? (
        <>
          <rect x="24" y="70" width="120" height="56" rx="8" fill="none"
            stroke="var(--color-border)" strokeDasharray="4 4" />
          <text x="84" y="103" fontSize="10.5" textAnchor="middle" fill="var(--color-faint)">
            nothing here
          </text>
        </>
      ) : (
        screen.items.map((it, i) => (
          <g key={i}>
            <rect
              x="24" y={70 + i * 44} width="120" height="36" rx="7"
              fill={it.dup ? "var(--color-warning)" : "var(--color-surface-raised)"}
              fillOpacity={it.dup ? 0.1 : 1}
              stroke={it.dup ? "var(--color-warning)" : "var(--color-border)"}
              strokeOpacity={it.dup ? 0.5 : 1}
            />
            <text x="34" y={87 + i * 44} fontSize="11" fill="var(--color-foreground)">
              {it.name}
            </text>
            <text x="34" y={99 + i * 44} fontSize="8.5" fontFamily="ui-monospace, monospace"
              fill="var(--color-faint)">
              {it.tag}
            </text>
            {it.dup && (
              <text x="134" y={92 + i * 44} fontSize="8.5" textAnchor="end"
                fontFamily="ui-monospace, monospace" fill="var(--color-warning)">
                duplicate
              </text>
            )}
          </g>
        ))
      )}
    </svg>
  );
}

export function BeforeAfter() {
  return (
    <Pair>
      {beforeAfter.map((c) => (
        <PairCell key={c.when} label={c.when} tone={c.good ? "good" : "off"}>
          <Phone screen={c.screen} good={c.good} />
          <ul className="mt-4 space-y-2 border-t border-border pt-3">
            {c.rows.map((r) => (
              <li key={r.text} className="flex items-start gap-2 text-sm">
                {r.ok ? (
                  <IconCheck className="mt-0.5 text-brand-strong" />
                ) : (
                  <IconCross className="mt-0.5 text-danger" />
                )}
                <span className={r.ok ? "" : "text-muted"}>{r.text}</span>
              </li>
            ))}
          </ul>
        </PairCell>
      ))}
    </Pair>
  );
}
