import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "evidence-quality",
  title: "Evidence Quality — the Identity & Fraud Gold Set",
  owner: "Mohan Li",
  issue: 85,
  week: 5,
  order: 10,
  summary:
    "82 labeled cases that make \u201cis the evidence trustworthy?\u201d measurable — receipt-vs-photo identity and five fraud signals.",
  View,
});
