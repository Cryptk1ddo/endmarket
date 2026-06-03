#!/usr/bin/env node
/**
 * index-products.mjs — Push all 12 products to Meilisearch
 * Usage: node src/scripts/index-products.mjs
 * Env: NEXT_PUBLIC_MEILISEARCH_URL, MEILI_MASTER_KEY
 */

const HOST = process.env.NEXT_PUBLIC_MEILISEARCH_URL || "http://localhost:7700";
const KEY  = process.env.MEILI_MASTER_KEY || "artwater_meili_dev";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${KEY}`,
};

// ─── Product data (mirrors src/lib/products.ts) ───────────────────────────────
const B = "https://www.ballu.ru/upload/iblock";
const H = "/products";

const products = [
  // ── Ballu ────────────────────────────────────────────────────────────────────
  {
    id: "ballu-bsw-07hn1", slug: "ballu-bsw-07hn1",
    name: "Ballu Olympio Legend BSW-07HN1", brand: "Ballu",
    collection: "Настенные", subtitle: "Настенный кондиционер, 7 BTU (20 м²)",
    description: "7 BTU, инвертор, класс A+, бесшумная работа от 22 дБ.",
    price: 28900, featured: true,
    image: `${B}/6d7/6d7e79901427efb6916f180d569c6f4d.jpg`,
  },
  {
    id: "ballu-bsw-09hn1", slug: "ballu-bsw-09hn1",
    name: "Ballu Olympio Legend BSW-09HN1", brand: "Ballu",
    collection: "Настенные", subtitle: "Настенный кондиционер, 9 BTU (25 м²)",
    description: "9 BTU, инвертор, обогрев до −15 °C, Wi-Fi.",
    price: 32900, featured: true,
    image: `${B}/385/38505626050f5d6184c7dabcecc5c142.jpg`,
  },
  {
    id: "ballu-bsw-12hn1", slug: "ballu-bsw-12hn1",
    name: "Ballu Olympio Legend BSW-12HN1", brand: "Ballu",
    collection: "Настенные", subtitle: "Настенный кондиционер, 12 BTU (35 м²)",
    description: "12 BTU, инвертор, 3-скоростной обдув, класс A++.",
    price: 38900, featured: false,
    image: `${B}/256/256449567bdd04bf3ae390dc6690a3d3.jpg`,
  },
  {
    id: "ballu-bsw-18hn1", slug: "ballu-bsw-18hn1",
    name: "Ballu Olympio Legend BSW-18HN1", brand: "Ballu",
    collection: "Настенные", subtitle: "Настенный кондиционер, 18 BTU (50 м²)",
    description: "18 BTU, инвертор, ночной режим, фильтр PM 2.5.",
    price: 51900, featured: false,
    image: `${B}/32b/32b802d367599a5d1eac0a6616df5cca.jpg`,
  },
  // ── Haier ────────────────────────────────────────────────────────────────────
  {
    id: "haier-as07tt4hra", slug: "haier-as07tt4hra",
    name: "Haier Tundra AS07TT4HRA", brand: "Haier",
    collection: "Мультисплит", subtitle: "Инверторный сплит, 7 BTU (20 м²)",
    description: "7 BTU, DC инвертор, обогрев до −25 °C, самоочистка.",
    price: 31900, featured: true,
    image: `${H}/haier-1.jpg`,
  },
  {
    id: "haier-as09tt4hra", slug: "haier-as09tt4hra",
    name: "Haier Tundra AS09TT4HRA", brand: "Haier",
    collection: "Мультисплит", subtitle: "Инверторный сплит, 9 BTU (25 м²)",
    description: "9 BTU, DC инвертор, ночной режим, класс A+.",
    price: 35900, featured: false,
    image: `${H}/haier-1.jpg`,
  },
  {
    id: "haier-as12tt4hra", slug: "haier-as12tt4hra",
    name: "Haier Tundra AS12TT4HRA", brand: "Haier",
    collection: "Мультисплит", subtitle: "Инверторный сплит, 12 BTU (35 м²)",
    description: "12 BTU, DC инвертор, Wi-Fi модуль, класс A++.",
    price: 43900, featured: false,
    image: `${H}/haier-1.jpg`,
  },
  {
    id: "haier-as18tt4hra", slug: "haier-as18tt4hra",
    name: "Haier Tundra AS18TT4HRA", brand: "Haier",
    collection: "Мультисплит", subtitle: "Инверторный сплит, 18 BTU (50 м²)",
    description: "18 BTU, DC инвертор, фильтр холодной плазмы.",
    price: 58900, featured: false,
    image: `${H}/haier-1.jpg`,
  },
  // ── Hisense ──────────────────────────────────────────────────────────────────
  {
    id: "hisense-as07hr4sydkg", slug: "hisense-as07hr4sydkg",
    name: "Hisense Crystal AS-07HR4SYDKG", brand: "Hisense",
    collection: "Кассетные", subtitle: "Кассетный кондиционер, 7 BTU (20 м²)",
    description: "7 BTU, инвертор, обогрев до −15 °C, фильтр PM 2.5.",
    price: 29900, featured: true,
    image: `${H}/hisense-1.jpg`,
  },
  {
    id: "hisense-as09hr4sydkg", slug: "hisense-as09hr4sydkg",
    name: "Hisense Crystal AS-09HR4SYDKG", brand: "Hisense",
    collection: "Кассетные", subtitle: "Кассетный кондиционер, 9 BTU (25 м²)",
    description: "9 BTU, инвертор, Wi-Fi, автоочистка испарителя.",
    price: 34900, featured: false,
    image: `${H}/hisense-1.jpg`,
  },
  {
    id: "hisense-as12hr4sydkg", slug: "hisense-as12hr4sydkg",
    name: "Hisense Crystal AS-12HR4SYDKG", brand: "Hisense",
    collection: "Кассетные", subtitle: "Кассетный кондиционер, 12 BTU (35 м²)",
    description: "12 BTU, инвертор, класс A+, фильтр PM 2.5.",
    price: 40900, featured: false,
    image: `${H}/hisense-1.jpg`,
  },
  {
    id: "hisense-as18hr4sydkg", slug: "hisense-as18hr4sydkg",
    name: "Hisense Crystal AS-18HR4SYDKG", brand: "Hisense",
    collection: "Канальные", subtitle: "Канальный кондиционер, 18 BTU (50 м²)",
    description: "18 BTU, инвертор, Auto-Clean, голосовое управление.",
    price: 56900, featured: false,
    image: `${H}/hisense-1.jpg`,
  },
];

async function req(method, path, body) {
  const r = await fetch(`${HOST}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return r.json();
}

