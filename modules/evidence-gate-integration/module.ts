import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "evidence-gate-integration",
  title: "Evidence Gate — Wired Into Claim Evaluation",
  owner: "Jinming Cao",
  issue: 78,
  week: 5,
  order: 78,
  summary:
    "Wires #77's receipt parsing, #76's fraud signals + item-identity match, and #80's evidence_payload() into evaluate_claim - a failed gate routes straight to human_review, bypassing adjudicate() entirely.",
  View,
});
