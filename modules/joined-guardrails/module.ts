import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "joined-guardrails", // MUST match the folder name
  title: "Joined Guardrails: Try to Break the Claim Loop",
  owner: "Tony",
  issue: 112,
  week: 6,
  order: 20,
  summary:
    "Play the safety rules. Try the risky move — peek at another shopper's claim, double-tap submit, race two reviewers, kill the model mid-check — and watch the joined claim loop refuse to break. Every safe outcome links to the exact offline test (of 43) that proves it. No network, no fakes.",
  View,
});
