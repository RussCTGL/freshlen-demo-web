import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "claim-flow-wireframe",
  title: "Claim Flow Wireframe v0",
  owner: "Ziyun",
  issue: 37,
  week: 3,
  order: 80,
  summary:
    "The four-screen shopper claim contract that fixed advisory language, recovery paths, receipt evidence, and human-review outcomes before implementation.",
  View,
});
