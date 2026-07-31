import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "refund-safety", // MUST match the folder name
  title: "The Refund That Cannot Be Doubled: One Prevented Exploit + One Honest Limit",
  owner: "Tony",
  issue: 160,
  week: 7,
  order: 160, // matches the issue number, like #158/#162 in this week
  summary:
    "Walk one refund end to end: a reviewer approves, an attacker replays it for more and is refused (one decision only), a stalled anchor recovers instead of corrupting, and one honest limit — live claim state is in-memory, not durable multi-worker. Every banner quotes a real tested response; the red-team proof is linked underneath.",
  View,
});
