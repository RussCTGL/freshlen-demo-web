"use client";

import { useState } from "react";
import { StatBars } from "@/components/StatBars";
import {
  total,
  webRows,
  spoiledPhoneTotal,
  confound,
  spoiledPhonePerType,
  certifyBar,
  collectAsk,
  hygiene,
  phoneOnHand,
  coverageFloor,
  verification,
  resolutionBySource,
} from "./data";

const Z95 = 1.959963984540054;

function wilsonLowerBound(k: number, n: number): number {
  if (n === 0) return 0;
  const p = k / n;
  const denom = 1 + (Z95 * Z95) / n;
  const centre = p + (Z95 * Z95) / (2 * n);
  const margin =
    Z95 * Math.sqrt((p * (1 - p) + (Z95 * Z95) / (4 * n)) / n);
  return (centre - margin) / denom;
}

/** Smallest n whose Wilson 95% lower bound clears `target`, assuming we
 *  observe `acc` of items correct. Null if unreachable within 5000. */
function minNToCertify(target: number, acc: number): number | null {
  for (let n = 1; n <= 5000; n++) {
    const k = Math.floor(acc * n);
    if (wilsonLowerBound(k, n) >= target) return n;
  }
  return null;
}

function wilsonUpperBound(k: number, n: number): number {
  if (n === 0) return 1;
  const p = k / n;
  const denom = 1 + (Z95 * Z95) / n;
  const centre = p + (Z95 * Z95) / (2 * n);
  const margin =
    Z95 * Math.sqrt((p * (1 - p) + (Z95 * Z95) / (4 * n)) / n);
  return (centre + margin) / denom;
}

/** Smallest n whose Wilson 95% UPPER bound on the false-positive rate is
 *  at or below `maxFpr`, assuming we observe `obsFpr` of items wrongly
 *  flagged. Null if unreachable within 5000. */
function minNForFPR(maxFpr: number, obsFpr: number): number | null {
  for (let n = 1; n <= 5000; n++) {
    const k = Math.floor(obsFpr * n);
    if (wilsonUpperBound(k, n) <= maxFpr) return n;
  }
  return null;
}

