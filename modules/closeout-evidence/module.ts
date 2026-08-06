import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "closeout-evidence",
  title: "Closeout — Divergence, a Checker That Refuses, Device Truth",
  owner: "Jinming Cao",
  issue: 164,
  week: 8,
  order: 164,
  summary:
    "Final week, no new features: two shipped implementations that disagree on identical bytes (#177), a suite-delta checker that starts REFUTED because the manual version printed clean while broken (#164), and device rows that separate what was fixed from what was only announced.",
  View,
});
