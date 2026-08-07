// First working version of the claim loop.
// Detail behind every line here lives on issues #30, #35 and PRs #46, #50.

export const lead = "Get one claim all the way through, and make auto-approval impossible to switch on by accident.";

export type Verdict = "works" | "fails" | "by-design" | "mismatch";

export const board: { item: string; verdict: Verdict; label: string }[] = [
  { item: "A shopper can file a claim and get a decision", verdict: "works", label: "Works" },
  { item: "A claim can be auto-approved", verdict: "by-design", label: "Off, unreachably" },
  { item: "Two requests at once can overspend one cap", verdict: "works", label: "Closed before merge" },
  { item: "The shopper is told what is left of their cap", verdict: "fails", label: "Not yet" },
];

export const numbers = [
  { value: "4", label: "routes, create to decision" },
  { value: "2", label: "money bugs caught reviewing my own diff" },
  { value: "552", label: "tests passing offline" },
];

export const decisions = [
  {
    n: "01",
    title: "Auto-approval is switched off by arithmetic, not by a flag",
    matters:
      "The threshold ships at 2.0 on a scale that only goes to 1.0. There is no value that satisfies it.",
    cost:
      "A flag gets flipped by whoever is in a hurry. This cannot be, and turning it on later means changing a number that has to pass its own review. The safety property survives people who have never read this code.",
    tail: "Still the state today, five weeks later.",
    tone: "brand",
  },
  {
    n: "02",
    title: "Two shoppers spending at the same moment could both pass the cap",
    matters:
      "Both requests read the remaining balance before either had written a decision, so both saw room.",
    cost:
      "Real money, and the kind of bug that only appears under load, which is to say in production. Found by running the guardrail checklist over my own diff before opening the pull request, not by a test that already existed.",
    tail: "Fixed in the same PR, proved with a multi-threaded test.",
    tone: "danger",
  },
  {
    n: "03",
    title: "The model is the fifth thing that runs, never the first",
    matters:
      "Cap, duplicate photo, duplicate purchase, and capture checks all decide before the expensive call happens.",
    cost:
      "The cheap deterministic checks reject what they can, so the model only ever sees requests that survived them. It also means an outage of the model cannot open the gate, because the gate was never the model.",
    tail: "This ordering became the rule the later weeks were built on.",
    tone: "brand",
  },
];

export const claimLimit =
  "What this did not do: decide anything. Every claim in this version routes to a human, on purpose, because the calibration to justify anything else did not exist yet.";
