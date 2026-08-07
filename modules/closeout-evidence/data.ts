// Week 8 is a freeze week. Nothing new ships; the work is deciding what we can stand behind.
// Detail behind every line here lives on issues #164, #177, #226 and PRs #210, #212.

export const lead = "Separate what we verified from what we announced.";

export type Verdict = "works" | "fails" | "by-design" | "mismatch";

/** The board a reader should be able to take in without reading a sentence. */
export const board: { item: string; verdict: Verdict; label: string }[] = [
  { item: "A shopper can add items from a receipt and find them again", verdict: "works", label: "Fixed this week" },
  { item: "Submitting the same receipt twice gets merged", verdict: "fails", label: "Announced, does not" },
  { item: "Produce scanning on a phone", verdict: "by-design", label: "Withheld on purpose" },
  { item: "A claim can be filed from a phone", verdict: "by-design", label: "Nothing to file yet" },
  { item: "The build we verified is the build testers installed", verdict: "mismatch", label: "No" },
  { item: "The full claim journey, offline", verdict: "works", label: "All 16 steps" },
];

/** Two ways in. One is open, one is off, and the spine behind them needs something neither gives. */
export const journey = {
  doors: [
    {
      name: "Scan produce",
      state: "off",
      open: false,
      note: "Withheld deliberately on every build in the field. The app says so plainly rather than failing oddly.",
    },
    {
      name: "Add items from a receipt",
      state: "open",
      open: true,
      note: "Works, and since this week it keeps what you put through it. Items land in the inventory marked unverified.",
    },
  ],
  gate: {
    title: "The claim spine needs a scored item, and neither door produces one",
    note: "A receipt item is typed by a person, so it carries no score. Only the scanner makes one, and the scanner is off. That is why everything below is unreached on a phone rather than broken.",
  },
  spine: ["Scored item", "Claim", "Review", "Bounded decision", "Signed record"],
  lanes: [
    { label: "In our offline harness", verdict: "runs end to end, 16 of 16 checks", ok: true },
    { label: "On a phone in the field today", verdict: "not reached", ok: false },
  ],
};

/** What measurably changed for a shopper between two nights. */
export const beforeAfter = [
  {
    when: "Last night, build 2026080405",
    good: false,
    rows: [
      { ok: true, text: "Receipt flow accepts the item" },
      { ok: true, text: "Says Receipt items saved successfully" },
      { ok: false, text: "Inventory shows Total 0. The item is gone." },
    ],
  },
  {
    when: "Tonight, build 2026080601",
    good: true,
    rows: [
      { ok: true, text: "Item is present in the inventory" },
      { ok: true, text: "Marked unverified, which is honest for a typed value" },
      { ok: false, text: "The same receipt sent twice makes two rows" },
    ],
  },
];

export const numbers = [
  { value: "2", label: "of our own components disagree" },
  { value: "3", label: "ways the old check reported clean" },
  { value: "5", label: "builds, scanner off on all of them" },
  { value: "0", label: "scores the shipped app produced on any phone" },
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

/** Finding 02, drawn. Reality on the left, what the check reported on the right. */
export const falseGreens = [
  { reality: "The baseline was from an unnamed commit", reading: "clean" },
  { reality: "The inputs were unsorted, so the comparison was undefined", reading: "clean" },
  { reality: "The two runs came from different environments", reading: "clean" },
];

/** Finding 03, drawn. Three artifacts, one day. */
export const buildTrail = [
  {
    build: "4.3.0 (2026080406)",
    time: "midday",
    role: "Announced in the release note",
    origin: "origin published",
    linked: true,
  },
  {
    build: "4.3.0 (2026080406)",
    time: "afternoon",
    role: "Verified end to end on rented hardware",
    origin: "same artifact as above",
    linked: true,
  },
  {
    build: "4.3.1 (2026080601)",
    time: "evening",
    role: "What my phone actually installed",
    origin: "no published origin, named nowhere",
    linked: false,
  },
];

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
      { k: "Why it matters", v: "The hardware result cannot be cited for the tester reports, or the other way round. They describe different things." },
      { k: "How it surfaced", v: "Checking my own device row against the release note before filing it." },
    ],
    next: "Release owner. Raised before the release record is validated, not after.",
    tone: "warning",
  },
];

export const claimLimit =
  "What none of this lets us claim: anything about model or scanner quality. That gate stays closed, and closed is the correct reading, not a shortfall to explain away.";
