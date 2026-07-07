import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "multi-item-detection",
  title: "Multi-Item Detection",
  owner: "Yizhou",
  issue: 52,
  week: 4,
  order: 10,
  summary:
    "Real YOLO detection: one basket photo → 4 labeled produce boxes, with people and low-confidence boxes filtered out.",
  View,
});
