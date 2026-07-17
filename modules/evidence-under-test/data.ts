// Module-private data for #79 "Evidence, Under Test".
// The journey is the whole claim path (door -> receipt -> fraud -> match); every
// branch maps to a real offline test merged in es-intern-freshlens (#98 core + #100 net).

/** Receipt fruit options for the interactive evidence->message bridge. The photo is
 *  always a banana, so any pick is a mismatch — the outcome never changes (human_review),
 *  which is the point: the safety rule doesn't depend on which fruit. */
/** Real counts from es-intern-freshlens: `pytest -q` is green offline after #98 + #100. */
export const stats = {
  tests: 20, // the #79 slice: 12 core (#98) + 8 fraud-net cases (#100)
  fixtures: { caught: 8, total: 8 }, // uniform_background 4 + blur 4
  fullSuite: { passed: 662, skipped: 4 },
};

export type Fruit = { key: string; emoji: string; label: string };
export const fruits: Fruit[] = [
  { key: "strawberry", emoji: "🍓", label: "strawberry" },
  { key: "apple", emoji: "🍎", label: "apple" },
  { key: "orange", emoji: "🍊", label: "orange" },
  { key: "grapes", emoji: "🍇", label: "grapes" },
];
