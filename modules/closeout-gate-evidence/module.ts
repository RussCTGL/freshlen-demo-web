import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "closeout-gate-evidence",
  title: "Closeout Gates — A Release Packet That Cannot False-Green",
  owner: "Yizhou",
  issue: 162,
  week: 7,
  order: 162,
  summary:
    "The frozen gate-result v1 contract (#186, merged Jul 31): VERIFIED requires an exact commit, artifact path, and SHA-256; a timeout can never verify. Plus the deterministic 11-gate orchestrator built on it (draft #202): two clean runs, byte-identical normalized packets, honestly 8 VERIFIED / 3 BLOCKED — and exit 1 by design, because a blocked gate cannot be promoted.",
  View,
});
