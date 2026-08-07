import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "signed-binding-evidence",
  title: "Signed Binding & Replay Defense",
  owner: "Lisa",
  issue: 157,
  week: 8,
  order: 157,
  summary:
    "One purchase, one receipt, one decision — try to reuse, duplicate, or swap a claim live.",
  View,
});
