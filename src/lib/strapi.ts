/**
 * Strapi v5 fetch client — read-only, uses API token for ISR pages
 */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ""

type StrapiMeta = {
  pagination: { page: number; pageSize: number; pageCount: number; total: number }
}

type StrapiResponse<T> = { data: T; meta: StrapiMeta }

async function strapiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean>,
  revalidate?: number
): Promise<T> {
  const url = new URL(`/api${path}`, STRAPI_URL)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: revalidate ?? 60 },
  })

  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${url.toString()}`)
  }

  return res.json() as Promise<T>
}

// ─── Brands ───────────────────────────────────────────────────────────────────

export type StrapiBrand = {
  id: number
  name: string
  slug: string
  origin: string
  tagline: string
  description: string
  longDescription: string
  featured: boolean
  sortOrder: number
  websiteUrl: string
  foundedYear: number
  designPhilosophy: string
  logo: { url: string; alternativeText: string } | null
  coverImage: { url: string; alternativeText: string } | null
  gallery: Array<{ url: string; alternativeText: string }>
}

export async function getBrands(featuredOnly = false) {
  const params: Record<string, string | number | boolean> = {
    "populate": "logo,coverImage",
    "sort": "sortOrder:asc",
    "pagination[pageSize]": 50,
  }
  if (featuredOnly) {
    params["filters[featured][$eq]"] = true
  }
  const res = await strapiGet<StrapiResponse<StrapiBrand[]>>("/brands", params)
  return res.data
}

export async function getBrand(slug: string) {
  const res = await strapiGet<StrapiResponse<StrapiBrand[]>>("/brands", {
    "filters[slug][$eq]": slug,
    "populate": "logo,coverImage,gallery",
  })
  return res.data[0] ?? null
}

// ─── Homepage Sections ────────────────────────────────────────────────────────

export type StrapiHomepageSection = {
  id: number
  type: string
  title: string
  subtitle: string
  body: string
  ctaLabel: string
  ctaUrl: string
  active: boolean
  sortOrder: number
  metadata: Record<string, unknown>
  image: { url: string; alternativeText: string } | null
  images: Array<{ url: string; alternativeText: string }>
}

export async function getHomepageSections() {
  const res = await strapiGet<StrapiResponse<StrapiHomepageSection[]>>(
    "/homepage-sections",
    {
      "filters[active][$eq]": true,
      "sort": "sortOrder:asc",
      "populate": "image,images",
      "pagination[pageSize]": 20,
    }
  )
  return res.data
}

// ─── Editorials ───────────────────────────────────────────────────────────────

export type StrapiEditorial = {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  body: string
  featured: boolean
  author: string
  tags: string[]
  relatedMedusaProductHandles: string[]
  coverImage: { url: string; alternativeText: string } | null
  gallery: Array<{ url: string; alternativeText: string }>
  publishedAt: string
}

export async function getEditorials(options?: {
  limit?: number
  category?: string
  featuredOnly?: boolean
}) {
  const params: Record<string, string | number | boolean> = {
    "populate": "coverImage",
    "sort": "publishedAt:desc",
    "pagination[pageSize]": options?.limit ?? 10,
  }
  if (options?.category) {
    params["filters[category][$eq]"] = options.category
  }
  if (options?.featuredOnly) {
    params["filters[featured][$eq]"] = true
  }
  const res = await strapiGet<StrapiResponse<StrapiEditorial[]>>("/editorials", params)
  return res.data
}

export async function getEditorial(slug: string) {
  const res = await strapiGet<StrapiResponse<StrapiEditorial[]>>("/editorials", {
    "filters[slug][$eq]": slug,
    "populate": "coverImage,gallery",
  })
  return res.data[0] ?? null
}
