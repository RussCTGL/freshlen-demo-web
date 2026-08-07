import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "freshness-scorecard",
  title: "Freshness Scorecard — the First Quality Gate",
  owner: "Yizhou",
  issue: 8,
  week: 2,
  order: 8,
  summary:
    "Week 2: a scorecard + CI regression floor for the freshness scorer (PR #14, integrated via #26). Re-run live Aug 7: pass-rate 0.80 exactly at floor, direction gate PASS, one documented monotonicity inversion.",
  View,
});
