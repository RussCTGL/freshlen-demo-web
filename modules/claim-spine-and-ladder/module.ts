import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "claim-spine-and-ladder",
  title: "First Working Claim Loop",
  owner: "Jinming Cao",
  issue: 35,
  week: 3,
  order: 35,
  summary:
    "The first claim that goes all the way through, with auto-approval switched off by arithmetic rather than by a flag.",
  View,
});
