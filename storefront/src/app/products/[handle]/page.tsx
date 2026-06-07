import { notFound } from "next/navigation"
import {
  formatProductPrice,
  getProductByHandle,
} from "@/lib/medusa/products"
import { normalizeImageUrl } from "@/lib/medusa/images"

export const dynamic = "force-dynamic"
export const revalidate = 0

type Props = {
  params: Promise<{ handle: string }>
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) notFound()

  const images =
    product.images?.length
      ? product.images.map((img) => ({
          url: normalizeImageUrl(img.url) || img.url,
        }))
      : product.thumbnail
        ? [{ url: normalizeImageUrl(product.thumbnail) || product.thumbnail }]
        : []

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <section className="grid gap-4">
        {images.length ? (
          images.map((image) => (
            <div key={image.url} className="overflow-hidden rounded-3xl bg-neutral-100">
              <img
                src={image.url}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
          ))
        ) : (
          <div className="flex aspect-square items-center justify-center rounded-3xl bg-neutral-100 text-neutral-400">
            No image
          </div>
        )}
      </section>

      <section>
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Product
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          {product.title}
        </h1>

        <p className="mt-5 text-2xl font-semibold">
          {formatProductPrice(product)}
        </p>

        {product.description && (
          <p className="mt-8 whitespace-pre-line text-base leading-8 text-neutral-700">
            {product.description}
          </p>
        )}
      </section>
    </main>
  )
}
