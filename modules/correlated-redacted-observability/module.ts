import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "correlated-redacted-observability",
  title: "A Flight Recorder for Every Refund Claim",
  owner: "Yunke",
  issue: 161,
  week: 7,
  order: 161,
  summary:
    "Every step a refund claim takes — submitted, scored, decided — is now logged and traceable end to end by one ID, with sensitive fields (tokens, photos, account info) impossible to log by construction, plus a plain-English recovery guide (#161). Also covers this week's fix to which door the freshness model connects through by default (#196).",
  View,
});
