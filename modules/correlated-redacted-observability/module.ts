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
    "Every step a refund claim takes — submitted, scored, decided — is now logged and traceable end to end by one ID, with sensitive fields (tokens, photos, account info) impossible to log by construction. Plus a plain-English recovery guide for when something breaks.",
  View,
});
