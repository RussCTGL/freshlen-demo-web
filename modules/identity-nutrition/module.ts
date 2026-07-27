import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "identity-nutrition",
  title: "Identity & Nutrition Advisory",
  owner: "Lisa",
  issue: 108,
  week: 6,
  order: 20, // right after Mohan's #110 (order 10) — the two Week 6 modules so far
  summary:
    "Five deterministic identity states that never overclaim a match, an explicit fail-closed uncertainty guarantee, and a capability-gated nutrition reference that stays a boundary, not a claim.",
  View,
});
