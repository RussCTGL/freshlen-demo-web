import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "capability-provenance",
  title: "Capability Provenance & the Account-Scoped Claims Report",
  owner: "Yunke",
  issue: 104,
  week: 6,
  order: 104,
  summary:
    "A redacted, zero-network capability doctor for the ES proxy (#104), and the deterministic one-row-per-claim account report it hands a real model_version to once #104 is wired in (#111).",
  View,
});
