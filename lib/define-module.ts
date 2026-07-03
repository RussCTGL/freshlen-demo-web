// 🔒 SHARED CONTRACT — shell-owner review required to change.
// This is the entire public surface every module must satisfy.

import type { ComponentType } from "react";

export type ModuleMeta = {
  /** URL-safe id; MUST equal the folder name under modules/. e.g. "calibration-gate" */
  slug: string;
  /** Human title shown in nav + page header. e.g. "Calibration Gate" */
  title: string;
  /** Display name(s) of the owner(s). One string, or several for a co-owned workstream.
   *  Shown as the "Owner:" byline. */
  owner: string | string[];
  /** GitHub issue this module demos, if any. e.g. 33 */
  issue?: number;
  /** Sort order in nav + landing (lower = earlier). */
  order: number;
  /** One-line summary shown on the landing card. */
  summary: string;
};

export type ModuleDefinition = ModuleMeta & {
  /** The page content. A default-exported React component. */
  View: ComponentType;
};

/** The single entry point of a module. `modules/<slug>/module.ts` calls this. */
export function defineModule(mod: ModuleDefinition): ModuleDefinition {
  return mod;
}

/** Render one or more owners as a byline, e.g. "Lisa & Lezhi". */
export function formatOwners(owner: string | string[]): string {
  return Array.isArray(owner) ? owner.join(" & ") : owner;
}
