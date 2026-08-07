import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "scan-results-overlay",
  title: "Readable Scan Results",
  owner: "Ziyun",
  issue: 5,
  week: 2,
  order: 20,
  summary:
    "An interactive reconstruction of the Week 2 scan overlay: honest loading, empty and error states, plus consistent green-to-red freshness cues.",
  View,
});
