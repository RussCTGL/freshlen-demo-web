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
      <header className="mb-6 border-b border-black/10 pb-4 dark:border-white/15">
        <h1 className="text-2xl font-semibold tracking-tight">{mod.title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          Owner: {formatOwners(mod.owner)}
          {mod.issue ? ` · Issue #${mod.issue}` : ""}
        </p>
      </header>
      <View />
    </article>
  );
}
