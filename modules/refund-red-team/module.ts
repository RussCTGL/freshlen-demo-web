import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "refund-red-team", // MUST match the folder name
  title: "My Red-Team Scorecard: 34 Attacks, 1 Honest Gap",
  owner: "Tony",
  issue: 160,
  week: 8,
  order: 160, // matches the closeout issue number
  summary:
    "The visual front door to my Week-8 red-team scorecard (#160). I wrote 34 attacks on the refund flow this closeout; all 34 hold. One class — a real item filmed off a screen — no hash can catch, so it routes to a human (my #207 finding). Shown inside the iOS app, not as a table: the verdict on screen, the full 34-row matrix and taxonomy linked underneath.",
  View,
});
