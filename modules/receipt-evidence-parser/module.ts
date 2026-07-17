import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "receipt-evidence-parser",
  title: "Receipt Evidence Parser",
  owner: "Lezhi",
  issue: 77,
  week: 5,
  order: 77,
  summary:
    "Validate typed receipt evidence and extract a normalized grocery line item from a real receipt photo.",
  View,
});
