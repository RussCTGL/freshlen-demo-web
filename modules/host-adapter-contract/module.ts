import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "host-adapter-contract",
  title: "Host Adapter — Frozen Contract, Server-Derived Authority",
  owner: "Jinming Cao",
  issue: 158,
  week: 7,
  order: 158,
  summary:
    "The contract a host application implements to talk to FreshLens: 8 operations across 4 roles with authority derived server-side, a 6-state claim machine where human_review is a success outcome, and a closed 21-code error set. Includes the honest critical path for the recipe track (#86-88), where the engine is finished and the blocker is a human sign-off.",
  View,
});
