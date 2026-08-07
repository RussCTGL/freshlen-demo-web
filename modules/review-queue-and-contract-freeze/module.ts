import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "review-queue-and-contract-freeze",
  title: "The Reviewer's Queue, and a Frozen Contract",
  owner: "Jinming Cao",
  issue: 105,
  week: 6,
  order: 105,
  summary:
    "A reviewer can finally see what is waiting, and the contract an outside system must honour was frozen with nine self-found holes closed first.",
  View,
});
