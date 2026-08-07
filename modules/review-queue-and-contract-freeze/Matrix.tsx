// Who may do what, after the shopper / reviewer / policy-admin split.
// Every deny in this grid is an actual refusal the tests exercise, not a convention.

import { matrix } from "./data";
import { IconCheck, IconCross, IconOff } from "./icons";

function Cell({ v }: { v: "yes" | "no" | "never" }) {
  if (v === "yes") return <IconCheck className="mx-auto text-brand-strong" />;
  if (v === "never") return <IconOff className="mx-auto text-faint" />;
  return <IconCross className="mx-auto text-danger/70" />;
}

export function Matrix() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <table className="w-full min-w-md border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-faint">
              Can they
            </th>
            {matrix.roles.map((r) => (
              <th
                key={r}
                className="px-3 py-3 text-center font-mono text-[10px] uppercase tracking-widest text-faint"
              >
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.rows.map((row) => (
            <tr key={row.action} className="border-b border-border last:border-0">
              <td className="px-4 py-2.5">{row.action}</td>
              {row.cells.map((c, i) => (
                <td key={i} className="px-3 py-2.5">
                  <Cell v={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-border px-4 py-3 text-sm text-muted">
        The bottom row is the one that matters. Nobody holds that power, including the person who
        wrote the code. It is refused whole, even when the request also carries a field that would
        otherwise be accepted.
      </p>
    </div>
  );
}
