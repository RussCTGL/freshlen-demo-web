import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "tap-to-verify", // MUST match the folder name
  title: "Tap-to-Verify: One Deep Check on the Item That Matters",
  owner: ["Yizhou", "Tony"], // pair/stretch — appears under both owners
  issue: 61,
  week: 4,
  order: 25, // right after Tony's #53 (order 20): the same scanner flow, one beat later
  summary:
    "Tap the worst-ranked item and the real ES model deep-checks just that crop — one quota-safe call, the verdict shown next to the fast estimate, and an honest “deep check unavailable” state when the model can't be reached.",
  View,
});
