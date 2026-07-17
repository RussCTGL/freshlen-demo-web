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
    "The identity matcher on 236 real calls: 100% precision, zero fraud passed, recall 48% with the biggest miss a fixable string bug — and what to do before Week 6.",
  View,
});
