// 🔒 SHELL — reads the auto-generated module list and exposes it, sorted and grouped.
// Contributors never touch this. It imports the git-ignored generated file,
// which `predev`/`prebuild` produces from the module folders present.

import type { ModuleDefinition } from "@/lib/define-module";
import { ownerList } from "@/lib/define-module";
import { generatedModules } from "./registry.generated";

export const modules: ModuleDefinition[] = [...generatedModules].sort(
  (a, b) => a.week - b.week || a.order - b.order || a.title.localeCompare(b.title),
);

export function getModule(slug: string): ModuleDefinition | undefined {
  return modules.find((m) => m.slug === slug);
}

/** All program weeks that have at least one module, ascending. Drives the nav tabs. */
export function getWeeks(): number[] {
  return [...new Set(modules.map((m) => m.week))].sort((a, b) => a - b);
}

export function getModulesByWeek(week: number): ModuleDefinition[] {
  return modules.filter((m) => m.week === week);
}

/** Owners active in a week, each with their modules (a co-owned module appears under
 *  every one of its owners). Order of owners follows first appearance in the week. */
export function getOwnersForWeek(
  week: number,
): { owner: string; modules: ModuleDefinition[] }[] {
  const groups = new Map<string, ModuleDefinition[]>();
  for (const mod of getModulesByWeek(week)) {
    for (const owner of ownerList(mod.owner)) {
      const list = groups.get(owner) ?? [];
      list.push(mod);
      groups.set(owner, list);
    }
  }
  return [...groups.entries()].map(([owner, mods]) => ({ owner, modules: mods }));
}
