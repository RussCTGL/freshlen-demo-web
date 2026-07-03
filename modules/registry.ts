// 🔒 SHELL — reads the auto-generated module list and exposes it, sorted.
// Contributors never touch this. It imports the git-ignored generated file,
// which `predev`/`prebuild` produces from the module folders present.

import type { ModuleDefinition } from "@/lib/define-module";
import { generatedModules } from "./registry.generated";

export const modules: ModuleDefinition[] = [...generatedModules].sort(
  (a, b) => a.order - b.order || a.title.localeCompare(b.title),
);

export function getModule(slug: string): ModuleDefinition | undefined {
  return modules.find((m) => m.slug === slug);
}
