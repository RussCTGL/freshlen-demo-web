"use client";

import { useState } from "react";
import Image from "next/image";
import photo from "./multi-fruit.jpg";
import { image, items, gateRows, testRows, colorTone, type DeepResult, type Tone } from "./data";

const toneBorder: Record<Tone, string> = {
  success: "border-success",
  warning: "border-warning",
  danger: "border-danger",
};
const toneChip: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};
const toneText: Record<Tone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

/** Pixel box â†’ percentage offsets so the overlay scales with the photo. */
function pct(box: [number, number, number, number]) {
  const [x, y, w, h] = box;
  return {
    left: `${(x / image.width) * 100}%`,
    top: `${(y / image.height) * 100}%`,
    width: `${(w / image.width) * 100}%`,
    height: `${(h / image.height) * 100}%`,
  };
}

/** Mirror of static/app.js deepIsReal(): only the es-api backend WITH a confidence
 *  counts as a real verdict â€” placeholder / fallback shows the honest unavailable note. */
function deepIsReal(deep: DeepResult): boolean {
  return deep.backend === "es-api" && deep.confidence != null;
}

type Status = "idle" | "checking" | "done";
type Session = "real" | "offline";

export default function View() {
  const [session, setSession] = useState<Session>("real");
  const [status, setStatus] = useState<Status[]>(items.map(() => "idle"));
  const [hint, setHint] = useState(
    "Roughly scored worst-first â€” tap the worst item (rank 1) for a deep check.",
  );

  const deepOf = (i: number) => (session === "real" ? items[i].deepReal : items[i].deepOffline);

  function switchSession(s: Session) {
    if (s === session) return;
    setSession(s);
    setStatus(items.map(() => "idle"));
    setHint(
      s === "real"
        ? "Replaying the recorded session with a real intern key â€” tap an item."
        : "Replaying the recorded session with no key â€” tap an item to see the honest fallback.",
    );
  }

  function tap(i: number) {
    const it = items[i];
    const deep = deepOf(i);
    if (status[i] === "checking") return;
    if (status[i] === "done") {
      // Mirrors the app's quota guard: `if (item._verifying || item.deep) return;`
      setHint(`${it.label} is already deep-checked â€” the app never re-fires the ES call (quota-safe).`);
      return;
    }
    setStatus((s) => s.map((v, j) => (j === i ? "checking" : v)));
    setHint(`Running a deep check on ${it.label} with the real modelâ€¦`);
    window.setTimeout(() => {
      setStatus((s) => s.map((v, j) => (j === i ? "done" : v)));
      if (!deepIsReal(deep)) {
        setHint(
          `${it.label}: deep check unavailable (the real model couldn't be reached) â€” showing the offline estimate ${deep.score}. Tap another item to try it.`,
        );
      } else if (deep.humanReview) {
        setHint(
          `${deep.produceType}: the model scored this ${deep.score} at ${Math.floor((deep.confidence ?? 0) * 100)}% confidence â€” under the 0.80 floor, so a human will verify this. Tap another item.`,
        );
      } else {
        setHint(
          `${deep.produceType}: the model scored this ${deep.score} (${Math.floor((deep.confidence ?? 0) * 100)}% confident). Tap another item to deep-check it.`,
        );
      }
    }, 900);
  }

  return (
    <section className="space-y-8">
      <p className="text-muted">
        The whole-scene scan is <em>fast</em> â€” every item gets a rough placeholder score
        (Yizhou&apos;s <code>#52</code> boxes, Tony&apos;s <code>#53</code> verdicts). The{" "}
        <strong>trustworthy</strong> moment is deliberate: tap the worst-ranked item and the app
        crops <em>that box</em> from the clean original photo and runs{" "}
        <strong>one</strong> real ES call (<code>POST /api/produce/analyze</code>) on just that
        crop. Detection â†’ fast triage â†’ deep check on the item that matters. No call ever fires
        for an un-tapped item.
      </p>

      {/* --- Session toggle: two REAL recorded sessions, replayed --- */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Replay session
        </span>
        <button
          type="button"
          onClick={() => switchSession("real")}
          className={`rounded border px-2.5 py-1 font-mono text-xs ${
            session === "real"
              ? "border-brand bg-brand-tint text-brand-strong"
              : "border-border text-muted hover:bg-surface-raised"
          }`}
        >
          with a real intern key (2026-07-10)
        </button>
        <button
          type="button"
          onClick={() => switchSession("offline")}
          className={`rounded border px-2.5 py-1 font-mono text-xs ${
            session === "offline"
              ? "border-brand bg-brand-tint text-brand-strong"
              : "border-border text-muted hover:bg-surface-raised"
          }`}
        >
          no key â€” honest fallback (2026-07-09)
        </button>
      </div>

      {/* --- Interactive replay: real recorded requests/responses, re-enacted --- */}
      <figure className="space-y-2">
        <div className="relative overflow-hidden rounded-lg border border-border">
          <Image src={photo} alt="Basket scene: green apples and a pile of bananas" className="h-auto w-full" />
          {items.map((it, i) => {
            const tone = colorTone[it.color];
            return (
              <button
                key={i}
                type="button"
                onClick={() => tap(i)}
                className={`absolute cursor-pointer rounded border-2 ${toneBorder[tone]} ${
                  status[i] === "checking" ? "animate-pulse" : ""
                }`}
                style={pct(it.box)}
                aria-label={`Deep-check ${it.label}`}
              >
                <span
                  className={`absolute -top-0.5 left-0 -translate-y-full rounded-t px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white ${toneChip[tone]}`}
                >
                  {it.label} Â· {it.fast}
                </span>
              </button>
            );
          })}
        </div>
        <figcaption className="text-xs text-faint">
          A <strong>replay, not a mock</strong>: the boxes, fast scores, and every deep-check
          result are the exact recorded responses of the real endpoints on this photo â€” one
          session with no ES key (the honest degraded state, subtask â‘¢) and one with a real
          intern key through the read-only proxy. Toggle above to switch sessions.
        </figcaption>
      </figure>

      {/* --- The worst-first list with the tappable Verify affordance --- */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          Eat me first â€” tap a row to deep-check it
        </h3>
        <ul className="mt-3 space-y-2">
          {items.map((it, i) => {
            const st = status[i];
            const deep = deepOf(i);
            const real = deepIsReal(deep);
            const rowTone = colorTone[st === "done" ? deep.color : it.color];
            return (
              <li key={it.rank}>
                <button
                  type="button"
                  onClick={() => tap(i)}
                  className={`flex w-full items-center gap-3 rounded-lg border border-border border-l-4 ${toneBorder[rowTone]} bg-surface p-3 text-left hover:bg-surface-raised`}
                >
                  <span className="font-mono text-sm tabular-nums text-faint">{it.rank}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">
                      {st === "done" && real && deep.produceType !== "produce" ? deep.produceType : it.label}{" "}
                      <span className={`font-normal ${toneText[rowTone]}`}>Â· {it.verdict}</span>
                    </div>
                    <div className="text-xs text-muted">fast estimate {it.fast}</div>
                  </div>
                  {st === "idle" && (
                    <span className={`rounded px-2.5 py-1.5 font-mono text-xs font-semibold text-white ${toneChip[rowTone]}`}>
                      Verify
                    </span>
                  )}
                  {st === "checking" && (
                    <span className={`animate-pulse rounded px-2.5 py-1.5 font-mono text-xs font-semibold text-white ${toneChip[rowTone]}`}>
                      checkingâ€¦
                    </span>
                  )}
                  {st === "done" && (
                    <span className={`flex flex-col items-center rounded px-2.5 py-1 text-white ${toneChip[rowTone]}`}>
                      <span className="font-mono text-base font-bold tabular-nums">{deep.score}</span>
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wide">
                        {real ? `confidence: ${Math.floor((deep.confidence ?? 0) * 100)}%` : "deep check unavailable"}
                      </span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 min-h-5 text-sm text-muted" aria-live="polite">
          {hint}
        </p>
        <p className="mt-1 text-xs text-faint">
          Worth noticing in the real session: the deep check <em>re-ranks</em> the scene (the
          fast-worst banana deep-checks at 26; its 74% confidence routes it to a human), one
          apple comes back <span className="font-mono">8 / fresh</span> at 99.8% confidence â€” and
          the model genuinely called the rank-4 apple <em>â€œdillâ€</em>. We kept that
          misclassification on purpose: the model <strong>advises</strong>, it doesn&apos;t
          decide.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* --- The honesty gate (Yizhou, â‘¢) --- */}
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            The verdict is gated â€” it never pretends
          </h3>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-faint">
                <th className="py-1.5 font-medium">backend</th>
                <th className="py-1.5 font-medium">confidence</th>
                <th className="py-1.5 font-medium">the tab shows</th>
              </tr>
            </thead>
            <tbody>
              {gateRows.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-1.5 font-mono text-xs">{r.backend}</td>
                  <td className="py-1.5 font-mono text-xs text-muted">{r.confidence}</td>
                  <td className={`py-1.5 text-xs ${r.real ? "text-success" : "text-warning"}`}>{r.shows}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-faint">
            Only a real <code>es-api</code> answer with a confidence is presented as a deep
            verdict; no key and proxy-down both degrade to an <em>honest</em> note â€” never a fake
            percentage. And the copy is advisory by rule: <em>â€œthe model scored this 26 (74%
            confident)â€</em> â€” the model never â€œconfirmsâ€ or â€œguaranteesâ€ freshness.
          </p>
        </div>

        {/* --- The clean-crop bug the pairing caught --- */}
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
            The bug the pairing caught
          </h3>
          <p className="mt-3 text-sm text-muted">
            The first version cropped the tapped item from the <em>annotated canvas</em> â€” so the
            coloured box + label pixels went to the model, and a rotten apple (fast{" "}
            <span className="font-mono">74</span>) â€œdeep-checkedâ€ as fresh
            (<span className="font-mono">25</span>). The fix: always crop from a clean re-decode
            of the original photo. Re-verified live: fast <span className="font-mono">74</span> â†’
            deep <span className="font-mono">74</span>, and the rule is pinned by an offline test
            so it can&apos;t regress.
          </p>
          <p className="mt-3 text-xs text-faint">
            Quota-safe by construction: one <code>POST /api/produce/analyze</code> per item,
            only on tap, never re-fired (watch the network tab â€” un-tapped items cost nothing).
          </p>
        </div>
      </div>

      {/* --- The real tests --- */}
      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
          The offline tests that guard this
        </h3>
        <table className="mt-3 w-full text-sm">
          <tbody>
            {testRows.map((t, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="py-1.5 pr-3 font-mono text-xs">{t.name}</td>
                <td className="py-1.5 text-xs text-muted">{t.pins}</td>
                <td className="py-1.5 text-success">âœ“</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-faint">
          <code>tests/test_deep_verify.py</code> â€” endpoint-level, no network, no key, no skips
          (repo suite: 577 green). Built as a pair on one branch: Tony â‘ â‘¡ (tap â†’ crop â†’ verdict
          UI), Yizhou â‘¢â‘£ (honest degraded path + these tests). PR&nbsp;#73 on{" "}
          <code>es-intern-freshlens</code>.
        </p>
      </div>
    </section>
  );
}
