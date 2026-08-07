import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "native-shopper-claim",
  title: "Native Shopper Claim Journey",
  owner: "Ziyun",
  issue: 159,
  week: 8,
  order: 20,
  summary:
    "An interactive iPhone-scale walkthrough of capture, receipt evidence, claim creation, and the accessible pending/fail-closed boundary on exact TestFlight build 4.3.3.",
  View,
});
