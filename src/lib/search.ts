/**
 * Meilisearch instant-search client — public search key, client-safe
 * Index `products` is populated by medusa-plugin-meilisearch on the backend.
 */

const MEILI_URL =
  process.env.NEXT_PUBLIC_MEILISEARCH_URL || "http://localhost:7700";
const MEILI_KEY =
  process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || "";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SearchResult = {
  id: string;
  slug: string;
  name: string;
  collection: string;
  price: number;
  image: string;
};

const CATEGORY_TO_COLLECTION: Record<string, string> = {
  nastennye: "Настенные",
  multisplit: "Мультисплит",
  kassetnye: "Кассетные",
  kanalnye: "Канальные",
};

// ─── Adapter ──────────────────────────────────────────────────────────────────

type MeiliHit = {
  id?: unknown;
  handle?: unknown;
  title?: unknown;
  thumbnail?: unknown;
  metadata?: Record<string, string>;
  variants?: Array<{ prices?: Array<{ amount?: number }> }>;
};

function adaptHit(hit: MeiliHit): SearchResult {
  const meta = hit.metadata ?? {};
  const rawPrice = hit.variants?.[0]?.prices?.[0]?.amount ?? 0;
  return {
    id: String(hit.id ?? ""),
    slug: String(hit.handle ?? ""),
    name: String(hit.title ?? ""),
    collection: CATEGORY_TO_COLLECTION[meta.category ?? ""] ?? "Настенные",
    price: rawPrice / 100,
    image: String(hit.thumbnail ?? ""),
  };
}

// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * Searches the Meilisearch `products` index.
 * Returns `null` when Meilisearch is unreachable (caller should fall back to local data).
 */
export async function searchProducts(
  query: string,
  limit = 8
): Promise<SearchResult[] | null> {
  try {
    const res = await fetch(`${MEILI_URL}/indexes/products/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(MEILI_KEY ? { Authorization: `Bearer ${MEILI_KEY}` } : {}),
      },
      body: JSON.stringify({
        q: query,
        limit,
        attributesToRetrieve: [
          "id",
          "handle",
          "title",
          "thumbnail",
          "metadata",
          "variants",
        ],
      }),
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { hits: MeiliHit[] };
    return data.hits.map(adaptHit);
  } catch {
    return null;
  }
}
