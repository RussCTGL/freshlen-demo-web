"use client";

import { useState } from "react";
import {
  fixtureRun,
  proxyStatusEnum,
  reportRow,
  modelVersionNote,
  amountDerivation,
  stats,
  timeline,
} from "./data";

const statusColor: Record<string, string> = {
  ok: "text-success",
  disabled: "text-warning",
  unavailable: "text-faint",
};

export default function View() {
  const [selected, setSelected] = useState(proxyStatusEnum[0].value);
  const active = proxyStatusEnum.find((s) => s.value === selected) ?? proxyStatusEnum[0];

  return (
    <section className="space-y-8">
      <p className="text-muted">
        Two Week 6 pieces that hinge on each other. <code>ESProxyClient</code> (#104) reports
        each optional ES-proxy route&apos;s status without ever calling it or leaking a token —
        <code>ok</code>, <code>disabled</code>, or <code>unavailable</code>, degrade-safely. The
        account-scoped claims report (#111) has a <code>model_version</code> column that stays
        empty today for exactly the reason the doctor makes visible: <code>/model-info</code> is{" "}
        <code>ok</code> but nothing calls it yet. The empty field is the system refusing to
        guess, not a bug.
      </p>

      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          $ python scripts/es_capabilities.py --fixture tests/fixtures/proxy_capabilities.json
        </h3>
        <p className="mt-2 text-xs text-faint">
          Offline, zero network calls — reports capability status purely from a captured{" "}
          <code>/capabilities</code> document. Real output, exit 0.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-mono text-xs uppercase tracking-wide text-faint">
                <th className="py-1 pr-4 font-medium">route</th>
                <th className="py-1 pr-4 font-medium">status</th>
                <th className="py-1 font-medium">note</th>
              </tr>
            </thead>
            <tbody>
              {fixtureRun.map((row) => (
                <tr key={row.route} className="border-t border-border">
                  <td className="py-1.5 pr-4 font-mono text-brand">{row.route}</td>
                  <td className={`py-1.5 pr-4 font-mono font-medium ${statusColor[row.status]}`}>
                    {row.status}
                  </td>
                  <td className="py-1.5 font-mono text-xs text-faint">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-5">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Try it — ProxyStatus is a closed enum
        </p>
        <p className="mt-2 text-sm text-muted">
          <code>src/es_proxy_client.py</code>: every safe route resolves to exactly one of these
          four states — no capability is ever silently assumed available.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {proxyStatusEnum.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setSelected(s.value)}
              aria-pressed={s.value === selected}
              className={`rounded-full border px-3 py-1.5 font-mono text-sm transition ${
                s.value === selected
                  ? "border-brand bg-brand-tint font-medium text-brand"
                  : "border-border bg-background text-muted hover:border-brand hover:text-foreground"
              }`}
            >
              {s.value}
            </button>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-border bg-black p-4 font-mono text-xs text-zinc-100">
          <div className="mb-2 text-zinc-500">ProxyStatus.{active.value.toUpperCase()}</div>
          <span className="text-zinc-100">{active.detail}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            One owner-scoped report row
          </p>
          <p className="mt-2 text-xs text-faint">
            POST /api/report/export, mode=claims, fmt=csv — from the Week 6 demo run at{" "}
            <code>b6f9665</code>.
          </p>
          <dl className="mt-3 space-y-1.5 font-mono text-xs">
            {Object.entries(reportRow).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-faint">{k}</dt>
                <dd className={v === "" ? "italic text-warning" : "text-foreground"}>
                  {v === "" ? "(empty)" : v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-lg border border-warning/40 border-l-4 border-l-warning bg-surface p-4">
          <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
            Why model_version is empty
          </p>
          <p className="mt-2 whitespace-pre-line text-xs text-muted">{modelVersionNote}</p>
        </div>
      </div>

      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          approved_cents is server-derived, never reviewer-supplied
        </h3>
        <p className="mt-2 text-sm text-muted">
          The reviewer&apos;s approve call carries no amount field. Talking point: &quot;approved
          amount,&quot; never &quot;issued/refunded&quot; — the model advises, policy decides.
        </p>
        <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-black p-3 font-mono text-xs text-zinc-100">
{amountDerivation}
        </pre>
      </div>

      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Landing order
        </h3>
        <ul className="mt-3 space-y-3">
          {timeline.map((t) => (
            <li key={t.label} className="rounded-lg border border-border bg-surface-raised p-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{t.label}</span>
                <span className="font-mono text-xs text-faint">{t.date}</span>
              </div>
              <p className="mt-1.5 text-sm text-muted">{t.detail}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-success/30 border-l-4 border-l-success bg-success/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-success">
          Test coverage · #104 + #111
        </p>
        <p className="mt-2 text-muted">
          <code>tests/test_es_proxy_client.py</code>: {stats.proxyClientPassed} passed.{" "}
          <code>tests/test_es_proxy_failure_matrix.py</code> (adversarial matrix, #138):{" "}
          {stats.failureMatrixPassed} passed. <code>tests/test_claim_report.py</code>:{" "}
          {stats.claimReportPassed} passed. Full local suite: {stats.suitePassed} passed,{" "}
          {stats.suiteSkipped} skipped.
        </p>
      </div>
    </section>
  );
}
