// Week 8 is a freeze week. Nothing new ships; the work is deciding what we can stand behind.
// Detail behind every line here lives on issues #164, #177, #226 and PRs #210, #212.
//
// House rule for this file: nothing longer than one short line. If a point needs a
// paragraph it is the wrong point, or it belongs in a diagram.

export const lead = "Separate what we verified from what we announced.";

export type Verdict = "works" | "fails" | "by-design" | "mismatch";

/** The board a reader should be able to take in without reading a sentence. */
export const board: { item: string; verdict: Verdict; label: string }[] = [
  { item: "Add items from a receipt, find them later", verdict: "works", label: "Fixed this week" },
  { item: "Same receipt twice gets merged", verdict: "fails", label: "Announced, does not" },
  { item: "Produce scanning on a phone", verdict: "by-design", label: "Off on purpose" },
  { item: "File a claim from a phone", verdict: "by-design", label: "Nothing to file yet" },
  { item: "Verified build is the installed build", verdict: "mismatch", label: "No" },
  { item: "Full claim journey, offline", verdict: "works", label: "16 of 16" },
];

export const numbers = [
  { value: "2", label: "of our components disagree" },
  { value: "3", label: "ways the old check faked green" },
  { value: "5", label: "builds, scanner off on all" },
  { value: "0", label: "scores the shipped app made on a phone" },
];

/** Two ways in. One is open, one is off, and the spine behind them needs something neither gives. */
export const journey = {
  doors: [
    {
      name: "Scan produce",
      state: "off",
      open: false,
      note: ["Off on every field build.", "The app says so plainly."],
    },
    {
      name: "Add from a receipt",
      state: "open",
      open: true,
      note: ["Works — and since this week", "it keeps what you enter."],
    },
  ],
  gate: {
    title: "The spine needs a scored item. Neither door makes one.",
    note: "A typed item carries no score; only the scanner makes one, and it is off.",
  },
  spine: ["Scored item", "Claim", "Review", "Decision", "Signed record"],
  lanes: [
    { label: "In our offline harness", verdict: "16 of 16 steps", ok: true },
    { label: "On a phone in the field", verdict: "not reached", ok: false },
  ],
};

/** What measurably changed for a shopper between two nights. */
export const beforeAfter = [
  {
    when: "Last night · build 2026080405",
    good: false,
    /** What the inventory screen showed after submitting one receipt. */
    screen: { total: "Total 0", items: [] as { name: string; tag: string; dup?: boolean }[] },
    rows: [
      { ok: true, text: "Receipt flow accepts the item" },
      { ok: true, text: "Says saved successfully" },
      { ok: false, text: "Inventory total 0 — the item is gone" },
    ],
  },
  {
    when: "Tonight · build 2026080601",
    good: true,
    /** Same flow, plus one resubmission of the same receipt. */
    screen: {
      total: "Total 2",
      items: [
        { name: "Banana", tag: "unverified" },
        { name: "Banana", tag: "unverified", dup: true },
      ],
    },
    rows: [
      { ok: true, text: "Item is there in the inventory" },
      { ok: true, text: "Marked unverified — honest for typed input" },
      { ok: false, text: "Same receipt twice still makes two rows" },
    ],
  },
];

/** The verdict board as a three-column dot plot: every capability sits in exactly one column. */
export const boardColumns = [
  { key: "works", label: "Works", tone: "good" as const },
  { key: "announced", label: "Not as announced", tone: "bad" as const },
  { key: "off", label: "Off on purpose", tone: "off" as const },
];

/** Everything that landed on main this week. One line each, no exceptions. */
export const shipped = [
  { what: "A standalone contract validator", tag: "tested on poisoned input" },
  { what: "The adapter handoff pack", tag: "4 artifacts, blockers named" },
  { what: "Dependency failures mapped to contract states", tag: "2 wrong states corrected" },
  { what: "Where a photo-quality check belongs", tag: "design note · surfaced 01" },
  { what: "A suite-delta checker that refuses by default", tag: "replaces the check in 02" },
];

/** Filed as issues rather than fixed by me, because they were not my lane. */
export const filed = [
  { what: "A dev key could forge a repudiation of a signed record", landed: "Owning lane fixed it, I re-verified", state: "closed" as const },
  { what: "A size-limit safety test had never run on Windows", landed: "Owning lane fixed it next day", state: "closed" as const },
  { what: "Line endings fake a gate failure on a Windows clone", landed: "Partly fixed · nobody owns it after the internship", state: "open" as const },
  { what: "A test asserted the photo campaign had not happened, so no capture could land", landed: "Owning lane opened the fix the same night", state: "closed" as const },
];

/** The one PR I opened and closed myself, as three steps rather than a paragraph. */
export const discipline = {
  title: "One pull request I opened and then closed myself",
  steps: [
    { k: "Found", v: "A one-line fix — in someone else's lane" },
    { k: "Chose", v: "Closed it, refiled with the measurement" },
    { k: "Result", v: "Their lane shipped it next day" },
  ],
  stat: { value: "10", label: "reviews given — the same trade, reversed" },
};

/** Finding 01, drawn rather than described. */
export const divergence = {
  input: "one photo, with a quality field attached",
  paths: [
    { side: "How we handle it", outcome: "Claim goes through", how: "Unknown field dropped, claim continues.", bad: false },
    { side: "What our contract says", outcome: "Claim rejected", how: "Same field is invalid. Every claim fails.", bad: true },
  ],
};

/** Finding 02, drawn. Reality on the left, what the check reported on the right. */
export const falseGreens = [
  { reality: "Baseline came from an unnamed commit", reading: "clean" },
  { reality: "Inputs unsorted — the comparison was undefined", reading: "clean" },
  { reality: "The two runs came from different environments", reading: "clean" },
];

/** Finding 03, drawn. Three artifacts, one day. */
export const buildTrail = [
  { build: "4.3.0 (2026080406)", time: "midday", role: "Announced in the release note", origin: "origin published", linked: true },
  { build: "4.3.0 (2026080406)", time: "afternoon", role: "Verified end to end on hardware", origin: "same artifact as above", linked: true },
  { build: "4.3.1 (2026080601)", time: "evening", role: "What my phone actually installed", origin: "no published origin", linked: false },
];

export const findings = [
  {
    n: "01",
    icon: "split",
    title: "Two parts of our own system disagree about the same photo",
    impact: "Every claim from that app version, to any partner on our contract",
    next: "Needs an owner for the mapping — an architecture call, not a fix",
    tone: "danger",
    open: true,
  },
  {
    n: "02",
    icon: "gauge",
    title: "The check behind every no-regressions claim could pass while broken",
    impact: "It was the evidence under every review I gave this week",
    next: "Closed — replacement ships with its own failure fixtures",
    tone: "warning",
    open: false,
  },
  {
    n: "03",
    icon: "tags",
    title: "The build we verified on hardware is not the build testers installed",
    impact: "Neither result can be cited for the other",
    next: "Release owner — raised before the record is validated, not after",
    tone: "warning",
    open: true,
  },
];

export const claimLimit =
  "None of this says anything about model or scanner quality. That gate stays closed — and closed is the correct reading, not a shortfall.";
