"use server";

import { normalizeLabel, type ReceiptPhotoResult } from "./receipt";

const MAX_IMAGE_BYTES = 750 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const RECEIPT_PHOTO_PROMPT =
  "You are a receipt parser. Given this grocery receipt photo, " +
  "extract the first line item: return JSON only with keys item_label " +
  "(str), unit_price (float, the printed dollar amount), store_name (str). " +
  'If you cannot read it clearly, return {"parse_ok": false}.';

function unavailable(): ReceiptPhotoResult {
  return { parse_ok: false, errors: ["claude_unavailable"] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstTextBlock(value: unknown): string | null {
  if (!isRecord(value) || !Array.isArray(value.content)) return null;
  const block = value.content.find(
    (candidate) =>
      isRecord(candidate) &&
      candidate.type === "text" &&
      typeof candidate.text === "string",
  );
  return isRecord(block) && typeof block.text === "string" ? block.text : null;
}

export async function parseReceiptPhoto(
  formData: FormData,
): Promise<ReceiptPhotoResult> {
  const image = formData.get("image");
  if (!(image instanceof File)) return unavailable();
  if (
    image.size <= 0 ||
    image.size > MAX_IMAGE_BYTES ||
    !ALLOWED_IMAGE_TYPES.has(image.type)
  ) {
    return unavailable();
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return unavailable();

  try {
    const encodedImage = Buffer.from(await image.arrayBuffer()).toString("base64");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: image.type,
                  data: encodedImage,
                },
              },
              { type: "text", text: RECEIPT_PHOTO_PROMPT },
            ],
          },
        ],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) return unavailable();

    const responseBody: unknown = await response.json();
    const rawText = firstTextBlock(responseBody);
    if (!rawText) return unavailable();

    const parsed: unknown = JSON.parse(rawText.trim());
    if (!isRecord(parsed) || parsed.parse_ok === false) return unavailable();

    const itemLabel = parsed.item_label;
    const unitPrice = parsed.unit_price;
    const storeName = parsed.store_name;
    if (
      typeof itemLabel !== "string" ||
      !itemLabel.trim() ||
      typeof unitPrice !== "number" ||
      !Number.isFinite(unitPrice) ||
      unitPrice <= 0 ||
      typeof storeName !== "string" ||
      !storeName.trim()
    ) {
      return unavailable();
    }

    const itemPriceCents = Math.round(unitPrice * 100);
    if (!Number.isSafeInteger(itemPriceCents) || itemPriceCents <= 0) {
      return unavailable();
    }

    return {
      item_label: normalizeLabel(itemLabel),
      item_price_cents: itemPriceCents,
      store_name: storeName.trim(),
      parse_method: "receipt_photo",
      parse_ok: true,
      errors: [],
    };
  } catch {
    return unavailable();
  }
}
