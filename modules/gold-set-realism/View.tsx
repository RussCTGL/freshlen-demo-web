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
} from "./data";

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

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <StatBars
            title={`Spoiled phone photos on hand (need ${certifyBar}/bucket)`}
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

      <p className="text-muted">
        <strong>The fix is cheap:</strong> {collectAsk}. New tooling —{" "}
        <code>scripts/gold_set_manifest.py</code> assembles the shared-drive folder into
        the company gold set (SHA-256 per file, resolution recorded, row-for-row match to{" "}
        <code>index.csv</code>) and re-verifies it on demand;{" "}
        <code>scripts/evaluation_realism.py</code> regenerates every number on this page.
        Until collection lands, auto-approve stays gated off — now with evidence instead
        of a shrug.
      </p>
    </section>
  );
}
