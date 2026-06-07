import { normalizeImageUrl } from "./images"
import { medusaFetch } from "./client"

export type MedusaProduct = {
  id: string
  title: string
  handle: string
  description?: string | null
  thumbnail?: string | null
  images?: Array<{ id?: string; url: string }>
  variants?: Array<{
    id: string
    title: string
    sku?: string | null
    calculated_price?: {
      calculated_amount?: number
      currency_code?: string
    }
    prices?: Array<{
      amount: number
      currency_code: string
    }>
  }>
}

export async function getProducts() {
  return medusaFetch<{
    products: MedusaProduct[]
    count: number
  }>("/store/products?limit=100&currency_code=rub", {
    cache: "no-store",
  })
}

export async function getProductByHandle(handle: string) {
  const data = await medusaFetch<{ products: MedusaProduct[] }>(
    `/store/products?handle=${encodeURIComponent(handle)}&limit=1&currency_code=rub`,
    {
      cache: "no-store",
    }
  )

  return data.products[0] || null
}

export function formatProductPrice(product: MedusaProduct) {
  const variant = product.variants?.[0]

  const calculated = variant?.calculated_price?.calculated_amount

  if (typeof calculated === "number") {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(calculated)
  }

  const price = variant?.prices?.find((p) => p.currency_code === "rub")

  if (price) {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price.amount)
  }

  return "Цена по запросу"
}
