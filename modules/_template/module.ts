// 📋 TEMPLATE — copy this whole folder to modules/<your-workstream>/ and edit.
// Do not edit files in _template/ directly (the CI guard blocks it).

import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "_template", // MUST match your folder name, e.g. "calibration-gate"
  title: "Template Module",
  owner: "Your Name", // or ["Name A", "Name B"] for a co-owned workstream
  issue: undefined, // e.g. 33
  week: 3, // program week this work belongs to — drives which week tab you appear under
  order: 999, // lower sorts earlier within your week/owner group
  summary: "One line describing what this workstream demos.",
  View,
});
