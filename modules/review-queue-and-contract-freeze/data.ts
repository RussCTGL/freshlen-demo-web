// Two deliveries in one week: the reviewer's queue, and the contract an outside system must honour.
// Detail behind every line here lives on issues #105, #129 and PRs #131, #148.

export const lead = "Give a reviewer something to look at, and freeze what an outside system has to honour.";

export type Verdict = "works" | "fails" | "by-design" | "mismatch";

export const board: { item: string; verdict: Verdict; label: string }[] = [
  { item: "A reviewer sees the queue for their own store", verdict: "works", label: "Works" },
  { item: "A reviewer sees another store's queue", verdict: "by-design", label: "Refused" },
  { item: "An account can adjust its own spending caps", verdict: "works", label: "Within limits" },
  { item: "Anyone can move the calibration threshold", verdict: "by-design", label: "Refused, always" },
  { item: "The shopper is told what is left of their cap", verdict: "works", label: "Closed from week 3" },
];

export const numbers = [
  { value: "9", label: "real holes found reviewing my own work" },
  { value: "24", label: "contract cases, 20 of them negative" },
  { value: "761", label: "tests passing offline" },
];

export const points = [
  {
    n: "01",
    title: "I attacked my own contract engine before anyone else could",
    matters:
      "Nine real holes, including an authentication bypass, an approval ceiling that was never enforced, and three inputs that crashed the engine outright.",
    cost:
      "None of them was visible from the tests, because the tests and the code had been written from the same understanding and agreed with each other. Only trying to break it on purpose separated the two.",
    tail: "All nine closed, and the case set grew to cover the blind spot that hid them.",
    tone: "danger",
  },
  {
    n: "02",
    title: "The validator does not read the answer written on the test case",
    matters:
      "It works out what should happen from the contract rules, then compares. A test case that lies about itself fails.",
    cost:
      "The alternative is comfortable and worthless. A wrong test case and a wrong engine agree with each other, everything is green, and nobody learns anything until a partner integrates.",
    tail: "Two runs over every case produce identical bytes.",
    tone: "brand",
  },
  {
    n: "03",
    title: "The contract says out loud what it has not built",
    matters:
      "A section lists the parts that are specified but not implemented, including the whole finalisation boundary.",
    cost:
      "An outside team integrating against us learns the limits from the document rather than from an outage. It costs a paragraph now instead of a support thread later.",
    tail: "Written at freeze time, not added after someone asked.",
    tone: "brand",
  },
];

export const claimLimit =
  "What this is not: a running integration. It is the description an outside system has to satisfy, plus the queue our own reviewers use. Nobody has connected to it from outside yet.";
