// Every number here came from a command that was run.

export const gate = {
  total: 13,
  passed: 11,
  exitCode: 1,
  blockers: [
    { plain: "Nobody signed the quality bar", who: "Lawrence" },
    { plain: "No approved minimum, so support can't be judged", who: "Lawrence" },
  ],
};

// The 13 checks, in the order the command runs them.
export const checks = [
  "The bundle exists",
  "It can be read",
  "Its version is supported",
  "Every required field is declared",
  "It names the commit being checked",
  "3 model files match their exact bytes",
  "3 model files carry a model card",
  "3 datasets match their exact bytes",
  "No dataset is named train",
  "A dated approval exists",
  "Every category has enough photos",
  "No training data leaked into the test set",
  "Every gate I own has evidence",
];

export const gates = [
  { name: "freshness_cv", why: "No signed decision. No held-out set." },
  { name: "ood_and_detector", why: "5 of 11 categories have no photos." },
  { name: "recipe_serving", why: "0 of 10 recipes approved to serve." },
  { name: "authorized_evidence_data", why: "Photos missing on most machines." },
];

export const cards = {
  total: 5,
  blocked: 3,
  lines: [
    "The freshness model has no version we can pin.",
    "The item detector has no weights we can pin.",
    "The out-of-distribution screen does not exist.",
  ],
};

export const guard = {
  checks: 13,
  status: "INCONCLUSIVE",
  line: "A test bundle passes all 13. Still not verified.",
};

export const falseGreen = {
  gates: 4,
  line: "One signature would have turned all four green at once.",
  detail: "Including recipes, where nothing is approved to serve.",
  fixed: "Fixed, with a test.",
};
