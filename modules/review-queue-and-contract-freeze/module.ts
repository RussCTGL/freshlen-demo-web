import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "review-queue-and-contract-freeze",
  title: "Review Queue, Policy Guardrails, Frozen Host Contract",
  owner: "Jinming Cao",
  issue: 105,
  week: 6,
  order: 105,
  summary:
    "Two deliveries: the owner-scoped review queue and guarded policy config (#105), and ES Claim Host Contract v1 frozen from eight owners' fields into one schema, guide, and independently re-derived validator (#129).",
  View,
});
