import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "evidence-flow-wireframe",
  title: "Evidence Claim Flow Wireframe",
  owner: "Ziyun",
  issue: 82,
  week: 5,
  order: 82,
  summary:
    "A four-screen UX contract that turns receipt parsing, identity matching, fraud signals, and claim decisions into a clear shopper flow.",
  View,
});
