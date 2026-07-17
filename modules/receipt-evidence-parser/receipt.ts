export const NORMALIZE_MAP: Record<string, string> = {
  apples: "apple",
  apricots: "apricot",
  artichokes: "artichoke",
  avocados: "avocado",
  bananas: "banana",
  beets: "beet",
  "bell peppers": "bell pepper",
  blackberries: "blackberry",
  blueberries: "blueberry",
  "brussels sprouts": "brussels sprout",
  cabbages: "cabbage",
  cantaloupes: "cantaloupe",
  carrots: "carrot",
  cauliflowers: "cauliflower",
  cherries: "cherry",
  clementines: "clementine",
  coconuts: "coconut",
  cucumbers: "cucumber",
  dates: "date",
  "dragon fruits": "dragon fruit",
  eggplants: "eggplant",
  figs: "fig",
  grapefruits: "grapefruit",
  grapes: "grape",
  "green beans": "green bean",
  honeydews: "honeydew",
  jalapenos: "jalapeno",
  "jalapeños": "jalapeno",
  kiwis: "kiwi",
  leeks: "leek",
  lemons: "lemon",
  limes: "lime",
  mangoes: "mango",
  mandarins: "mandarin",
  melons: "melon",
  "mini peppers": "mini pepper",
  mushrooms: "mushroom",
  nectarines: "nectarine",
  onions: "onion",
  oranges: "orange",
  papayas: "papaya",
  "passion fruits": "passion fruit",
  peaches: "peach",
  pears: "pear",
  peas: "pea",
  persimmons: "persimmon",
  pineapples: "pineapple",
  plantains: "plantain",
  plums: "plum",
  pomegranates: "pomegranate",
  potatoes: "potato",
  radishes: "radish",
  raspberries: "raspberry",
  "snap peas": "snap pea",
  squashes: "squash",
  strawberries: "strawberry",
  "sweet potatoes": "sweet potato",
  tomatoes: "tomato",
  turnips: "turnip",
  watermelons: "watermelon",
  zucchinis: "zucchini",
};

export type TextReceiptResult = {
  item_label: string;
  item_price_cents: number | string;
  store_id: string;
  purchase_date: string;
  parse_method: "text_input";
  parse_ok: boolean;
  errors: string[];
};

export type ReceiptPhotoResult =
  | {
      item_label: string;
      item_price_cents: number;
      store_name: string;
      parse_method: "receipt_photo";
      parse_ok: true;
      errors: [];
    }
  | {
      parse_ok: false;
      errors: string[];
    };

export function normalizeLabel(value: string): string {
  const cleaned = value.trim().toLowerCase();
  return NORMALIZE_MAP[cleaned] ?? cleaned;
}

function isValidPurchaseDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  const isRealDate =
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day;
  if (!isRealDate) return false;

  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  return parsed.getTime() <= todayUtc;
}

export function parseReceiptText(input: {
  itemLabel: string;
  itemPriceCents: string;
  storeId: string;
  purchaseDate: string;
}): TextReceiptResult {
  const errors: string[] = [];
  const cleanedLabel = input.itemLabel.trim().toLowerCase();
  const integerPrice = /^[+-]?\d+$/.test(input.itemPriceCents.trim())
    ? Number(input.itemPriceCents)
    : Number.NaN;

  if (!cleanedLabel) errors.push("empty_item_name");
  if (!Number.isSafeInteger(integerPrice) || integerPrice <= 0) {
    errors.push("invalid_price");
  }
  if (!isValidPurchaseDate(input.purchaseDate)) errors.push("invalid_date");

  return {
    item_label: cleanedLabel ? normalizeLabel(cleanedLabel) : cleanedLabel,
    item_price_cents: Number.isSafeInteger(integerPrice)
      ? integerPrice
      : input.itemPriceCents,
    store_id: input.storeId,
    purchase_date: input.purchaseDate,
    parse_method: "text_input",
    parse_ok: errors.length === 0,
    errors,
  };
}
