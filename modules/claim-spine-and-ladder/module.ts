import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "claim-spine-and-ladder",
  title: "Claim Spine + Adjudication Ladder",
  owner: "Jinming Cao",
  issue: 35,
  week: 3,
  order: 35,
  summary:
    "The walking skeleton for Snap-to-Claim (#35) on top of the four-band adjudication ladder (#30): four routes, the model call forced last, and auto-approve disabled by unreachable math rather than a flag.",
  View,
});
