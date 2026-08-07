import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "recorder-and-safe-door",
  title: "The Recorder, and the Safe Door It Talks Through",
  owner: "Yunke",
  issue: 161,
  week: 8,
  order: 161,
  summary:
    "Week 8 recap: the flight-recorder / recovery-guide work on refund claims (#161), plus this week's fix to which door the freshness model connects through by default (#196).",
  View,
});