export default function View() {
  return (
    <section className="space-y-8">
      <p className="text-muted">
        In the Week-3 demo we admitted the <strong>80% auto-approve floor</strong> was
        arbitrary. This workstream replaces that story with a data-sufficiency argument:
        the floor is not yet defensible because the evaluation set cannot certify it —{" "}
        <strong>{webRows}/{total}</strong> rows are scraped web images, and the entire
        dataset holds <strong>{spoiledPhoneTotal} spoiled phone photos</strong>.
      </p>

      {/* The confound — the one number to remember */}
      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Label / source confound (web share per label)
        </h3>
        <ul className="mt-3 space-y-2">
          {confound.map((r) => (
            <li key={r.state} className="flex items-center gap-3 text-sm">
              <span className="w-36 shrink-0 text-muted">{r.state}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                <span
                  className="block h-2 rounded-full bg-brand"
                  style={{ width: r.webShare }}
                />
              </span>
              <span className="w-28 shrink-0 text-right font-mono text-xs tabular-nums text-faint">
                {r.webShare} web ({r.web}/{r.phone + r.web + r.other})
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-faint">
          &ldquo;Spoiled&rdquo; is 69% web imagery while &ldquo;fresh&rdquo; is mostly
          phone: a threshold tuned on this mix may be scoring the <em>camera</em>, not
          the rot. Certification must run on the phone-only subset.
        </p>
      </div>

      {/* Gold set status — replaces the live terminal verify */}
      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          The gold set — assembled, shared, and tamper-evident
        </h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {verification.map((v) => (
            <li
              key={v.label}
              className="flex items-center justify-between rounded border border-border px-3 py-2 text-sm"
            >
              <span className="text-muted">{v.label}</span>
              <span className="font-mono text-xs tabular-nums text-brand">
                ✓ {v.value}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-faint">
          Until this week the 154 photos existed only on our laptops. They now
          live in one shared folder, every file pinned by hash — anyone can
          re-verify that a calibration run used the exact set that was labeled.
          Re-runs for the calibration refresh and the fake-photo probe are
          unblocked.
        </p>
      </div>

      {/* Resolution finding — from the memo, now measurable */}
      <div>
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Resolution is nearly a proxy for source
        </h3>
        <ul className="mt-3 space-y-2">
          {resolutionBySource.map((r) => (
            <li key={r.source} className="flex items-center gap-3 text-sm">
              <span className="w-36 shrink-0 text-muted">{r.source}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                <span
                  className="block h-2 rounded-full bg-brand"
                  style={{ width: r.share }}
                />
              </span>
              <span className="w-44 shrink-0 text-right font-mono text-xs tabular-nums text-faint">
                {r.headline}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-faint">
          With the files in hand we can finally measure resolution — and it
          collapses into the source confound: a per-resolution floor cannot be
          certified independently of a per-source one until new phone photos
          span more device types.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <StatBars
            title={`Spoiled phone photos on hand (perfect-run floor: ${certifyBar}/bucket)`}
            rows={spoiledPhonePerType}
          />
          <p className="mt-2 text-sm text-faint">
            Wilson 95% lower bound: even a perfect run needs{" "}
            <code>n &ge; {certifyBar}</code>{" "}spoiled phone items per bucket to certify
            precision &ge; 0.80. Seven of nine types have zero.
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
            Hygiene — fixed or flagged
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {hygiene.map((h) => (
              <li key={h.item} className="flex gap-3">
                <span className="w-20 shrink-0 font-mono text-xs uppercase tracking-wide text-brand">
                  {h.status}
                </span>
                <span className="text-muted">
                  {h.item} — <span className="text-faint">{h.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Calculator />

      <div className="rounded border border-border px-4 py-3">
        <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
          Interim policy stance
        </h3>
        <p className="mt-2 text-muted">
          <strong>Auto-approve stays gated off — now with evidence instead of a
          shrug.</strong> The ask comes in tiers. Minimum to make certification
          possible (perfect-run floor): ~180 photos, ~22 per intern. Realistic
          per-type certification of the money metric (95% accuracy): ~290
          spoiled photos. Full per-type certification including the
          false-positive side: use the calculator — at defaults it is ~1,540,
          which is why pooling the FP side across types is on the table. New
          photos go to the shared drive&apos;s incoming/ folder with lighting
          logged as indoor | outdoor | unknown; every number on this page
          regenerates from the analysis tooling merged this week. Full write-up
          available as the realism memo (PDF).
        </p>
      </div>
    </section>
  );
}

function Calculator() {
  const [acc, setAcc] = useState(0.95);
  const [target, setTarget] = useState(0.8);
  const [obsFpr, setObsFpr] = useState(0.0);
  const [maxFpr, setMaxFpr] = useState(0.05);

  const nSpoiled = minNToCertify(target, acc);
  const spoiledUnreachable = acc <= target;
  const nFpRaw = minNForFPR(maxFpr, obsFpr);
  const fpUnreachable = obsFpr >= maxFpr;
  const nFp = nFpRaw === null ? null : Math.max(nFpRaw, coverageFloor);

  const rows = phoneOnHand.map((t) => ({
    ...t,
    freshNeed: nFp === null ? null : Math.max(0, nFp - t.fresh),
    borderlineNeed: nFp === null ? null : Math.max(0, nFp - t.borderline),
    spoiledNeed: nSpoiled === null ? null : Math.max(0, nSpoiled - t.spoiled),
  }));
  const totals = rows.reduce(
    (a, r) => ({
      fresh: a.fresh + (r.freshNeed ?? 0),
      borderline: a.borderline + (r.borderlineNeed ?? 0),
      spoiled: a.spoiled + (r.spoiledNeed ?? 0),
    }),
    { fresh: 0, borderline: 0, spoiled: 0 }
  );
  const anyNull = nSpoiled === null || nFp === null;
  const grand = totals.fresh + totals.borderline + totals.spoiled;

  const numInput =
    "w-24 rounded border border-border bg-transparent px-2 py-1 font-mono text-sm tabular-nums";
  const labelCls = "text-sm text-muted";
  const capCls = "mb-1 block text-xs text-faint";

  return (
    <div>
      <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
        Collection calculator — how many photos at your assumptions?
      </h3>
      <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-3">
        <label className={labelCls}>
          <span className={capCls}>Observed accuracy on spoiled</span>
          <input type="number" min={0.5} max={1} step={0.01} value={acc}
            onChange={(e) => setAcc(Number(e.target.value))} className={numInput} />
        </label>
        <label className={labelCls}>
          <span className={capCls}>Target precision to certify</span>
          <input type="number" min={0.5} max={0.99} step={0.01} value={target}
            onChange={(e) => setTarget(Number(e.target.value))} className={numInput} />
        </label>
        <label className={labelCls}>
          <span className={capCls}>Observed false-positive rate</span>
          <input type="number" min={0} max={0.5} step={0.01} value={obsFpr}
            onChange={(e) => setObsFpr(Number(e.target.value))} className={numInput} />
        </label>
        <label className={labelCls}>
          <span className={capCls}>Max false-positive rate to certify</span>
          <input type="number" min={0.01} max={0.5} step={0.01} value={maxFpr}
            onChange={(e) => setMaxFpr(Number(e.target.value))} className={numInput} />
        </label>
      </div>

      <div className="mt-3 space-y-1 text-sm">
        {spoiledUnreachable || nSpoiled === null ? (
          <p className="font-mono text-brand">
            spoiled: not certifiable — observed accuracy must exceed the target
            precision
          </p>
        ) : (
          <p className="text-muted">
            spoiled (detection): needs{" "}
            <span className="font-mono font-semibold">n &ge; {nSpoiled}</span>{" "}
            spoiled phone photos per type
          </p>
        )}
        {fpUnreachable || nFp === null ? (
          <p className="font-mono text-brand">
            fresh/borderline: not certifiable — observed FP rate must be below
            the max FP rate
          </p>
        ) : (
          <p className="text-muted">
            fresh &amp; borderline (false-positive): needs{" "}
            <span className="font-mono font-semibold">n &ge; {nFp}</span> of
            each per type
          </p>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left font-mono text-xs uppercase tracking-wide text-faint">
              <th className="py-1 pr-4 font-medium">type</th>
              <th className="py-1 pr-4 font-medium">fresh</th>
              <th className="py-1 pr-4 font-medium">borderline</th>
              <th className="py-1 pr-4 font-medium">spoiled</th>
              <th className="py-1 font-medium">total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const rowTotal =
                (r.freshNeed ?? 0) + (r.borderlineNeed ?? 0) + (r.spoiledNeed ?? 0);
              return (
                <tr key={r.type} className="border-t border-border">
                  <td className="py-1 pr-4 text-muted">{r.type}</td>
                  <td className="py-1 pr-4 font-mono tabular-nums text-faint">
                    {r.freshNeed ?? "—"}
                  </td>
                  <td className="py-1 pr-4 font-mono tabular-nums text-faint">
                    {r.borderlineNeed ?? "—"}
                  </td>
                  <td className="py-1 pr-4 font-mono tabular-nums text-muted">
                    {r.spoiledNeed ?? "—"}
                  </td>
                  <td className="py-1 font-mono tabular-nums text-muted">
                    {anyNull ? "—" : rowTotal}
                  </td>
                </tr>
              );
            })}
            <tr className="border-t border-border font-semibold">
              <td className="py-1 pr-4 text-muted">all types</td>
              <td className="py-1 pr-4 font-mono tabular-nums">{totals.fresh}</td>
              <td className="py-1 pr-4 font-mono tabular-nums">{totals.borderline}</td>
              <td className="py-1 pr-4 font-mono tabular-nums">{totals.spoiled}</td>
              <td className="py-1 font-mono tabular-nums">
                {anyNull ? "—" : `${grand} (~${Math.ceil(grand / 8)}/intern)`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-faint">
        Spoiled certifies detection: the smallest n whose Wilson 95% lower
        bound (at your observed accuracy) clears the target precision. Fresh
        and borderline certify the false-positive side: the smallest n whose
        Wilson 95% upper bound (at your observed FP rate) stays under the max
        FP rate — with a fixed coverage floor of {coverageFloor} per type for
        easier data collection. Needs shown are net of phone photos on hand.
        Defaults: 0.95 accuracy / 0.80 precision / 0.00 observed FP / 0.05 max
        FP. The false-positive side can alternatively be certified pooled
        across all types (one bucket instead of nine) — a policy choice that
        cuts its cost roughly 9x.
      </p>
    </div>
  );
}
