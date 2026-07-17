import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "evidence-payload",
  title: "Redacted Evidence, Typed",
  owner: "Yunke",
  issue: 80,
  week: 5,
  order: 80,
  summary:
    "A typed evidence_payload() constructor closes the naming-drift gap between fraud/identity/receipt gates and the audit hash chain - now wired live into evaluate_claim.",
  View,
});
