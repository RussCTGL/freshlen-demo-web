import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "calibration-report",
  title: "Calibration Gate — First Run & the 3-Metric Framework",
  owner: "Yunke",
  issue: 33,
  week: 3,
  order: 30,
  summary:
    "Rebuilt the gate script to the official 3-metric spec, ran it on the real 154-photo dataset, and reached the program's first RE-SCOPE verdict — catching two review bugs along the way.",
  View,
});
