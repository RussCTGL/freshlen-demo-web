import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "closeout-roadmap",
  title: "Closeout Roadmap — What Changed Because This Lane Existed",
  owner: "Yizhou",
  issue: 162,
  week: 8,
  order: 162,
  summary:
    "Four checkable claims: release truth stopped being prose (two runs, one hash, 96b8868); other lanes plug into its frozen contract (#237); an honest 'no' shipped (3 V / 5 B / 11 I); reviews now reproduce numbers. Handoff owners named.",
  View,
});
