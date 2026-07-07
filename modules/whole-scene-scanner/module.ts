import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "whole-scene-scanner",
  title: "Whole-Scene Scanner UI",
  owner: "Ziyun",
  issue: 58,
  week: 4,
  order: 58,
  summary:
    "Shopper-facing demo: upload a shelf photo, compare single-item vs whole-scene scan, and show per-item verdicts.",
  View,
});
