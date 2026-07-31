import Image, { type StaticImageData } from "next/image";

import approvedAmount from "./16-reviewer-approved-amount.png";
import invalidImageRecovery from "./17-invalid-image-format-recovery.png";
import zoomEvidence from "./20-claim-200-percent-zoom.png";
import reducedMotion from "./21-prefers-reduced-motion-reduce.png";
import keyboardFocus from "./22-keyboard-focus-first-control.png";
import responsiveShopper from "./08-claim-320px-initial.png";
import reviewerQueue from "./11-reviewer-human-review-queue-desktop.png";
import privacyCleanReceipt from "./15-receipt-details-privacy-clean.png";

const facts = [
  { value: "23 + 1", label: "public screenshots + synthetic fixture" },
  { value: "56 / 56", label: "offline UI smoke checks" },
  { value: "4 passed", label: "focused tests" },
  { value: "122821c", label: "evidence head" },
];

const coverage = [
  {
    area: "Responsive",
    status: "VERIFIED",
    proof: "Shopper and reviewer layouts at 320px with no horizontal overflow.",
  },
  {
    area: "Zoom",
    status: "VERIFIED",
    proof: "Rendered browser evidence with Edge visibly set to 200%.",
  },
  {
    area: "Keyboard + focus",
    status: "VERIFIED",
    proof: "Visible focus and representative initial-step order; validation returns focus to the token field.",
  },
  {
    area: "Reduced motion",
    status: "VERIFIED",
    proof: "Runtime prefers-reduced-motion: reduce emulation with the matching active CSS rule.",
  },
  {
    area: "Recovery",
    status: "VERIFIED",
    proof: "Unauthorized, wrong-role, validation, and invalid-image-format recovery states.",
  },
  {
    area: "Guarded outcomes",
    status: "VERIFIED",
    proof: "Human review, approved amount, system decline, and reviewer decline rendered distinctly.",
  },
  {
    area: "Complete keyboard traversal",
    status: "INCONCLUSIVE",
    proof: "The evidence covers the initial step, not every forward and reverse traversal across the full wizard.",
  },
];

const gallery: Array<{
  image: StaticImageData;
  title: string;
  caption: string;
}> = [
  {
    image: responsiveShopper,
    title: "320px shopper layout",
    caption: "The capture step remains usable without horizontal overflow.",
  },
  {
    image: keyboardFocus,
    title: "Visible keyboard focus",
    caption: "The first interactive control has a clear, high-contrast focus indicator.",
  },
  {
    image: zoomEvidence,
    title: "Actual 200% browser zoom",
    caption: "The rendered page and browser zoom control are visible in the same evidence frame.",
  },
  {
    image: reducedMotion,
    title: "Reduced-motion runtime",
    caption: "DevTools emulation and the active media rule make the runtime condition inspectable.",
  },
  {
    image: invalidImageRecovery,
    title: "Invalid-image recovery",
    caption: "The error explains the accepted formats and returns the shopper to a recoverable state.",
  },
  {
    image: reviewerQueue,
    title: "Human-review queue",
    caption: "Reviewer context stays visibly guarded as human-review-only.",
  },
  {
    image: approvedAmount,
    title: "Approved amount",
    caption: "The result distinguishes an approved amount from issuance, refund, payment, or settlement.",
  },
  {
    image: privacyCleanReceipt,
    title: "Privacy-clean receipt details",
    caption: "The public evidence uses synthetic/demo values and excludes the original receipt image.",
  },
];

const talkTrack = [
  {
    time: "0:00–0:15",
    title: "Problem",
    body: "Week 6 had the claim flow; Week 7 made its failure, accessibility, and reviewer states reproducible.",
  },
  {
    time: "0:15–0:35",
    title: "Show the proof",
    body: "Open the 320px, 200% zoom, keyboard-focus, and reduced-motion evidence instead of describing them.",
  },
  {
    time: "0:35–0:55",
    title: "Show recovery",
    body: "Walk through unauthorized and invalid-image states, then show that reviewer outcomes remain explicit and guarded.",
  },
  {
    time: "0:55–1:15",
    title: "State the boundary",
    body: "The browser evidence is verified; complete keyboard traversal and the current native scanner journey are not.",
  },
];

