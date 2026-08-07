import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "safe-default", // MUST match the folder name
  title: "The Safe Default: What Every Claim Does Before Any Automation",
  owner: "Tony",
  issue: 36,
  week: 3,
  order: 36, // matches the Week-1 (program Week 3) starter issue
  summary:
    "Week 3's job wasn't the smart part — it was the safe part. Watch one claim walk the walking-skeleton ladder and land on human review: the gate is closed until calibration proves the model, the engine never auto-declines, and a claim in review carries $0. Every step is pinned by a test in tests/test_policy.py (#36).",
  View,
});
