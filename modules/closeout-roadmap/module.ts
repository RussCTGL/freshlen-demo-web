import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "closeout-roadmap",
  title: "Closeout Roadmap — Shipped, In Freeze Review, Handed Off",
  owner: "Yizhou",
  issue: 162,
  week: 8,
  order: 162,
  summary:
    "The final week (Aug 3–7) as a three-lane roadmap: the merged gate orchestrator (#202 → 96b8868) and its 10 VERIFIED / 1 BLOCKED evidence packet; the first candidate-mode-VALID release manifest waiting in freeze review (#237); and every remaining item handed off with a named owner — including what stays deliberately not-live.",
  View,
});
