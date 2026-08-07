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
    "Four checkable impact claims, each before → after: release truth stopped being prose (one deterministic orchestrator, byte-identical runs at 96b8868); other lanes plugged into its frozen contract (the first candidate-mode-VALID manifest, #237); an honest 'no' became shippable (3 V / 5 B / 11 I, every gap owned); and default-REFUTED review propagated across the team. Plus the handoff, owner by owner.",
  View,
});
