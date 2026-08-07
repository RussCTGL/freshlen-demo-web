import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "model-evidence-gate",
  title: "Model Evidence Gate",
  owner: "Mohan Li",
  issue: 163,
  week: 8,
  order: 10,
  summary:
    "Nobody could check a model number before quoting it. Now a command does — and it says no.",
  View,
});
