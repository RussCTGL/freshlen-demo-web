import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "calibration-dataset",
  title: "Calibration Dataset",
  owner: "Yizhou",
  issue: 29,
  week: 3,
  order: 10,
  summary:
    "154 labeled real-world produce photos across 9 types — the ground truth the calibration gate runs on.",
  View,
});
