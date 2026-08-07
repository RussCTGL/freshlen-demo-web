import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "recipe-approval-seal",
  title: "Once Approved, a Recipe Can't Quietly Change",
  owner: "Lisa",
  issue: 157,
  week: 7,
  order: 157,
  summary:
    "An approved recipe is locked to its exact wording — edit it after the fact, and it stops being shown rather than serve content nobody actually reviewed.",
  View,
});
