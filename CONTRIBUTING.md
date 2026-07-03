# Contributing — FreshLens Demo Web

This is an **8-person collaborative repo**. One rule makes parallel work possible:

> **You only ever create or edit files inside your own `modules/<your-module>/` folder.**
> You never touch `app/`, `components/`, `lib/`, `scripts/`, config, or another person's module.

A CI check (`module-guard`) enforces it — a PR that reaches outside your module folder fails
before review. Nothing shared ever needs to change to add a module (the nav/routes discover it
automatically), so there are no merge conflicts between people.

---

## 1. Repo layout (who may edit what)

```
freshlen-demo-web/
  app/                          🔒 SHELL — layout, landing, the [slug] renderer.   shell owner
    (modules)/[slug]/page.tsx   🔒   one generic renderer for every module
  components/                   🔒 SHARED UI primitives (e.g. StatBars).           shell owner
  lib/
    define-module.ts            🔒 the module contract.                            shell owner
  scripts/
    gen-registry.mjs            🔒 registry codegen.                               shell owner
  modules/
    registry.ts                 🔒 sorted module list.                             shell owner
    registry.generated.ts       ⚙️  AUTO-GENERATED + git-ignored — never edit/commit
    _template/                  📋 copy this to start. Do not edit in place.
    <your-module>/              ✅ YOUR folder — you own everything in it
      module.ts                    — the ONE public entry (defineModule)
      View.tsx                     — your page content (private)
      data.ts, components/, ...    — anything else, all private to this folder
  .github/                      🔒 CODEOWNERS + CI.                                shell owner
```

🔒 = protected (shell-owner review). ✅ = yours. 📋 = template. ⚙️ = generated.

## 2. Modules are named by workstream, owner-labeled

Name your folder after the **work** (`calibration-gate`), not yourself. Your name goes in
`module.ts` as `owner`, and the site renders an **"Owner: …" byline**. This keeps the site
stable when people rotate on and off a workstream.

- **One issue = one module folder.** If you own several issues, you own several folders — they
  never collide.
- **Co-owned issue?** Set `owner: ["Name A", "Name B"]` and list both handles on the module's
  CODEOWNERS line (`/modules/<slug>/ @a @b`). The two of you share the one folder, so coordinate
  *inside* it (the CI guard isolates modules from each other, not co-owners within a module).

**How the site organizes itself** (all derived from `module.ts` metadata — you never edit nav):
the landing page is a welcome page; the nav has one tab per **week**; a week page has sub-tabs
per **owner** (a co-owned module appears under each owner); each card links to your module page
at `/<slug>`.

## 3. How to add your module (once per week)

1. Copy the template to a workstream-named folder:
   ```bash
   cp -r modules/_template modules/<your-workstream>
   ```
2. Edit `modules/<your-workstream>/module.ts` — set `slug` (= folder name), `title`, `owner`,
   `issue`, `week` (which "Week N" tab you appear under), `order`, `summary`.
3. Build your page in `View.tsx` (+ any `data.ts`, `components/`, etc. — **all inside your
   folder**).
4. Open a PR. That's it. **You do not edit any nav, route, or registry file** — the shell
   discovers your module on the next build. If you feel you need to edit something shared, stop
   and ask the shell owner.

## 4. The module contract

Your `module.ts` is the module's entire public surface — one default export via `defineModule`:

```ts
import { defineModule } from "@/lib/define-module";
import View from "./View";

export default defineModule({
  slug: "calibration-gate", // MUST equal the folder name
  title: "Calibration Gate",
  owner: "Yunke",
  issue: 33,
  week: 3, // which "Week N" tab you appear under
  order: 30,
  summary: "GO/NO-GO gate report from the calibration run.",
  View,
});
```

Everything else in the folder is private. See `modules/calibration-dataset/` and
`modules/calibration-run/` for worked examples (issues #29 and #32).

## 5. Import rules (lint-enforced)

- Import shared UI from `@/components`, shared logic from `@/lib`.
- Import your own files with relative `./` paths.
- **Never import another module** (`@/modules/*` or `../other-module/*`) — ESLint blocks it.

## 6. Workflow: issue → branch → PR → merge (required, no exceptions)

Every change lands through this lifecycle. **Never commit or push to `main` directly.**

1. **Issue** — your work starts from your issue in `es-intern-freshlens` (the demo page
   consolidates that issue). Reference it in your `module.ts` (`issue: NN`) and PR description.
2. **Branch** — `<name>/<workstream>`, e.g. `lisa/fraud-probe`. One branch per module.
3. **PR** — one PR per module, targeting `main`. Each PR gets a **Vercel preview URL** = your
   weekly demo link. A PR must stay within **one** `modules/<slug>/` folder; `module-guard`
   fails it otherwise.
4. **Merge** — only after `module-guard` (and all checks) are green. Merging to `main` is what
   publishes your page to the production site.

Shared/structural changes are shell-owner-only (CODEOWNERS review + a `shell-change` label).

## 7. Using an AI agent (Claude Code / Cursor)

The rules are auto-loaded via `AGENTS.md`, so an agent opening this repo already knows the
isolation rule. Give it your **content**, not the rules — and point it at the example. Template:

```
Add a demo module for issue #XX (<workstream name>), owner <name>.
Follow AGENTS.md / CONTRIBUTING.md — create ONLY modules/<slug>/, copy the
pattern from modules/calibration-run/. Here is my content / source data:
<paste your numbers, or point at the file / PR in es-intern-freshlens>.
```

The structure comes out correct hands-free; you supply the substance. If the agent tries to
edit anything outside your `modules/<slug>/` folder, stop it — `module-guard` will reject that
PR anyway.

## 8. Shell owner

`@RussCTGL` (Yizhou) owns `app/`, `components/`, `lib/`, `scripts/`, `modules/registry.ts`,
and `.github/`. Everyone else owns exactly one leaf module.