async function waitForTask(taskUid) {
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 300));
    const task = await req("GET", `/tasks/${taskUid}`);
    if (task.status === "succeeded") return true;
    if (task.status === "failed") { console.error("Task failed:", task.error); return false; }
  }
  return false;
}

async function main() {
  console.log(`\nConnecting to Meilisearch at ${HOST}…`);

  // Health check
  const health = await req("GET", "/health").catch(() => null);
  if (!health?.status) {
    console.error("❌ Meilisearch not reachable. Start it first:");
    console.error("   meilisearch --master-key=artwater_meili_dev");
    process.exit(1);
  }
  console.log("✅ Meilisearch connected");

  // Create index (ignore if exists)
  const idx = await req("POST", "/indexes", { uid: "products", primaryKey: "id" });
  if (idx.taskUid) await waitForTask(idx.taskUid);

  // Configure settings
  const settings = await req("PATCH", "/indexes/products/settings", {
    searchableAttributes: ["name", "brand", "description", "subtitle", "collection"],
    filterableAttributes: ["brand", "collection", "featured"],
    sortableAttributes: ["price", "name"],
    rankingRules: ["words", "typo", "proximity", "attribute", "sort", "exactness"],
  });
  await waitForTask(settings.taskUid);
  console.log("✅ Index settings configured");

  // Index documents
  const docsTask = await req("POST", "/indexes/products/documents", products);
  const ok = await waitForTask(docsTask.taskUid);
  if (ok) {
    console.log(`✅ Indexed ${products.length} products`);
    console.log("\nTest a search:");
    const result = await req("POST", "/indexes/products/search", { q: "ballu", limit: 3 });
    result.hits?.forEach(h => console.log(`  - ${h.name} (${h.price} ₽)`));
  }

  // Generate search-only key
  const keys = await req("GET", "/keys");
  const existingKey = keys.results?.find(k => k.name === "Search-Only Key");
  if (!existingKey) {
    const newKey = await req("POST", "/keys", {
      name: "Search-Only Key",
      description: "Frontend read-only search key",
      actions: ["search"],
      indexes: ["products"],
      expiresAt: null,
    });
    if (newKey.key) {
      console.log(`\n🔑 Search-only key generated:`);
      console.log(`   NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY=${newKey.key}`);
      console.log("   Add this to your .env file\n");
    }
  } else {
    console.log(`\n🔑 Existing search key: ${existingKey.key.slice(0, 20)}…`);
  }
}

main().catch(e => { console.error("Error:", e.message); process.exit(1); });
