import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PROMPT_PACK_PATH = path.join(ROOT, "ALL_AC_PROMPT_PACKS.txt");
const PRODUCTS_PATH = path.join(ROOT, "src/lib/products.ts");
const OUT_PATH = path.join(ROOT, "public/generated/ac-campaigns/image-generation-queue.json");

const VARIANTS = [
  ["a-studio-hero", "3. Prompt A", "4. Prompt B"],
  ["b-lifestyle-interior", "4. Prompt B", "5. Prompt C"],
  ["c-exterior-weather", "5. Prompt C", "6. Prompt D"],
  ["d-product-card-bento", "6. Prompt D", "7. Prompt E"],
];

function slugMapFromProducts(source) {
  const map = new Map();
  const productBlocks = source.split(/\n\s*\{\n/g);

  for (const block of productBlocks) {
    const id = block.match(/id:\s*"([^"]+)"/)?.[1];
    const name = block.match(/name:\s*"([^"]+)"/)?.[1];
    if (id && name) map.set(name, id);
  }

  return map;
}

function splitPromptPacks(source) {
  const chunks = source.split(/^#{80}\n/m).map((chunk) => chunk.trim()).filter(Boolean);
  const entries = [];

  for (let index = 0; index < chunks.length; index += 2) {
    const name = chunks[index];
    const body = chunks[index + 1] ?? "";
    if (body.includes("PRODUCT IMAGE PROMPT SYSTEM OUTPUT")) {
      entries.push({ name, body });
    }
  }

  return entries;
}

function section(source, start, end) {
  const startIndex = source.indexOf(start);
  if (startIndex === -1) return "";

  const bodyStart = source.indexOf("\n", startIndex);
  const endIndex = end ? source.indexOf(end, bodyStart) : source.length;
  return source.slice(bodyStart + 1, endIndex === -1 ? source.length : endIndex).trim();
}

function copyField(source, label) {
  const match = source.match(new RegExp(`${label}:\\s*([^\\n]+(?:\\n(?![A-ZА-Яa-zа-я0-9 ].*:|\\d+\\. |Bento cards:)[^\\n]+)*)`, "u"));
  return match?.[1].trim() ?? "";
}

function bentoCards(source) {
  const block = section(source, "Bento cards:", "3. Prompt A").trim();
  return block.replace(/\n{2,}/g, "; ").replace(/\n/g, " — ");
}

function productDesign(promptA) {
  const marker = "Show the product design accurately:";
  const start = promptA.indexOf(marker);
  if (start === -1) return "";

  const after = promptA.slice(start + marker.length).trim();
  return after.split(/\n\s*\n/)[0].trim();
}

function universalNegative(source) {
  return section(source, "8. Universal Negative Prompt", "9. Notes for Better Results");
}

function normalizedPrompt(prompt, negative) {
  return [
    "Use case: ads-marketing",
    "Asset type: vertical campaign image for a Next.js/Medusa product gallery",
    "Primary request:",
    prompt,
    "",
    "Keep the visual polished enough for production catalog/campaign review.",
    "Important text note: render typography cleanly; if exact Cyrillic text cannot be rendered perfectly, keep text areas clean and minimally distorted.",
    "",
    `Negative prompt: ${negative}`,
  ].join("\n");
}

function fallbackEditorialPrompt(entry, promptA, negative) {
  const brand = entry.name.split(" ")[0];
  const headline = copyField(entry.body, "Editorial headline") || copyField(entry.body, "Control headline");
  const bodyCopy = copyField(entry.body, "Body copy");
  const productLabel = copyField(entry.body, "Product label").replace(/\s*\|\s*/g, "\n");
  const design = productDesign(promptA);
  const cards = bentoCards(entry.body);

  return normalizedPrompt(
    [
      `Create a premium vertical editorial technical advertisement for ${entry.name}.`,
      "",
      "Core idea: controlled climate performance, realistic installation, and quiet technical trust. Do not imply smart-home or voice assistant support.",
      "",
      "Scene:",
      "Use a refined architectural studio or premium installed environment with matte charcoal surfaces, soft shadows, clean technical lighting, and generous negative space. The image should feel premium, calm, engineered, and credible.",
      "",
      "Show the product accurately:",
      design,
      "",
      `Top-left: ${brand} logo only once.`,
      "",
      "Headline:",
      headline,
      "",
      "Body:",
      bodyCopy,
      "",
      "Compact feature row:",
      cards,
      "",
      "Product label:",
      productLabel,
      "",
      "Aspect ratio: 3:4",
      "Quality: photorealistic, ultra-detailed, premium commercial HVAC campaign.",
    ].join("\n"),
    negative,
  );
}

function buildQueue() {
  const productsSource = fs.readFileSync(PRODUCTS_PATH, "utf8");
  const promptSource = fs.readFileSync(PROMPT_PACK_PATH, "utf8");
  const slugByName = slugMapFromProducts(productsSource);
  const entries = splitPromptPacks(promptSource);
  const queue = [];

  for (const entry of entries) {
    const slug = slugByName.get(entry.name);
    if (!slug) throw new Error(`Could not find product slug for "${entry.name}"`);

    const negative = universalNegative(entry.body);
    const promptA = section(entry.body, "3. Prompt A", "4. Prompt B");

    for (const [variant, start, end] of VARIANTS) {
      queue.push({
        productName: entry.name,
        slug,
        variant,
        outputPath: `/generated/ac-campaigns/${slug}/${variant}.png`,
        prompt: normalizedPrompt(section(entry.body, start, end), negative),
      });
    }

    const promptE = section(entry.body, "7. Prompt E", "8. Universal Negative Prompt");
    const eIsRecommended = promptE && !/Not recommended/i.test(promptE);
    const eVariant = eIsRecommended ? "e-smart-home" : "e-editorial-detail";
    const ePrompt = eIsRecommended
      ? normalizedPrompt(promptE, negative)
      : fallbackEditorialPrompt(entry, promptA, negative);

    queue.push({
      productName: entry.name,
      slug,
      variant: eVariant,
      outputPath: `/generated/ac-campaigns/${slug}/${eVariant}.png`,
      prompt: ePrompt,
    });
  }

  return queue;
}

const queue = buildQueue();
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });

for (const item of queue) {
  fs.mkdirSync(path.join(ROOT, "public", path.dirname(item.outputPath)), { recursive: true });
}

fs.writeFileSync(
  OUT_PATH,
  `${JSON.stringify({
    source: "ALL_AC_PROMPT_PACKS.txt",
    generatedAt: new Date().toISOString(),
    count: queue.length,
    outputRoot: "/generated/ac-campaigns",
    items: queue,
  }, null, 2)}\n`,
);

console.log(`Wrote ${queue.length} image-generation prompts to ${path.relative(ROOT, OUT_PATH)}`);
