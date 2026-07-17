import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "evidence-under-test",
  title: "Evidence, Under Test",
  owner: "Tony",
  issue: 79,
  week: 5,
  order: 79,
  summary:
    "The trust layer: 20 offline test cases lock every branch of the evidence gate, an 8/8 fraud regression net over the #85 gold set, and the honest line between what pixels catch and what the capture layer must.",
  View,
});
