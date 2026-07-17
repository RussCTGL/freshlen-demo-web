import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "identity-evidence-eval",
  title: "Item-Identity Evidence Eval",
  owner: "Yizhou",
  issue: 81,
  week: 5,
  order: 10,
  summary:
    "matches_receipt_item graded by confidence band on 236 rows — every answer withheld at the 0.50 floor, and the sub-floor diagnostics say what to fix first.",
  View,
});
