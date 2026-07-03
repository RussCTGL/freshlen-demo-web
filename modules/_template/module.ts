// 📋 TEMPLATE — copy this whole folder to modules/<your-workstream>/ and edit.
// Do not edit files in _template/ directly (the CI guard blocks it).

import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "_template", // MUST match your folder name, e.g. "calibration-gate"
  title: "Template Module",
  owner: "Your Name", // or ["Name A", "Name B"] for a co-owned workstream
  issue: undefined, // e.g. 33
  order: 999, // lower sorts earlier in nav + landing
  summary: "One line describing what this workstream demos.",
  View,
});
