// Week 8 is a freeze week. Nothing new ships; the work is deciding what we can stand behind.
// Detail behind every line here lives on issues #164, #177, #226 and PRs #210, #212.

export const lead = "Separate what we verified from what we announced.";

export type Verdict = "works" | "fails" | "by-design" | "mismatch";

/** The board a reader should be able to take in without reading a sentence. */
export const board: { item: string; verdict: Verdict; label: string }[] = [
  { item: "A shopper can save a receipt item and find it again", verdict: "works", label: "Works" },
  { item: "Submitting the same receipt twice gets merged", verdict: "fails", label: "Announced, does not" },
  { item: "Produce scanning on a phone", verdict: "by-design", label: "Withheld on purpose" },
  { item: "The build we verified is the build testers installed", verdict: "mismatch", label: "No" },
  { item: "The full claim journey, offline", verdict: "works", label: "All 16 steps" },
];

/** The picture: same journey, two surfaces. */
export const journey = {
  steps: ["Capture", "Receipt", "Claim", "Review", "Decision", "Signed record"],
  lanes: [
    {
      label: "In our offline harness",
      verdict: "16 of 16 steps",
      states: ["ok", "ok", "ok", "ok", "ok", "ok"],
      tone: "brand",
    },
    {
      label: "On a phone in the field today",
      verdict: "stops at step one",
      states: ["stop", "unreached", "unreached", "unreached", "unreached", "unreached"],
      tone: "danger",
    },
  ] as {
    label: string;
    verdict: string;
    states: ("ok" | "stop" | "unreached")[];
    tone: "brand" | "danger";
  }[],
  note:
    "The scanner is switched off on every build in the field, so nothing downstream of it has been exercised on real hardware. The offline row is real and it is proof of design, not proof of a shipping product.",
};

export const numbers = [
  { value: "2", label: "of our own components disagree" },
  { value: "3", label: "ways the old check reported clean" },
  { value: "5", label: "builds, scanner off on all of them" },
  { value: "0", label: "scores produced on a phone this week" },
];

/** Finding 01, drawn rather than described. */
export const divergence = {
  input: "one photo, with a quality field attached",
  paths: [
    {
      side: "How we handle it",
      outcome: "Claim goes through",
      how: "The unknown field is dropped and the claim continues.",
      bad: false,
    },
    {
      side: "How our published contract says to handle it",
      outcome: "Claim rejected",
      how: "The same field is invalid input. Every claim carrying it fails.",
      bad: true,
    },
  ],
};

export const findings = [
  {
    n: "01",
    icon: "split",
    title: "Two parts of our own system disagree about the same photo",
    lines: [
      { k: "What breaks", v: "Every claim from that app version, against any partner who built to our contract." },
      { k: "What has to happen first", v: "Nothing. No feature has to be built. The app only has to start sending the field." },
      { k: "Why it is not a bug", v: "Both sides behave exactly as specified. What is missing is a decision about which one wins." },
    ],
    next: "Needs an owner for the mapping. Architecture call, not a fix.",
    tone: "danger",
  },
  {
    n: "02",
    icon: "gauge",
    title: "The check behind every no regressions claim could pass while broken",
    lines: [
      { k: "How it failed", v: "Three separate conditions made it report clean when it had compared nothing meaningful." },
      { k: "Why that is worse than no check", v: "A green light nobody looks at twice. It was the evidence under my reviews all week." },
      { k: "What replaced it", v: "A version that starts at refused and has to prove it looked at the right commit, in the right environment." },
    ],
    next: "Closed. Shipped with its own failure fixtures.",
    tone: "warning",
  },
  {
    n: "03",
    icon: "tags",
    title: "The build we verified on hardware is not the build testers installed",
    lines: [
      { k: "What was in play", v: "Three artifacts on one day: the one announced, the one verified on rented hardware, the one testers actually received." },
      { k: "Why it matters", v: "Only one of them has a published origin, so the hardware result cannot be cited for the tester reports, or the other way round." },
      { k: "How it surfaced", v: "Checking my own device row against the release note before filing it." },
    ],
    next: "Release owner. Raised before the release record is validated, not after.",
    tone: "warning",
  },
];

export const claimLimit =
  "What none of this lets us claim: anything about model or scanner quality. That gate stays closed, and closed is the correct reading, not a shortfall to explain away.";
