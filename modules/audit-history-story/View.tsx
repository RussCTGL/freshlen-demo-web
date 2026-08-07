"use client";

import { useState } from "react";

type ReplayMode = "original" | "changed";

const events = [
  {
    step: "01",
    type: "Claim created",
    actor: "Shopper account",
    detail: "A new claim begins with a claim ID and requested amount.",
  },
  {
    step: "02",
    type: "Evidence added",
    actor: "Shopper account",
    detail: "The history records an evidence ID, not the raw photo.",
  },
  {
    step: "03",
    type: "Claim assessed",
    actor: "FreshLens system",
    detail: "Only the bounded score and reason are recorded.",
  },
  {
    step: "04",
    type: "Human review",
    actor: "Assigned reviewer",
    detail: "The final human action is added to the same history.",
  },
] as const;

const contributions = [
  {
    number: "01",
    title: "Connected every action",
    detail: "Each new event carries the fingerprint of the event before it, creating one continuous history.",
  },
  {
    number: "02",
    title: "Found the first change",
    detail: "Verification walks the history in order and identifies the first event whose content or connection no longer matches.",
  },
  {
    number: "03",
    title: "Kept the record private",
    detail: "The audit trail stores IDs, scores, amounts, and reason codes - never raw images, tokens, or personal information.",
  },
] as const;

export default function View() {
  const [mode, setMode] = useState<ReplayMode>("original");
  const changed = mode === "changed";

  return (
    <section className="space-y-10">
      <div className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Week 3 / Lezhi / #31
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            I made every claim action leave a checkable history.
          </h2>
        </div>
        <div className="rounded-xl border border-success/30 bg-success/10 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-success">What changed</p>
          <p className="mt-3 text-xl font-semibold">An edit can no longer hide inside the record.</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Every event is linked to the one before it, so one silent change breaks the chain from that point onward.
          </p>
        </div>
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-faint">What I delivered</p>
        <h3 className="mt-2 text-2xl font-semibold">Three parts of one tamper-evident record</h3>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {contributions.map((item) => (
            <article key={item.number} className="rounded-xl border border-border bg-surface p-5">
              <span className="font-mono text-xs text-faint">{item.number}</span>
              <h4 className="mt-5 text-lg font-semibold">{item.title}</h4>
              <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex flex-col justify-between gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-faint">Interactive replay</p>
            <h3 className="mt-2 text-2xl font-semibold">Follow one claim through its history</h3>
          </div>
          <div className="flex gap-2" role="group" aria-label="Audit history replay">
            <button
              type="button"
              onClick={() => setMode("original")}
              aria-pressed={!changed}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                !changed
                  ? "border-success bg-success text-white"
                  : "border-border bg-surface-raised text-muted hover:border-success/50 hover:text-foreground"
              }`}
            >
              Original history
            </button>
            <button
              type="button"
              onClick={() => setMode("changed")}
              aria-pressed={changed}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                changed
                  ? "border-danger bg-danger text-white"
                  : "border-border bg-surface-raised text-muted hover:border-danger/50 hover:text-foreground"
              }`}
            >
              Change one event
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
            {events.map((event, index) => {
              const isChangedEvent = changed && index === 1;
              const isAfterBreak = changed && index > 1;

              return (
                <div key={event.step} className="contents">
                  <article
                    className={`rounded-xl border p-4 ${
                      isChangedEvent
                        ? "border-danger/40 bg-danger/10"
                        : isAfterBreak
                          ? "border-warning/40 bg-warning/10"
                          : "border-success/30 bg-success/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-faint">{event.step}</span>
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isChangedEvent ? "bg-danger" : isAfterBreak ? "bg-warning" : "bg-success"
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <h4 className="mt-4 font-semibold">
                      {isChangedEvent ? "Evidence amount changed" : event.type}
                    </h4>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-faint">{event.actor}</p>
                    <p className="mt-3 text-xs leading-5 text-muted">
                      {isChangedEvent ? "This no longer matches the event fingerprint that was recorded." : event.detail}
                    </p>
                  </article>
                  {index < events.length - 1 ? (
                    <div className={`flex items-center justify-center font-mono text-xs ${changed && index >= 1 ? "text-warning" : "text-success"}`}>
                      <span className="hidden lg:inline">-&gt;</span>
                      <span className="lg:hidden">down</span>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div
            className={`mt-5 flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center ${
              changed ? "border-danger/30 bg-danger/10" : "border-success/30 bg-success/10"
            }`}
          >
            <div>
              <p className={`font-mono text-xs font-semibold uppercase tracking-widest ${changed ? "text-danger" : "text-success"}`}>
                {changed ? "Change detected" : "History verified"}
              </p>
              <p className="mt-2 text-sm text-muted">
                {changed
                  ? "The first broken point is event 02. Later events can no longer prove a continuous history."
                  : "Every event and every connection matches from the first action to the human review."}
              </p>
            </div>
            <span className={`font-mono text-sm font-semibold ${changed ? "text-danger" : "text-success"}`}>
              {changed ? "BROKEN AT 02" : "VALID"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-info/30 bg-info/5 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-info">Privacy boundary</p>
          <h3 className="mt-3 text-xl font-semibold">Useful facts in, sensitive evidence out.</h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            The history keeps claim IDs, actors, scores, amounts, and reason codes. Raw photos, tokens, secrets, and personal information never belong in an audit event.
          </p>
        </article>

        <article className="rounded-xl border border-warning/30 bg-warning/5 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-warning">Honest Week 3 limit</p>
          <h3 className="mt-3 text-xl font-semibold">Tamper-evident, not tamper-proof.</h3>
          <p className="mt-3 text-sm leading-6 text-muted">
            Week 3 caught edits inside a supplied history. It did not yet prove that someone had not replaced the entire history; the signed trust anchor followed in Week 4.
          </p>
        </article>
      </div>
    </section>
  );
}
