import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "auto-approve-band",
  title: "Auto-Approve Band Fix",
  owner: "Jinming Cao",
  issue: 54,
  week: 4,
  order: 30,
  summary:
    "Three real bugs in src/policy.py's auto-approve eligibility check - a 70/71 category mismatch, a >=1.0 confidence-floor bypass, and untested boundaries - fixed before the gate can ever be flipped on.",
  View,
});
