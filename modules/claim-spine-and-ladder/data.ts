// First working version of the claim loop.
// Detail behind every line here lives on issues #30, #35 and PRs #46, #50.

export const lead =
  "Get one claim all the way through, and make auto-approval impossible to switch on by accident.";

export type Verdict = "works" | "fails" | "by-design" | "mismatch";

export const board: { item: string; verdict: Verdict; label: string }[] = [
  { item: "A shopper can file a claim and get a decision", verdict: "works", label: "Works" },
  { item: "A claim can be auto-approved", verdict: "by-design", label: "Off, unreachably" },
  { item: "Two requests at once can overspend one cap", verdict: "works", label: "Closed before merge" },
  { item: "The shopper is told what is left of their cap", verdict: "fails", label: "Not yet" },
];

export const numbers = [
  { value: "4", label: "routes, filing to decision" },
  { value: "2", label: "money bugs caught in my own diff" },
  { value: "552", label: "tests passing offline" },
];

/** The model is step five. That ordering is the whole safety argument. */
export const pipeline = [
  { name: "Spending cap", model: false },
  { name: "Duplicate photo", model: false },
  { name: "Duplicate purchase", model: false },
  { name: "Capture checks", model: false },
  { name: "Model call", model: true },
  { name: "Decision", model: false },
];

export const ladder = [
  {
    band: "01",
    condition: "No confidence score available",
    outcome: "human review",
    state: "plain" as const,
  },
  {
    band: "02",
    condition: "Calibration not signed off",
    outcome: "fires on every claim",
    state: "fires" as const,
  },
  {
    band: "03",
    condition: "Clear defect, small amount, within cap",
    outcome: "auto approve",
    state: "dead" as const,
  },
  {
    band: "04",
    condition: "Anything else",
    outcome: "human review",
    state: "plain" as const,
  },
];

export const decisions = [
  {
    n: "01",
    icon: "off",
    title: "Auto-approval is switched off by arithmetic, not by a flag",
    lines: [
      { k: "The mechanism", v: "The threshold ships at 2.0 on a scale that only reaches 1.0. No value satisfies it." },
      { k: "Why not a flag", v: "A flag gets flipped by whoever is in a hurry. A number that cannot be reached does not." },
      { k: "Turning it on later", v: "Means changing that number, which has to pass its own review with calibration behind it." },
    ],
    tail: "Still the state today, five weeks later.",
    tone: "brand",
  },
  {
    n: "02",
    icon: "cross",
    title: "Two shoppers spending at the same moment could both pass the cap",
    lines: [
      { k: "The bug", v: "Both requests read the remaining balance before either had written a decision, so both saw room." },
      { k: "What it costs", v: "Real money, and only under load, which is to say only in production." },
      { k: "How it was found", v: "Running the guardrail checklist over my own diff before opening the pull request. No existing test caught it." },
    ],
    tail: "Fixed in the same PR and proved with a multi-threaded test.",
    tone: "danger",
  },
  {
    n: "03",
    icon: "check",
    title: "Everything cheap decides before anything expensive runs",
    lines: [
      { k: "The rule", v: "Cap, duplicate photo, duplicate purchase and capture checks all resolve before the model is called." },
      { k: "What it buys", v: "The model only ever sees requests that survived the deterministic checks, and a model outage cannot open the gate." },
      { k: "Where it went", v: "Became the ordering every later week was built on." },
    ],
    tail: "Written down as a rule, not left as an accident of the code.",
    tone: "brand",
  },
];

export const claimLimit =
  "What this version did not do: decide anything on its own. Every claim routes to a person, on purpose, because the calibration that would justify anything else did not exist yet.";
