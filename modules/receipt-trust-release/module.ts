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
    "Exact-head evidence: public-only Ed25519 verification, tamper and downgrade rejection, HMAC compatibility, rotation semantics, and explicit native/durability/issuance limits.",
  View,
});
