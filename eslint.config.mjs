import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Auto-generated — never linted.
    "modules/registry.generated.ts",
  ]),

  // Module isolation: a module may never import another module. Shared code lives
  // in @/components and @/lib only. Own files use relative "./" imports.
  {
    files: ["modules/**/*.{ts,tsx}"],
    ignores: ["modules/registry.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/*", "@/modules/*/*"],
              message:
                "Modules are private. Import shared code from @/components or @/lib, never another module.",
            },
            {
              group: ["../*"],
              message:
                "Do not import across module folders. Keep imports inside your module (./) or use @/components / @/lib.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
