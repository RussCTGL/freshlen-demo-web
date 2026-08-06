// Week 8 is a freeze week. Nothing new ships; the work is deciding what we can stand behind.
// Detail behind every line here lives on issues #164, #177, #226 and PRs #210, #212.

export const lead = "Separate what we verified from what we announced.";

export type Verdict = "works" | "fails" | "by-design" | "mismatch";

/** The board a reader should be able to take in without reading a sentence. */
export const board: { item: string; verdict: Verdict; label: string }[] = [
  { item: "A shopper can save a receipt item and find it again", verdict: "works", label: "Works" },
  { item: "Submitting the same receipt twice gets merged", verdict: "fails", label: "Announced, does not" },
  { item: "Produce scanning on device", verdict: "by-design", label: "Withheld on purpose" },
  { item: "The build we verified is the build testers have", verdict: "mismatch", label: "No" },
  { item: "The full claim journey, run offline end to end", verdict: "works", label: "All 16 steps" },
];

export const findings = [
  {
    n: "01",
    title: "Two parts of our own system disagree about the same photo",
    matters:
      "One drops the field and lets the claim through. The other rejects the claim outright. Same bytes.",
    cost:
      "The day the iOS app starts attaching a photo-quality field, every claim from that version fails against a partner who implemented our contract. Nothing has to be built first. A client only has to send it.",
    next: "Needs an owner for the mapping. Architecture decision, not a bug fix.",
    tone: "danger",
  },
  {
    n: "02",
    title: "The check behind every no regressions claim could pass while broken",
    matters:
      "Three separate conditions made it report clean when it had no idea. It was the evidence under my reviews all week.",
    cost:
      "A gate that says fine when it is broken is worse than no gate. Nobody looks twice at a green light.",
    next: "Replaced. The new one starts at refused and has to prove it looked at the right thing.",
    tone: "warning",
  },
  {
    n: "03",
    title: "The build we verified on hardware is not the build testers installed",
    matters:
      "Three different artifacts were in play on the same day, and only one of them has a published origin.",
    cost:
      "Hardware verification and tester reports end up describing different things, so neither can be cited for the other.",
    next: "Release owner. Flagged before the release manifest gets validated, not after.",
    tone: "warning",
  },
];

export const numbers = [
  { value: "2", label: "shipped paths that disagree" },
  { value: "3", label: "ways the old check reported clean" },
  { value: "5", label: "builds, scanner withheld on all" },
];

export const claimLimit =
  "What none of this lets us claim: anything about model or scanner quality. The scanner is switched off on every build in the field, so no score has been produced on a phone this week.";
