import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "signed-binding-evidence",
  title: "Signed Binding & Replay Defense",
  owner: "Lisa",
  issue: 157,
  week: 7,
  order: 157,
  summary:
    "Signed decisions stay bound to their original evidence, reject tampering and replay, and reconcile against the expected anchor.",
  View,
});
