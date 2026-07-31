import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "receipt-trust-release",
  title: "Receipt Trust & Release Boundary",
  owner: "Lezhi",
  issue: 156,
  week: 7,
  order: 156,
  summary:
    "Public-key receipt verification rejects tampering and downgrade attempts while keeping HMAC compatibility—and keeps native, durability, and issuance limits explicit.",
  View,
});
