// #157 — recipe approval digests fail closed after content edits. Told through
// one real recipe suggestion, audience-facing (no digests, no hashes, no code).

export type Tone = "success" | "danger" | "warning" | "neutral";

export const takeaway =
  "Approval locks the exact wording, not just the recipe. Change the words, and the seal breaks.";

export const scenario = {
  title: "Overripe Banana Oat Muffins",
  context: "Suggested when a shopper's bananas are about to spoil.",
};

export const originalStep = "Mash 3 overripe bananas, mix with oats, honey, and cinnamon.";
export const editedStep = "Mash 3 overripe bananas, mix with oats, sugar, and nutmeg.";

export type CaseAction = {
  id: string;
  label: string; // button label
  workingLabel: string;
  resultTitle: string;
  resultBody: string;
  tone: Tone;
  showsRecipe: boolean; // whether the result includes the recipe text
  stepText?: string;
};

export const caseActions: CaseAction[] = [
  {
    id: "approved",
    label: "Show the approved recipe",
    workingLabel: "Checking approval…",
    resultTitle: "Shown to shopper",
    resultBody: "Matches exactly what staff approved.",
    tone: "success",
    showsRecipe: true,
    stepText: originalStep,
  },
  {
    id: "edited",
    label: "Edit it, then try again",
    workingLabel: "Checking approval…",
    resultTitle: "Blocked",
    resultBody: "This no longer matches what was approved.",
    tone: "danger",
    showsRecipe: true,
    stepText: editedStep,
  },
  {
    id: "unapproved",
    label: "Try a recipe nobody reviewed yet",
    workingLabel: "Checking approval…",
    resultTitle: "Not shown",
    resultBody: "Never approved by staff.",
    tone: "warning",
    showsRecipe: false,
  },
];
