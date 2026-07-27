import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "claim-review-flow",
  title: "Shopper Claim + Human Review UI",
  owner: "Ziyun",
  issue: 137,
  week: 6,
  order: 30,
  summary:
    "The Week 6 shopper claim wizard and internal reviewer/policy surface: item + receipt evidence routes to human_review, not automatic payout.",
  View,
});
