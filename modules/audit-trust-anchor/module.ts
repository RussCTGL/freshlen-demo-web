import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "audit-trust-anchor",
  title: "Audit Trust Anchor",
  owner: "Lezhi",
  issue: 57,
  week: 4,
  order: 57,
  summary:
    "HMAC-signed audit events reject a full-chain rewrite that a plain hash chain would trust.",
  View,
});
