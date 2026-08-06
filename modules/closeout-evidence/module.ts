import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "closeout-evidence",
  title: "Closeout — What We Can Stand Behind",
  owner: "Jinming Cao",
  issue: 164,
  week: 8,
  order: 164,
  summary:
    "Freeze week, nothing new ships. Where the product actually stands, and the three things that need someone else: two of our own components disagree about the same photo, the check behind every no-regressions claim could pass while broken, and the build we verified is not the build testers installed.",
  View,
});
