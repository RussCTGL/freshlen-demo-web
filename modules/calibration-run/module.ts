import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "calibration-run",
  title: "ES Model Run",
  owner: "Yizhou",
  issue: 32,
  week: 3,
  order: 20,
  summary:
    "Every dataset photo scored through the ES freshness proxy, with the raw→canonical scale inversion applied.",
  View,
});
