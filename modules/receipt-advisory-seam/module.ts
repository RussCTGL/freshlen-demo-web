import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "receipt-advisory-seam",
  title: "Week 6 - Receipt Evidence Without Decision Drift",
  owner: "Lezhi",
  issue: 109,
  week: 6,
  order: 109,
  summary:
    "Receipt photos survive safe retries, optional OCR and date-label results remain advisory, raw pixels expire, and the final route stays human review.",
  View,
});
