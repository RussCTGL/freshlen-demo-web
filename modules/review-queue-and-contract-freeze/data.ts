// Two deliveries in one week: the reviewer's queue, and the contract an outside system must honour.
// Detail behind every line here lives on issues #105, #129 and PRs #131, #148.

export const lead =
  "Give a reviewer something to look at, and freeze what an outside system has to honour.";

export type Verdict = "works" | "fails" | "pending" | "by-design" | "mismatch";

export const board: { item: string; verdict: Verdict; label: string }[] = [
  { item: "A reviewer sees the queue for their own store", verdict: "works", label: "Works" },
  { item: "An account can adjust its own spending caps", verdict: "works", label: "Within limits" },
  { item: "The shopper is told what is left of their cap", verdict: "works", label: "Closed from week 3" },
  { item: "Anyone can move the calibration threshold", verdict: "by-design", label: "Refused, always" },
  { item: "An outside system has actually integrated", verdict: "pending", label: "Not yet" },
];

export const numbers = [
  { value: "9", label: "real holes found attacking my own work" },
  { value: "3", label: "separate authorities, no shared credential" },
  { value: "761", label: "tests passing offline" },
];

/** Every deny below is an exercised refusal, not a convention. */
export const matrix = {
  roles: ["Shopper", "Store reviewer", "Policy admin"],
  rows: [
    { action: "See their store's review queue", cells: ["no", "yes", "no"] },
    { action: "Record approve or decline", cells: ["no", "yes", "no"] },
    { action: "Read and change spending caps", cells: ["no", "no", "yes"] },
    { action: "See another store's queue", cells: ["no", "no", "no"] },
    { action: "Move the calibration threshold", cells: ["never", "never", "never"] },
  ] as { action: string; cells: ("yes" | "no" | "never")[] }[],
};

export const cases = {
  valid: 4,
  invalid: 20,
  note:
    "Five in six cases are refusals. That is the point — refusals are what an outside team gets wrong.",
};

export const points = [
  {
    n: "01",
    icon: "warn",
    title: "I attacked my own contract engine before anyone else could",
    lines: [
      { k: "What was in there", v: "An auth bypass, an unenforced approval ceiling, three crashing inputs, and four more." },
      { k: "Why the tests missed it", v: "Tests and code came from the same understanding. Agreement is not correctness." },
      { k: "What changed", v: "All nine closed, two new error codes, and the case set grew to cover the blind spot." },
    ],
    tail: "Nine found before review, zero found during it.",
    tone: "danger",
  },
  {
    n: "02",
    icon: "check",
    title: "The validator does not read the answer written on the test case",
    lines: [
      { k: "How it works", v: "It derives the expected answer from the rules. A case that lies about itself fails." },
      { k: "The alternative", v: "A wrong case and a wrong engine agree — green until a partner integrates." },
      { k: "Stability", v: "Two runs, identical bytes. A difference means a real change." },
    ],
    tail: "Same discipline reused in every later week.",
    tone: "brand",
  },
  {
    n: "03",
    icon: "off",
    title: "The contract says out loud what it has not built",
    lines: [
      { k: "What it admits", v: "A section listing what is specified but unbuilt, including the finalisation boundary." },
      { k: "Why write it down", v: "An outside team learns the limits from the document, not from an outage." },
      { k: "When", v: "At freeze time, not after an awkward question." },
    ],
    tail: "Costs a paragraph now instead of a support thread later.",
    tone: "brand",
  },
];

export const claimLimit =
  "What this is not: a running integration. Nobody has connected from outside yet.";
