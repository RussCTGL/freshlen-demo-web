import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "item-identity-fraud-signals",
  title: "Item Identity + Fraud Signals",
  owner: "Lisa",
  issue: 76,
  week: 5,
  order: 76,
  summary:
    "Verifies whether a submitted photo matches the receipt item and surfaces advisory photo-risk signals.",
  View,
});