export default function View() {
  return (
    <section className="space-y-10">
      <header className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border bg-brand-tint px-6 py-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Issue #159 · PR #190 merged · Week 7
          </p>
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Claim UX that proves its recovery states
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            I turned the shopper and reviewer claim surfaces into a privacy-clean, rendered
            evidence package. The result covers responsive behavior, accessibility conditions,
            error recovery, and guarded outcomes without presenting demo-only or native-blocked
            behavior as production proof.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/LawrenceHua/es-intern-freshlens/pull/190"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Open merged PR #190
            </a>
            <a
              href="https://github.com/LawrenceHua/es-intern-freshlens/issues/159"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand"
            >
              Read issue #159
            </a>
            <a
              href="https://github.com/LawrenceHua/es-intern-freshlens/issues/164"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand"
            >
              Device record #164
            </a>
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {facts.map((fact) => (
          <article key={fact.label} className="rounded-2xl border border-border bg-surface p-5">
            <p className="font-mono text-2xl font-semibold tabular-nums text-foreground">
              {fact.value}
            </p>
            <p className="mt-2 text-sm leading-5 text-muted">{fact.label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-3xl border border-border bg-surface p-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Coverage matrix
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">
            What the evidence actually establishes
          </h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-border">
            <div className="divide-y divide-border">
              {coverage.map((row) => (
                <div key={row.area} className="grid gap-2 p-4 sm:grid-cols-[10rem_7rem_1fr]">
                  <p className="font-semibold text-foreground">{row.area}</p>
                  <span
                    className={`w-fit rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold ${
                      row.status === "VERIFIED"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {row.status}
                  </span>
                  <p className="text-sm leading-6 text-muted">{row.proof}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-3xl border border-success/30 bg-success/5 p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-success">
              Shipped
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              One reproducible evidence packet
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
              <li>PR #190 merged the recovery and state-copy changes.</li>
              <li>Evidence was captured against exact head <code>122821c</code>.</li>
              <li>Two offline smoke runs were byte-identical.</li>
              <li>
                Smoke JSON SHA-256 begins <code>84BF995B…</code>.
              </li>
            </ul>
          </article>

          <article className="rounded-3xl border border-warning/40 bg-warning/10 p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-warning">
              Honest boundary
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              Demo state is not backend proof
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Some error-code response states were manually constructed because the current
              server does not emit that field. They demonstrate UI handling only. The original
              receipt photo and all tokens stay outside the public evidence package.
            </p>
          </article>
        </div>
      </section>

      <section>
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
            Rendered evidence
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-foreground">
            Eight frames for the live walkthrough
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            These are selected from the public package. Each frame proves one observable state;
            none substitutes for a complete end-to-end or native test.
          </p>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {gallery.map((item) => (
            <figure
              key={item.title}
              className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm"
            >
              <div className="flex h-72 items-center justify-center bg-background p-3">
                <Image
                  src={item.image}
                  alt={item.title}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="max-h-full w-auto rounded-lg object-contain"
                />
              </div>
              <figcaption className="border-t border-border p-5">
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-danger/30 bg-danger/5 p-6 sm:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-danger">
          Physical-device result · TestFlight
        </p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Xpired 4.2.0 (2026072807): scanner journey blocked
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              On a physical iPhone, the app opened but displayed{" "}
              <code>On-device scanner unavailable</code>. Capture stayed paused and exposed a{" "}
              <code>Retry model download</code> control. That fail-closed behavior is verified;
              a successful produce scan and downstream claim journey are not.
            </p>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              ["Participation", "DEVICE_AVAILABLE"],
              ["Overall status", "BLOCKED"],
              ["Fail-closed UI", "VERIFIED"],
              ["Source linkage", "INCONCLUSIVE"],
            ].map(([term, value]) => (
              <div key={term} className="rounded-2xl border border-border bg-surface p-4">
                <dt className="font-mono text-[11px] uppercase tracking-widest text-faint">
                  {term}
                </dt>
                <dd className="mt-1 font-mono font-semibold text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          75-second presentation order
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          Contribution → proof → limitation
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {talkTrack.map((item) => (
            <li key={item.time} className="rounded-2xl border border-border bg-background p-5">
              <p className="font-mono text-xs font-semibold text-brand">{item.time}</p>
              <h3 className="mt-2 font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
