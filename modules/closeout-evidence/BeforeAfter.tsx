// The one thing that measurably improved for a shopper this week, and the one that did not.

import { beforeAfter } from "./data";
import { IconCheck, IconCross } from "./icons";
import { Pair, PairCell } from "./ui";

export function BeforeAfter() {
  return (
    <Pair>
      {beforeAfter.map((c) => (
        <PairCell key={c.when} label={c.when} tone={c.good ? "good" : "off"}>
          <ul className="space-y-2">
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
