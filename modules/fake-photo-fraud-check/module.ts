import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "fake-photo-fraud-check",
  title: "Can a Fake Photo Fool the Freshness Check?",
  owner: "Lisa",
  issue: 34,
  week: 3,
  order: 34,
  summary:
    "The freshness model can't tell a real damaged-produce photo from an AI-generated fake — so a separate safety scan checks how often a fake would slip through anyway.",
  View,
});
