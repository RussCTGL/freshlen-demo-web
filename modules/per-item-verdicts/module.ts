import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "per-item-verdicts", // MUST match the folder name
  title: "Per-Item Freshness Verdicts",
  owner: "Tony",
  issue: 53,
  week: 4,
  order: 20, // sorts just after Yizhou's detection (#52, order 10) — the natural next step
  summary:
    "Every detected item gets a verdict (shopper word or store action, via a mode toggle), a colour, and an “eat me first” rank — colours come straight from the model's bands, and a real 3-item test guards the order.",
  View,
});
