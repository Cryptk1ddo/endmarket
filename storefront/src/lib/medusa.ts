/**
 * Medusa v2 JS SDK client — singleton for server and client use
 * Docs: https://docs.medusajs.com/js-sdk
 */

import Medusa from "@medusajs/js-sdk"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://api.endmarket.ru"
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export const medusa = new Medusa({
  baseUrl: BACKEND_URL,
  publishableKey: PUBLISHABLE_KEY,
  auth: {
    type: "session",
  },
})

// ─── Product helpers ──────────────────────────────────────────────────────────

export async function listProducts(options?: {
  limit?: number
  offset?: number
  category_id?: string[]
  fields?: string
}) {
  const { products, count } = await medusa.store.product.list({
    limit: options?.limit ?? 12,
    offset: options?.offset ?? 0,
    ...(options?.category_id ? { category_id: options.category_id } : {}),
    fields: options?.fields ?? "id,title,handle,description,thumbnail,metadata,*variants,*variants.prices,*categories",
  })
  return { products, count }
}

export async function getProduct(handle: string) {
  const { products } = await medusa.store.product.list({
    handle,
    fields: "*variants,*categories,*variants.prices",
  })
  return products[0] ?? null
}

export async function listCategories() {
  const { product_categories } = await medusa.store.category.list({
    fields: "id,name,handle,description,parent_category_id",
  })
  return product_categories
}

// ─── Cart helpers ─────────────────────────────────────────────────────────────

export async function createCart(regionId: string) {
  const { cart } = await medusa.store.cart.create({ region_id: regionId })
  return cart
}

export async function getCart(cartId: string) {
  const { cart } = await medusa.store.cart.retrieve(cartId)
  return cart
}

export async function addToCart(cartId: string, variantId: string, quantity = 1) {
  const { cart } = await medusa.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
  })
  return cart
}

export async function updateCartItem(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  const { cart } = await medusa.store.cart.updateLineItem(cartId, lineItemId, {
    quantity,
  })
  return cart
}

export async function removeCartItem(cartId: string, lineItemId: string) {
  const { cart } = await medusa.store.cart.deleteLineItem(cartId, lineItemId)
  return cart
}

// ─── Region helpers ───────────────────────────────────────────────────────────

export async function getRegions() {
  const { regions } = await medusa.store.region.list()
  return regions
}

export async function getRegionByCountry(countryCode: string) {
  const regions = await getRegions()
  return regions.find((r: { countries?: { iso_2: string }[] }) =>
    r.countries?.some((c) => c.iso_2 === countryCode.toLowerCase())
  ) ?? regions[0]
}

// ─── Adapter: Medusa product → frontend Product ───────────────────────────────

import type { Product } from "@/lib/products"
import { products as mockProducts } from "@/lib/products"

const CATEGORY_TO_COLLECTION: Record<string, Product["collection"]> = {
  "nastennye": "Настенные",
  "multisplit": "Настенные",
  "kassetnye": "Кассетные",
  "kanalnye": "Канальные",
  "napolno-potolochnye": "Напольно-потолочные",
}

// Lazy-built handle → mock map for image fallback
const mockByHandle = Object.fromEntries(mockProducts.map((p) => [p.slug, p]))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptMedusaProduct(p: any): Product {
  const mock = mockByHandle[p.handle as string]
  const categoryHandle = p.categories?.[0]?.handle ?? ""
  const rawPrice = p.variants?.[0]?.prices?.[0]?.amount ?? 0
  const price = rawPrice / 100

  return {
    id: p.id,
    slug: p.handle,
    name: p.title,
    subtitle: p.metadata?.subtitle ?? mock?.subtitle ?? "",
    collection: CATEGORY_TO_COLLECTION[categoryHandle] ?? mock?.collection ?? "Настенные",
    price,
    material: p.metadata?.material ?? mock?.material ?? "",
    finish: p.metadata?.finish ?? mock?.finish ?? "",
    description: p.description ?? mock?.description ?? "",
    longDescription: p.metadata?.longDescription ?? mock?.longDescription ?? p.description ?? "",
    specs: (() => {
      try { return p.metadata?.specs ? JSON.parse(String(p.metadata.specs)) : (mock?.specs ?? []) }
      catch { return mock?.specs ?? [] }
    })(),
    imageSeed: p.metadata?.imageSeed ?? mock?.imageSeed ?? p.handle,
    image: p.thumbnail ?? mock?.image ?? "",
    images: p.images?.length ? p.images.map((i: { url: string }) => i.url) : (mock?.images ?? []),
    featured: p.metadata?.featured === "true" || mock?.featured === true,
    brand: (p.metadata?.brand as Product["brand"]) ?? mock?.brand ?? "Ballu",
  }
}
