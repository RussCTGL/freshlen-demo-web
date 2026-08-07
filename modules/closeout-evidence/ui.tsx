// One layout grammar for the whole card, so a reader never has to re-learn the page.
//
//   Rows  — full width, subject on the left, a mono chip on the right. The default.
//   Pair  — exactly two columns, and only ever for a genuine A-versus-B contrast.
//   Rail  — an ordered chain: horizontal for a pipeline, vertical for a timeline.
//   Note  — a single-line aside. Never more than two lines of text.
//
// Every section is Section → one of those four. Nothing else.

import type { ReactNode } from "react";

export type Tone = "good" | "bad" | "warn" | "off";

export const toneChip: Record<Tone, string> = {
  good: "border-brand/40 bg-brand-tint text-brand-strong",
  bad: "border-danger/40 bg-danger/5 text-danger",
  warn: "border-warning/40 bg-warning/5 text-warning",
  off: "border-border bg-surface-raised text-muted",
};

export const toneText: Record<Tone, string> = {
  good: "text-brand-strong",
  bad: "text-danger",
  warn: "text-warning",
  off: "text-faint",
};

export const toneLeft: Record<Tone, string> = {
  good: "border-l-brand",
  bad: "border-l-danger",
  warn: "border-l-warning",
  off: "border-l-border",
};

export const toneEdge: Record<Tone, string> = {
  good: "border-brand/50 bg-brand-tint",
  bad: "border-danger/40 bg-danger/5",
  warn: "border-warning/40 bg-warning/5",
  off: "border-border bg-surface-raised",
};

export function Section({
  title,
  count,
  children,
}: {
  title: string;
  count?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-2">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          {title}
        </h3>
        {count && <span className="font-mono text-xs text-faint">{count}</span>}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Full-width table. One row per fact, verdict always in the same place on the right. */
export function Rows({ children }: { children: ReactNode }) {
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
      {children}
    </ul>
  );
}

export function Row({
  children,
  chip,
  tone = "off",
  icon,
  edge,
}: {
  children: ReactNode;
  chip: string;
  tone?: Tone;
  icon?: ReactNode;
  edge?: boolean;
}) {
  return (
    <li
      className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 ${
        edge ? `border-l-4 ${toneLeft[tone]}` : ""
      }`}
    >
      <span className="flex items-center gap-2.5 text-sm">
        {icon && <span className={toneText[tone]}>{icon}</span>}
        {children}
      </span>
      <span
        className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-xs ${toneChip[tone]}`}
      >
        {chip}
      </span>
    </li>
  );
}

/** Exactly two columns. Reserved for real contrasts, never used just to fill space. */
export function Pair({ children }: { children: ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

export function PairCell({
  label,
  tone,
  children,
}: {
  label: string;
  tone: Tone;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-lg border p-4 ${toneEdge[tone]}`}>
      <div className="font-mono text-[10px] uppercase tracking-widest text-faint">{label}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

/** A single-line aside. Two lines is the hard ceiling. */
export function Note({
  icon,
  title,
  body,
  tone = "off",
}: {
  icon: ReactNode;
  title: string;
  body?: string;
  tone?: Tone;
}) {
  return (
    <div className={`flex gap-3 rounded-lg border p-4 ${toneEdge[tone]}`}>
      <span className={`mt-0.5 ${toneText[tone]}`}>{icon}</span>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        {body && <div className="mt-1 text-sm text-muted">{body}</div>}
      </div>
    </div>
  );
}

/** Horizontal chain. Used for the claim spine. */
export function RailAcross({ steps }: { steps: string[] }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {steps.map((s, i) => (
        <div key={s} className="flex min-w-0 flex-1 items-center">
          <div className="min-w-20 flex-1 rounded-md border border-border bg-surface-raised px-2 py-1.5 text-center text-xs leading-tight">
            {s}
          </div>
          {i < steps.length - 1 && (
            <span className="px-0.5 text-faint" aria-hidden>
              <svg viewBox="0 0 8 12" className="h-3 w-2" fill="none">
                <path
                  d="m2 2 4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/** Vertical timeline. Used for the build trail and for the pull-request decision. */
export function RailDown({
  items,
}: {
  items: { key: string; tone: Tone; head: ReactNode; body?: ReactNode }[];
}) {
  return (
    <ol>
      {items.map((it, i) => (
        <li key={it.key} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`mt-1.5 block h-2.5 w-2.5 shrink-0 rounded-full ${
                it.tone === "good" ? "bg-brand" : it.tone === "warn" ? "bg-warning" : "bg-faint"
              }`}
            />
            {i < items.length - 1 && (
              <span className="w-px flex-1 border-l border-dashed border-border" />
            )}
          </div>
          <div className={i < items.length - 1 ? "min-w-0 pb-4" : "min-w-0"}>
            {it.head}
            {it.body}
          </div>
        </li>
      ))}
    </ol>
  );
}
