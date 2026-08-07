// Corrected picture. The receipt door is open and, since this week, keeps what you put through it.
// The scan door is switched off. The claim spine needs a scored item, and only the scanner makes one.

import { journey } from "./data";
import { IconCheck, IconOff, IconLock } from "./icons";
import { Pair, Note, RailAcross, toneEdge, toneText } from "./ui";

export function Journey() {
  return (
    <div className="space-y-3">
      <Pair>
        {journey.doors.map((d) => {
          const tone = d.open ? "good" : "off";
          return (
            <div key={d.name} className={`rounded-lg border p-4 ${toneEdge[tone]}`}>
              <div className="flex items-center gap-2">
                <span className={toneText[tone]}>{d.open ? <IconCheck /> : <IconOff />}</span>
                <span className="text-sm font-semibold">{d.name}</span>
                <span className={`ml-auto font-mono text-xs ${toneText[tone]}`}>{d.state}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{d.note}</p>
            </div>
          );
        })}
      </Pair>

      <Note icon={<IconLock />} title={journey.gate.title} body={journey.gate.note} tone="warn" />

      <div className="rounded-lg border border-border bg-surface p-4">
        <RailAcross steps={journey.spine} />

        <div className="mt-4 space-y-2">
          {journey.lanes.map((l) => (
            <div
              key={l.label}
              className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-md border px-3 py-2 ${
                l.ok ? "border-brand/40 bg-brand-tint" : "border-dashed border-border"
              }`}
            >
              <span className="text-sm">{l.label}</span>
              <span className={`font-mono text-xs ${l.ok ? "text-brand-strong" : "text-faint"}`}>
                {l.verdict}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
