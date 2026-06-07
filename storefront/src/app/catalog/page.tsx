import Link from "next/link"
import {
  formatProductPrice,
  getProducts,
} from "@/lib/medusa/products"
import { normalizeImageUrl } from "@/lib/medusa/images"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function CatalogPage() {
  const { products } = await getProducts()

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Catalog
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-neutral-950">
          Каталог
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 p-10 text-center">
          <h2 className="text-lg font-medium">Нет опубликованных товаров</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Проверь: Published, Sales Channel, Variant, RUB price.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const image = normalizeImageUrl(
              product.thumbnail || product.images?.[0]?.url
            )

            return (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
                  {image ? (
                    <img
                      src={image}
                      alt={product.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="line-clamp-2 text-base font-semibold">
                    {product.title}
                  </h2>
                  <p className="mt-4 font-semibold">
                    {formatProductPrice(product)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
