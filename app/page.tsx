import Link from "next/link";
import { formatOwners } from "@/lib/define-module";
import { modules } from "@/modules/registry";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">FreshLens — Weekly Demo</h1>
      <p className="mt-2 max-w-2xl text-gray-500">
        Snap-to-Claim build progress. Each card is one workstream, owned by one person, added over
        the summer.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {modules.map((m) => (
          <Link
            key={m.slug}
            href={`/${m.slug}`}
            className="rounded-xl border border-black/10 p-5 transition hover:border-black/30 dark:border-white/15 dark:hover:border-white/40"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-medium">{m.title}</h2>
              {m.issue ? <span className="text-xs text-gray-400">#{m.issue}</span> : null}
            </div>
            <p className="mt-2 text-sm text-gray-500">{m.summary}</p>
            <p className="mt-3 text-xs text-gray-400">Owner: {formatOwners(m.owner)}</p>
          </Link>
        ))}
        {modules.length === 0 ? (
          <p className="text-sm text-gray-500">No modules yet — copy <code>modules/_template</code> to begin.</p>
        ) : null}
      </div>
    </div>
  );
}
