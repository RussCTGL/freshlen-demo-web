// 🔒 SHELL — the ONE renderer for every module. Module-agnostic: it looks a module
// up by slug from the registry and renders it. Adding a module never touches this file.

import { notFound } from "next/navigation";
import { formatOwners } from "@/lib/define-module";
import { modules, getModule } from "@/modules/registry";

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export const dynamicParams = false;

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const { View } = mod;
  return (
    <article className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8 border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-faint">
          Week {mod.week} · {formatOwners(mod.owner)}
          {mod.issue ? ` · #${mod.issue}` : ""}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{mod.title}</h1>
      </header>
      <View />
    </article>
  );
}
