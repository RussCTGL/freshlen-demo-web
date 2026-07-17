"use client";

import { useState } from "react";
import { fruits, stats } from "./data";

/* ── small building blocks (dark, site-token styled) ─────────────────────── */

function Connector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-1 text-center">
      <span className="text-lg leading-none text-success">▼</span>
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{label}</span>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-2 py-1 font-mono text-[11px] text-success">
      🛡️ {children}
    </span>
  );
}

function Phone({
  glyph,
  headline,
  children,
}: {
  glyph: string;
  headline: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2 max-w-sm overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex h-5 items-center justify-center border-b border-border">
        <span className="h-1 w-8 rounded-full bg-border" />
      </div>
      <div className="p-3">
        <div className="text-lg leading-none">{glyph}</div>
        <div className="mt-1.5 text-sm font-semibold">{headline}</div>
        <div className="mt-0.5 text-xs text-muted">{children}</div>
      </div>
    </div>
  );
}

function Gate({
  step,
  icon,
  question,
  fn,
  checks,
  children,
}: {
  step: string;
  icon: string;
  question: string;
  fn: string;
  checks?: { pass?: boolean; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="border-b border-border p-4">
        <div className="font-mono text-[11px] uppercase tracking-widest text-faint">{step}</div>
        <div className="mt-0.5 text-base font-semibold">
          {icon} {question}
        </div>
        <div className="mt-0.5 font-mono text-xs text-muted">{fn}</div>
        {checks && (
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5 text-[11px] text-faint">
                <span className={c.pass ? "text-success" : "text-warning"}>
                  {c.pass ? "✓" : "✗"}
                </span>
                {c.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="grid sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Branch({ tone, children }: { tone: "pass" | "fail"; children: React.ReactNode }) {
  const cls =
    tone === "pass"
      ? "bg-success/5"
      : "border-t border-border sm:border-l sm:border-t-0";
  return <div className={`p-4 ${cls}`}>{children}</div>;
}

/* ── the interactive evidence -> message bridge ──────────────────────────── */

function Bridge() {
  const [fruit, setFruit] = useState(fruits[0]);
  const rows: { data: React.ReactNode; hl?: boolean; says: React.ReactNode; quiet?: boolean }[] = [
    { data: <><span className="text-brand">decision</span>: <span className="text-danger">human_review</span></>, hl: true, says: <>Claim marked <strong>&ldquo;in review.&rdquo;</strong></> },
    { data: <><span className="text-brand">identity_result.match</span>: <span className="text-danger">false</span></>, says: <>&ldquo;This photo doesn&apos;t match your receipt.&rdquo;</> },
    { data: <><span className="text-brand">identity_result.predicted</span>: <span className="text-warning">&quot;banana&quot;</span></>, says: <>&ldquo;It looks like a banana,&rdquo;</> },
    { data: <><span className="text-brand">identity_result.expected</span>: <span className="text-warning">&quot;{fruit.label}&quot;</span></>, says: <>&ldquo;but your receipt says {fruit.label}.&rdquo;</> },
    { data: <><span className="text-brand">fraud_signals.risk_level</span>: <span className="text-warning">&quot;low&quot;</span></>, says: <>no fraud warning shown — honest, not alarmist</>, quiet: true },
    { data: <><span className="text-brand">reason_code</span>: <span className="text-warning">&quot;gray_zone_escalate&quot;</span></>, says: <>&ldquo;A team member will take a look.&rdquo;</> },
  ];

  return (
    <div>
      <h3 className="font-mono text-xs font-medium uppercase tracking-widest text-muted">
        How the evidence becomes the shopper&apos;s message
      </h3>
      <p className="mt-2 text-sm text-muted">
        The gates decide <em>what</em> happens; this is <em>why the shopper hears a clear reason.</em>{" "}
        The photo is always a 🍌 banana — pick what the receipt says, and notice the outcome never
        changes: any mismatch → <strong>human review</strong>.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {fruits.map((f) => {
          const on = f.key === fruit.key;
          return (
            <button
              key={f.key}
              onClick={() => setFruit(f)}
              className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                on
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border text-muted hover:border-brand/50"
              }`}
            >
              {f.emoji} {f.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-4 space-y-2">
        {rows.map((r, i) => (
          <li key={i} className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <span className="overflow-x-auto whitespace-nowrap rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-[11px]">
              {r.data}
            </span>
            <span className="hidden text-center text-faint sm:block">→</span>
            <span className={`text-[13px] ${r.quiet ? "italic text-faint" : "text-foreground"}`}>
              {r.says}
            </span>
          </li>
        ))}
      </ul>

      <Phone glyph="🙋" headline="A team member will take a look">
        This photo looks like a <strong>banana</strong>, but your receipt says{" "}
        <strong>{fruit.label}</strong>, so we couldn&apos;t match them automatically. Someone will
        review your claim and follow up within a day.
      </Phone>
    </div>
  );
}

/* ── the whole journey ───────────────────────────────────────────────────── */

export default function View() {
  return (
    <section className="space-y-6">
      <p className="text-sm text-muted">
        The trust layer, and the journey it protects. Every branch of the claim path below is locked
        by an offline test — no AI key, no network. It stays advisory: the tests prove the app{" "}
        <em>routes</em> as designed; they never confirm a food-safety fact.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "#79 tests", value: `${stats.tests} passed` },
          { label: "Fraud fixtures caught", value: `${stats.fixtures.caught} / ${stats.fixtures.total}` },
          {
            label: "Full suite (offline)",
            value: `${stats.fullSuite.passed} passed, ${stats.fullSuite.skipped} skipped`,
          },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-surface p-4">
            <div className="font-mono text-xs uppercase tracking-widest text-faint">{s.label}</div>
            <div className="mt-1.5 font-mono text-2xl font-semibold tabular-nums">{s.value}</div>
          </div>
        ))}
      </div>

      <p className="flex items-center gap-2 font-mono text-xs text-success">
        <span className="inline-block h-2 w-2 rounded-full bg-success" /> all green offline — no AI
        key, no network, no YOLO
      </p>

      <h3 className="border-t border-border pt-5 font-mono text-xs font-semibold uppercase tracking-widest text-faint">
        The journey each test protects
      </h3>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 text-sm">
        <span className="text-2xl">🛒</span>
        <span>
          A shopper submits a claim — <strong>a photo of the item</strong> +{" "}
          <strong>what the receipt says</strong> (item, price, date).
        </span>
      </div>

      <Connector label="first — the cheap door checks, before any AI" />

      <Gate step="The door · runs first" icon="🚪" question="Should we even spend effort on this claim?" fn="cap & duplicate checks — before receipt, fraud, match, or the AI model">
        <Branch tone="fail">
          <div className="flex items-center gap-2 text-sm font-semibold">💳 Monthly cap used up</div>
          <p className="mt-1 text-xs text-muted">This shopper already hit their ~$15 / month refund limit.</p>
          <Phone glyph="🧾" headline="You&apos;ve reached your monthly limit">
            You&apos;ve used your refund limit for this month — it resets on the 1st. We answered
            right away, no waiting.
          </Phone>
          <p className="mt-2 text-xs font-medium text-danger">→ declined instantly · the AI never runs</p>
        </Branch>
        <Branch tone="fail">
          <div className="flex items-center gap-2 text-sm font-semibold">🔁 Duplicate claim</div>
          <p className="mt-1 text-xs text-muted">The same photo, or the same purchase, was already submitted.</p>
          <Phone glyph="🔁" headline="You already submitted this one">
            This looks like a claim you&apos;ve already sent us. We won&apos;t process it twice —
            you&apos;ll hear back on the first one.
          </Phone>
          <p className="mt-2 text-xs font-medium text-danger">→ declined instantly · the AI never runs</p>
        </Branch>
      </Gate>

      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-3 text-xs text-muted">
        <strong className="text-foreground">Why the order matters:</strong> these run before the
        evidence gates and the AI. A claim stopped at the door gets an <strong className="text-foreground">instant</strong>{" "}
        answer — no waiting on the AI — and money can never be double-spent. Running them after the
        AI would be a P0 bug.
      </div>

      <Connector label="passes the door → the evidence gate begins" />

      <Gate
        step="Gate 1"
        icon="🧾"
        question="Does the receipt even make sense?"
        fn="parse_receipt_text"
        checks={[
          { pass: true, label: "valid receipt continues" },
          { label: "blank item name → stop" },
          { label: "$0 / negative price → stop" },
          { label: "date in the future → stop" },
        ]}
      >
        <Branch tone="pass">
          <div className="text-sm font-semibold">✅ Looks valid</div>
          <p className="mt-1 text-xs text-muted"><strong className="text-foreground">banana · $2.99 · today.</strong> Item name, a real price, a real not-future date.</p>
          <p className="mt-2 text-xs font-medium text-success">→ continues to Gate 2</p>
          <div className="mt-2"><Badge>test_parse_valid_receipt_text</Badge></div>
        </Branch>
        <Branch tone="fail">
          <div className="text-sm font-semibold">⚠️ Something&apos;s off</div>
          <p className="mt-1 text-xs text-muted">Blank item name · a $0 / negative price · a date in the <strong className="text-foreground">future</strong>.</p>
          <Phone glyph="✏️" headline="Please check what you entered">
            We couldn&apos;t read a valid item, price, or date. Fix it and we&apos;ll continue —
            before anything is submitted.
          </Phone>
          <p className="mt-2 text-xs font-medium text-warning">↩ shopper fixes &amp; retries (nothing wasted)</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge>test_parse_empty_item_name</Badge>
            <Badge>test_parse_invalid_price</Badge>
            <Badge>test_parse_future_date</Badge>
          </div>
        </Branch>
      </Gate>

      <Connector label="receipt is valid" />

      <Gate
        step="Gate 2"
        icon="🕵️"
        question="Does the photo look genuine?"
        fn="compute_fraud_signals"
        checks={[
          { pass: true, label: "in-app capture → clean" },
          { label: "flat one-colour image → high risk" },
          { label: "no camera info → caution flag" },
        ]}
      >
        <Branch tone="pass">
          <div className="text-sm font-semibold">🟢 Looks real</div>
          <p className="mt-1 text-xs text-muted">A detailed photo taken <strong className="text-foreground">in the app</strong>, with camera info attached. No fraud signals.</p>
          <p className="mt-2 text-xs font-medium text-success">→ continues to Gate 3</p>
          <div className="mt-2"><Badge>test_fraud_signals_in_app_capture</Badge></div>
        </Branch>
        <Branch tone="fail">
          <div className="text-sm font-semibold">🔴 Looks fake · ⚠️ caution</div>
          <p className="mt-1 text-xs text-muted"><strong className="text-foreground">Flat one-colour image</strong> → high risk. <strong className="text-foreground">No camera info</strong> → a caution flag (logged, but one soft flag alone won&apos;t stop a claim — we don&apos;t overreact).</p>
          <Phone glyph="🙋" headline="We&apos;ll have a person verify this photo">
            Something about this image needs a closer look. A team member will review it before any
            decision.
          </Phone>
          <p className="mt-2 text-xs font-medium text-danger">→ high risk routes to human review</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge>test_fraud_signals_uniform_image</Badge>
            <Badge>test_fraud_signals_missing_metadata</Badge>
          </div>
        </Branch>
      </Gate>

      <Connector label="photo looks genuine" />

      <Gate
        step="Gate 3"
        icon="🔍"
        question="Does the photo match the receipt?"
        fn="matches_receipt_item"
        checks={[
          { pass: true, label: "photo matches receipt → continue" },
          { label: "wrong item (apple vs banana) → review" },
          { label: "only 40% sure → review" },
          { label: "AI unavailable → review" },
        ]}
      >
        <Branch tone="pass">
          <div className="text-sm font-semibold">✅ It&apos;s a match</div>
          <p className="mt-1 text-xs text-muted">Photo reads as <strong className="text-foreground">&ldquo;banana&rdquo;</strong>, receipt says <strong className="text-foreground">&ldquo;banana&rdquo;</strong>, confident.</p>
          <p className="mt-2 text-xs font-medium text-success">→ reaches the refund policy engine</p>
          <div className="mt-2"><Badge>test_matches_receipt_item_match</Badge></div>
        </Branch>
        <Branch tone="fail">
          <div className="text-sm font-semibold">❌ Mismatch · 🤔 unsure · 🚫 offline</div>
          <p className="mt-1 text-xs text-muted">Photo says apple but receipt says banana · only 40% sure · AI unavailable. When not certain, we never auto-decide.</p>
          <Phone glyph="👀" headline="A team member will take a look">
            We couldn&apos;t confirm the photo matches your receipt. Someone will review it and follow
            up within a day.
          </Phone>
          <p className="mt-2 text-xs font-medium text-danger">→ human review (never auto-declined)</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge>..._mismatch</Badge>
            <Badge>..._low_confidence</Badge>
            <Badge>..._classifier_unavailable</Badge>
          </div>
        </Branch>
      </Gate>

      <Bridge />

      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            The fraud net · tested on real gold-set photos
          </h3>
          <span className="font-mono text-xs font-semibold text-success">
            {stats.fixtures.caught}/{stats.fixtures.total} caught
          </span>
        </div>
        <p className="mt-2 text-xs text-muted">
          The stretch: <span className="font-mono">test_evidence_fixtures</span> replays Mohan&apos;s
          real #85 gold-set images — the honest question is <em>which</em> fakes the pixel test can
          catch, and which belong to someone else.
        </p>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-3 rounded-md border border-success/30 bg-success/5 p-2.5 text-xs">
            <span className="flex-none font-medium text-foreground">solid-colour · blurry</span>
            <span className="min-w-0 flex-1 text-muted">🖼️ image detector → HIGH risk</span>
            <span className="flex-none font-medium text-success">✅ 8/8 regression-tested</span>
          </div>
          <div className="flex items-center gap-3 rounded-md border border-border p-2.5 text-xs">
            <span className="flex-none font-medium text-foreground">screenshot · AI-made · no-EXIF</span>
            <span className="min-w-0 flex-1 text-muted">📸 capture layer · in-app + metadata</span>
            <span className="flex-none text-faint">— by design, not the pixel test</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-warning">
          What makes this shippable
        </p>
        <p className="mt-2">
          Auto-approve is off — every claim routes to a human. What makes the gate shippable
          isn&apos;t the score, it&apos;s that <strong>every path is tested</strong> and the app
          never accuses: even a fake photo only ever hears &ldquo;we&apos;ll have someone verify
          this,&rdquo; never &ldquo;you cheated.&rdquo; Fakes this suite doesn&apos;t test —
          screenshots, AI-made images — aren&apos;t a gap: they&apos;re the capture layer&apos;s job
          (in-app capture + metadata), by design.
        </p>
      </div>
    </section>
  );
}
