// Local inline icons. No icon dependency in this repo, and none is worth adding for six glyphs.
// All stroke-based on currentColor so they inherit the verdict colour and both themes.

type P = { className?: string };

const base = "h-4 w-4 shrink-0";

export function IconCheck({ className = "" }: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={`${base} ${className}`}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 8.2 7 10.2 11 5.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCross({ className = "" }: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={`${base} ${className}`}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="m5.6 5.6 4.8 4.8M10.4 5.6l-4.8 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Deliberately off. A switch in the off position, not a failure. */
export function IconOff({ className = "" }: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={`${base} ${className}`}>
      <rect x="1.5" y="4.5" width="13" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="5" cy="8" r="1.8" fill="currentColor" />
    </svg>
  );
}

export function IconWarn({ className = "" }: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={`${base} ${className}`}>
      <path d="M8 2.2 14.5 13.3H1.5L8 2.2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8 6.4v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="11.4" r="0.85" fill="currentColor" />
    </svg>
  );
}

/** One input, two outcomes. Used for the divergence finding. */
export function IconSplit({ className = "" }: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={`${base} ${className}`}>
      <path d="M8 14V9c0-2 1.5-3 3.5-3H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8 14V9c0-2-1.5-3-3.5-3H2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="14" r="1.3" fill="currentColor" />
    </svg>
  );
}

/** A gauge reading fine while disconnected. Used for the broken-check finding. */
export function IconGauge({ className = "" }: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={`${base} ${className}`}>
      <path d="M2 11.5a6 6 0 1 1 12 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M8 11.5 11 7.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="11.5" r="1" fill="currentColor" />
    </svg>
  );
}

/** Two labels that should be one. Used for the build-identity finding. */
export function IconTags({ className = "" }: P) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={`${base} ${className}`}>
      <path d="M2 2.5h4.4L11 7.1 6.6 11.5 2 6.9V2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="4.6" cy="5.1" r="0.9" fill="currentColor" />
      <path d="M8.6 2.5h2.2L14.5 6.2l-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
