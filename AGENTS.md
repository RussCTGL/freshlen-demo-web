# FreshLens Demo Web — agent rules

This is an 8-person repo. **Read `CONTRIBUTING.md` before editing anything.** The
non-negotiable rule:

> Only create or edit files inside **one** `modules/<slug>/` folder — the one for the
> workstream you were asked to build. NEVER touch `app/`, `components/`, `lib/`, `scripts/`,
> `modules/registry.ts`, config, or any other module. A CI check (`module-guard`) fails PRs
> that break this.

To add a module: copy `modules/_template/` → `modules/<slug>/`, fill `module.ts` (via
`defineModule`) and `View.tsx`, keep all files inside that folder. Import shared UI from
`@/components`, shared logic from `@/lib`, your own files with `./`. Never import another
module. The nav/routes auto-discover your module — do not edit any registry or nav file.

Worked examples to copy: `modules/calibration-dataset/` and `modules/calibration-run/`.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
