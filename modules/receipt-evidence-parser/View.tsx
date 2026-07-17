"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";

import { parseReceiptPhoto } from "./actions";
import {
  parseReceiptText,
  type ReceiptPhotoResult,
  type TextReceiptResult,
} from "./receipt";

const MAX_ACTION_IMAGE_BYTES = 700 * 1024;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function canvasBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("image_compression_failed"))),
      "image/jpeg",
      quality,
    );
  });
}

async function prepareReceiptImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) throw new Error("Please select an image file.");

  const bitmap = await createImageBitmap(file);
  try {
    let scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Your browser could not prepare this image.");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      const blob = await canvasBlob(canvas, Math.max(0.52, 0.88 - attempt * 0.09));
      if (blob.size <= MAX_ACTION_IMAGE_BYTES) {
        return new File([blob], "receipt-demo.jpg", { type: "image/jpeg" });
      }
      scale *= 0.8;
    }
  } finally {
    bitmap.close();
  }
  throw new Error("This image is too large to prepare for the demo.");
}

function JsonResult({ value }: { value: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-black p-4 font-mono text-xs leading-6 text-zinc-100">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function ResultBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest ${
        ok
          ? "border-success/30 bg-success/10 text-success"
          : "border-danger/30 bg-danger/10 text-danger"
      }`}
    >
      {ok ? "parse_ok: true" : "parse_ok: false"}
    </span>
  );
}

export default function View() {
  const [itemLabel, setItemLabel] = useState("bananas");
  const [itemPriceCents, setItemPriceCents] = useState("199");
  const [storeId, setStoreId] = useState("store_042");
  const [purchaseDate, setPurchaseDate] = useState(todayIso);
  const [textResult, setTextResult] = useState<TextReceiptResult | null>(null);

  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [preparedSize, setPreparedSize] = useState<number | null>(null);
  const [photoResult, setPhotoResult] = useState<ReceiptPhotoResult | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const photoSizeLabel = useMemo(() => {
    if (!photo) return "JPG, PNG, GIF or WebP";
    return `${photo.name} · ${(photo.size / 1024).toFixed(0)} KB`;
  }, [photo]);

  function runTextParser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTextResult(
      parseReceiptText({ itemLabel, itemPriceCents, storeId, purchaseDate }),
    );
  }

  function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const nextPhoto = event.target.files?.[0] ?? null;
    setPhoto(nextPhoto);
    setPhotoResult(null);
    setPhotoError("");
    setPreparedSize(null);
    setPreviewUrl(nextPhoto ? URL.createObjectURL(nextPhoto) : "");
  }

  async function runPhotoParser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!photo) {
      setPhotoError("Choose a receipt photo first.");
      return;
    }

    setPreparing(true);
    setPhotoError("");
    setPhotoResult(null);
    try {
      const prepared = await prepareReceiptImage(photo);
      setPreparedSize(prepared.size);
      const formData = new FormData();
      formData.set("image", prepared);
      startTransition(async () => {
        try {
          setPhotoResult(await parseReceiptPhoto(formData));
        } catch {
          setPhotoError("The server action failed. Please retry the demo.");
        }
      });
    } catch (error) {
      setPhotoError(error instanceof Error ? error.message : "Could not prepare this image.");
    } finally {
      setPreparing(false);
    }
  }

  const busy = preparing || isPending;

  return (
    <section className="space-y-8">
      <div className="rounded-lg border border-brand/30 border-l-4 border-l-brand bg-brand-tint p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              Interactive demo · Issue #77
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Turn messy receipt evidence into a stable contract</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              Try both paths shipped this week: validate typed purchase data, then upload a real
              receipt photo for live Claude OCR. Both paths normalize produce names before the
              evidence gate consumes them.
            </p>
          </div>
          <span className="w-fit rounded-full border border-success/30 bg-success/10 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-success">
            Live API · no mock response
          </span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
                Path 1 · required
              </p>
              <h3 className="mt-1 text-xl font-semibold">Typed receipt validator</h3>
              <p className="mt-2 text-sm text-muted">
                Change several fields at once to show that every validation error is returned together.
              </p>
            </div>
            {textResult && <ResultBadge ok={textResult.parse_ok} />}
          </div>

          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={runTextParser}>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted">Item label</span>
              <input
                value={itemLabel}
                onChange={(event) => setItemLabel(event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-brand"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted">Price (integer cents)</span>
              <input
                value={itemPriceCents}
                onChange={(event) => setItemPriceCents(event.target.value)}
                inputMode="numeric"
                className="rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-brand"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted">Store ID</span>
              <input
                value={storeId}
                onChange={(event) => setStoreId(event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-brand"
              />
            </label>
            <label className="grid gap-1.5 text-sm">
              <span className="text-muted">Purchase date</span>
              <input
                type="date"
                value={purchaseDate}
                onChange={(event) => setPurchaseDate(event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 outline-none transition focus:border-brand"
              />
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Parse typed receipt
              </button>
              <button
                type="button"
                onClick={() => {
                  setItemLabel(" ");
                  setItemPriceCents("0");
                  setPurchaseDate("2099-01-01");
                  setTextResult(null);
                }}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted transition hover:border-warning hover:text-foreground"
              >
                Load three errors
              </button>
            </div>
          </form>

          <div className="mt-5">
            {textResult ? (
              <JsonResult value={textResult} />
            ) : (
              <p className="rounded-lg border border-dashed border-border p-4 text-sm text-faint">
                Run the validator to see its exact downstream contract.
              </p>
            )}
          </div>
        </article>

        <article className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-faint">
                Path 2 · stretch
              </p>
              <h3 className="mt-1 text-xl font-semibold">Live receipt-photo OCR</h3>
              <p className="mt-2 text-sm text-muted">
                The image is compressed in your browser, then sent to a server-side Claude call.
                The API key never enters the browser response.
              </p>
            </div>
            {photoResult && <ResultBadge ok={photoResult.parse_ok} />}
          </div>

          <form className="mt-5 space-y-4" onSubmit={runPhotoParser}>
            <label className="block cursor-pointer rounded-lg border border-dashed border-border bg-background p-4 transition hover:border-brand">
              <span className="block text-sm font-medium">Choose receipt photo</span>
              <span className="mt-1 block text-xs text-faint">{photoSizeLabel}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={choosePhoto}
                className="sr-only"
              />
            </label>

            {previewUrl && (
              // A local blob URL is intentionally used so the selected receipt never needs a public URL.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Selected receipt preview"
                className="max-h-64 w-full rounded-lg border border-border bg-white object-contain"
              />
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={!photo || busy}
                className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {preparing ? "Preparing image…" : isPending ? "Reading receipt…" : "Run live OCR"}
              </button>
              {preparedSize !== null && (
                <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
                  sent {(preparedSize / 1024).toFixed(0)} KB to server
                </span>
              )}
            </div>
          </form>

          <div className="mt-5 space-y-3">
            {photoError && (
              <p className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
                {photoError}
              </p>
            )}
            {photoResult ? (
              <JsonResult value={photoResult} />
            ) : (
              !photoError && (
                <p className="rounded-lg border border-dashed border-border p-4 text-sm text-faint">
                  Select a real grocery receipt. The first readable line item will appear here.
                </p>
              )
            )}
          </div>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Normalize", '"bananas" → "banana" so #76 can compare the same identity.'],
          ["Validate", "Empty names, non-positive prices, and bad dates accumulate in errors[]."],
          ["Boundary", "$1.99 becomes 199 cents immediately; float dollars go no farther."],
        ].map(([title, detail]) => (
          <div key={title} className="rounded-lg border border-border bg-surface p-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-brand">
              {title}
            </p>
            <p className="mt-2 text-sm text-muted">{detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-success/30 border-l-4 border-l-success bg-success/5 p-4 text-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-success">
          One-minute talk track
        </p>
        <p className="mt-2 text-muted">
          Issue #77 gives downstream evidence checks one stable receipt shape. Manual input validates
          every error together; the optional photo path performs real OCR, normalizes the first grocery
          item, and converts printed dollars to integer cents. If Claude or its key is unavailable, the
          adapter fails closed with <code>claude_unavailable</code> instead of crashing the claim flow.
        </p>
      </div>
    </section>
  );
}
