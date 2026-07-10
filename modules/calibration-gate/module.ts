import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "calibration-gate",
  title: "Calibration Gate — Re-run on Upgraded Model",
  owner: "Yunke",
  issue: 55,
  week: 4,
  order: 10,
  summary:
    "Re-ran the 154-photo gold set through the upgraded ES proxy: still RE-SCOPE — the spoiled/waste gap is unchanged, and fresh-side accuracy regressed sharply.",
  View,
});
