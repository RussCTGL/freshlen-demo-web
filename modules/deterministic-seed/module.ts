import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "deterministic-seed",
  title: "Deterministic Seed & Fixture Evidence",
  owner: "Mohan Li",
  issue: 110,
  week: 6,
  order: 10,
  summary:
    "One seed, twice, byte-identical \u2014 the in-process helper that puts a real claim in human_review, and the boundary fixtures that pin the contract's edges.",
  View,
});
