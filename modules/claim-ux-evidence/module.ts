import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "claim-ux-evidence",
  title: "Claim UX Evidence + Recovery",
  owner: "Ziyun",
  issue: 159,
  week: 7,
  order: 20,
  summary:
    "Rendered, privacy-clean evidence for the shopper and reviewer claim surfaces: responsive layouts, accessibility, error recovery, guarded decisions, and an honest TestFlight limitation.",
  View,
});
