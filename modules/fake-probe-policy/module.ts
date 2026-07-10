import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "fake-probe-policy",
  title: "Fake Probe — Real Policy Band",
  owner: "Lisa",
  issue: 56,
  week: 4,
  order: 40,
  summary:
    "Aligned the fake-detection probe with the shared policy predicate so its reported fake-risk matches the real auto-approval logic.",
  View,
});
