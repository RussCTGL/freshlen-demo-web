import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "audit-history-story",
  title: "Week 3 - A History That Reveals Changes",
  owner: "Lezhi",
  issue: 31,
  week: 3,
  order: 31,
  summary:
    "A plain-language replay of the claim audit chain: each action links to the one before it, private data stays out, and the first changed event is exposed.",
  View,
});
