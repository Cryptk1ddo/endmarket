import fs from "fs"
import path from "path"

import type { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

type HardcodedProduct = {
  id?: string
  slug?: string
  handle?: string
  name?: string
  title?: string
  subtitle?: string
  collection?: string
  brand?: string
  price?: number
  material?: string
  finish?: string
  description?: string
  longDescription?: string
  specs?: unknown
  image?: unknown
  images?: unknown[]
  featured?: boolean
  sku?: string
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
}

function getImageUrl(value: unknown): string | null {
  if (!value) return null

  if (typeof value === "string") {
    return value
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "src" in value &&
    typeof (value as { src?: unknown }).src === "string"
  ) {
    return (value as { src: string }).src
  }

  return null
}

function toPublicImageUrl(value: unknown): string | null {
  const raw = getImageUrl(value)

  if (!raw) return null

  const clean = raw.trim()

  if (!clean) return null

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean
  }

  if (clean.startsWith("/")) {
    return `https://endmarket.ru${clean}`
  }

  return null
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

function getImages(product: HardcodedProduct) {
  const urls = [
    toPublicImageUrl(product.image),
    ...(Array.isArray(product.images)
      ? product.images.map((image) => toPublicImageUrl(image))
      : []),
  ].filter(Boolean) as string[]

  return unique(urls).map((url) => ({ url }))
}

function getPriceAmount(product: HardcodedProduct) {
  const price = Number(product.price || 0)

  if (!Number.isFinite(price) || price <= 0) {
    return null
  }

  // Legacy storefront prices are in RUB major units.
  // Medusa price amount is stored in minor units.
  return Math.round(price * 100)
}

export default async function importHardcodedProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const productModuleService = container.resolve(Modules.PRODUCT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)

  const jsonPath = path.join(
    process.cwd(),
    "src/scripts/hardcoded-products.json"
  )

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Missing JSON file: ${jsonPath}`)
  }

  const hardcodedProducts = JSON.parse(
    fs.readFileSync(jsonPath, "utf-8")
  ) as HardcodedProduct[]

  logger.info(`Found ${hardcodedProducts.length} hardcoded products`)

  const salesChannels = await salesChannelModuleService.listSalesChannels({})

  const defaultSalesChannel =
    salesChannels.find((channel) => channel.name === "Default Sales Channel") ||
    salesChannels[0]

  if (!defaultSalesChannel) {
    throw new Error("No sales channel found. Create Default Sales Channel first.")
  }

  const productsToCreate = []

  for (const item of hardcodedProducts) {
    const title = item.title || item.name

    if (!title) {
      logger.warn(`Skipping product without title/name: ${JSON.stringify(item)}`)
      continue
    }

    const handle = item.handle || item.slug || slugify(title)

    const existing = await productModuleService.listProducts({
      handle,
    })

    if (existing.length > 0) {
      logger.info(`Skipping existing product: ${handle}`)
      continue
    }

    const images = getImages(item)
    const priceAmount = getPriceAmount(item)

    productsToCreate.push({
      title,
      handle,
      subtitle: item.subtitle || undefined,
      description: item.longDescription || item.description || undefined,
      status: "published",
      is_giftcard: false,
      thumbnail: images[0]?.url,
      images,
      options: [
        {
          title: "Default",
          values: ["Default"],
        },
      ],
      variants: [
        {
          title: "Default",
          sku: item.sku || `EM-${handle}`.toUpperCase(),
          manage_inventory: false,
          allow_backorder: true,
          options: {
            Default: "Default",
          },
          prices: priceAmount
            ? [
                {
                  amount: priceAmount,
                  currency_code: "rub",
                },
              ]
            : [],
        },
      ],
      sales_channels: [
        {
          id: defaultSalesChannel.id,
        },
      ],
      metadata: {
        legacy_id: item.id || null,
        legacy_slug: item.slug || null,
        collection: item.collection || null,
        brand: item.brand || null,
        material: item.material || null,
        finish: item.finish || null,
        specs: item.specs ? JSON.stringify(item.specs) : null,
        featured: item.featured ? "true" : "false",
        imported_from: "hardcoded_storefront",
      },
    })
  }

  if (productsToCreate.length === 0) {
    logger.info("Nothing to import. All products already exist.")
    return
  }

  logger.info(`Creating ${productsToCreate.length} products in Medusa`)

  await createProductsWorkflow(container).run({
    input: {
      products: productsToCreate,
    },
  })

  logger.info("Hardcoded products imported successfully")
}
