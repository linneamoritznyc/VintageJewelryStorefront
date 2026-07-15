/**
 * Generates a Shopify-importable product CSV from the SAME mock catalog the
 * frontend uses (single source of truth). Run:
 *
 *   node --experimental-strip-types scripts/generate-shopify-csv.ts
 *
 * Output: shopify/fyndladan-products.csv
 *
 * Import it in Shopify admin via Products → Import. This lets you populate a
 * (dev) store with the exact catalog the site was built against, so you can
 * test the real Storefront API. See shopify/README.md for the image note.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { MOCK_PRODUCTS } from "../lib/shopify/mock/products.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "..", "shopify");
const OUT_FILE = join(OUT_DIR, "fyndladan-products.csv");

const CATEGORY_TITLES: Record<string, string> = {
  orhangen: "Örhängen",
  halsband: "Halsband",
  armband: "Armband",
  ovrigt: "Övrigt",
};

const COLUMNS = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Variant SKU",
  "Variant Inventory Qty",
  "Variant Inventory Policy",
  "Variant Fulfillment Service",
  "Variant Price",
  "Variant Compare At Price",
  "Variant Requires Shipping",
  "Variant Taxable",
  "Image Src",
  "Image Position",
  "Image Alt Text",
  "Status",
];

function cell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function bodyHtml(description: string, story: string): string {
  return `<p>${description}</p>` + `<p><strong>Om denna vintage-pärla:</strong> ${story}</p>`;
}

const rows: string[] = [COLUMNS.join(",")];

for (const product of MOCK_PRODUCTS) {
  const type = CATEGORY_TITLES[product.collections[0]] ?? "";
  const tags = [...product.tags, ...product.collections].join(", ");
  const hasOptions = product.options.length > 0;
  const optionName = hasOptions ? product.options[0].name : "Title";

  product.variants.forEach((variant, index) => {
    const isFirst = index === 0;
    const optionValue = hasOptions
      ? (variant.selectedOptions[0]?.value ?? variant.title)
      : "Default Title";

    const row = [
      product.handle,
      isFirst ? product.title : "",
      isFirst ? bodyHtml(product.description, product.vintageBlurb) : "",
      isFirst ? "Fyndlådan" : "",
      isFirst ? type : "",
      isFirst ? tags : "",
      isFirst ? "TRUE" : "",
      isFirst ? optionName : "",
      optionValue,
      // SKU: readable, unique per variant.
      hasOptions ? `${product.handle}-${optionValue.toLowerCase()}` : product.handle,
      String(variant.quantityAvailable),
      "deny",
      "manual",
      Number(variant.price.amount).toFixed(2),
      variant.compareAtPrice ? Number(variant.compareAtPrice.amount).toFixed(2) : "",
      "TRUE",
      "TRUE",
      // Image Src intentionally blank — see shopify/README.md.
      "",
      isFirst ? "1" : "",
      isFirst ? product.title : "",
      isFirst ? "active" : "",
    ];
    rows.push(row.map(cell).join(","));
  });
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, rows.join("\n") + "\n", "utf8");
console.log(`Wrote ${OUT_FILE} (${MOCK_PRODUCTS.length} products)`);
