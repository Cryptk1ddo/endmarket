import type { Metadata } from "next";
import { Suspense } from "react";
import CollectionClient from "@/components/collection/CollectionClient";
import { listProducts, adaptMedusaProduct } from "@/lib/medusa";
import { products as mockProducts, collections } from "@/lib/products";
import type { Product } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; brand?: string }>;
}): Promise<Metadata> {
  const { collection } = await searchParams;
  const label = collection && collections.includes(collection as never) ? collection : null;
  return {
    title: label
      ? `${label} — Кондиционеры ENDMARKET`
      : "Каталог — Кондиционеры Ballu, Haier, Hisense, Daikin",
    description:
      "Полный каталог кондиционеров ENDMARKET: настенные, мультисплит, кассетные, канальные. Официальный дистрибьютор.",
    openGraph: {
      title: label ? `${label} — ENDMARKET` : "Каталог — ENDMARKET",
      description:
        "Кондиционеры Ballu, Haier, Hisense, Daikin. Официальный дистрибьютор. Гарантия, доставка, монтаж.",
    },
  };
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const { products } = await listProducts({ limit: 100 });
    if (products.length > 0) return products.map(adaptMedusaProduct);
  } catch {
    // Medusa unavailable — use mock catalog
  }
  return mockProducts;
}

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; brand?: string }>;
}) {
  const [products, { collection, brand }] = await Promise.all([fetchProducts(), searchParams]);
  const initialCollection =
    collection && collections.includes(collection as never) ? collection : "";
  const initialBrand = brand ?? "";
  return (
    <Suspense fallback={<div style={{ minHeight: "100svh", backgroundColor: "#f3f3f1" }} />}>
      <CollectionClient
        initialProducts={products}
        initialCollection={initialCollection}
        initialBrand={initialBrand}
      />
    </Suspense>
  );
}
