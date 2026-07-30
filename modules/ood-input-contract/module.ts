import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "ood-input-contract",
  title: "OOD Input Contract & Exact-Hash Evidence",
  owner: "Mohan Li",
  issue: 163,
  week: 7,
  order: 10,
  summary:
    "A frozen out-of-distribution benchmark contract whose validator is red on purpose \u2014 six categories synthesized from a seed, five left empty because they cannot be built honestly, and every input bound to exact bytes.",
  View,
});
