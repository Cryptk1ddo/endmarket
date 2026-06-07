import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/lib/products";
import { getProduct, adaptMedusaProduct, listProducts } from "@/lib/medusa";
import type { Product } from "@/lib/products";
import ProductDetail from "@/components/product/ProductDetail";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

async function resolveProduct(slug: string): Promise<Product | null> {
  try {
    const medusaProduct = await getProduct(slug);
    if (medusaProduct) return adaptMedusaProduct(medusaProduct);

    const { products: medusaProducts } = await listProducts({ limit: 200 });
    const matched = medusaProducts.find((product: { handle?: string }) => product.handle === slug);
    if (matched) return adaptMedusaProduct(matched);
  } catch {
    // Medusa unavailable
  }
  return getProductBySlug(slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProduct(slug);
  if (!product) return { title: "Объект не найден" };
  return {
    title: `${product.name} — ${product.subtitle}`,
    description: product.longDescription,
    keywords: [product.name, product.brand ?? "", "кондиционер", "сплит-система", "купить", "ENDMARKET", "endmarket.ru"],
    openGraph: {
      title: `${product.name} — ENDMARKET`,
      description: product.description,
      images: product.image ? [{ url: product.image, width: 900, height: 900, alt: product.name }] : [],
      type: "website",
      locale: "ru_RU",
      siteName: "ENDMARKET",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ENDMARKET`,
      description: product.description,
      images: product.image ? [product.image] : [],
    },
    alternates: { canonical: `https://endmarket.ru/product/${slug}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await resolveProduct(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://endmarket.ru/product/${slug}#product`,
        name: product.name,
        description: product.longDescription,
        image: product.image,
        sku: `EM-${product.id}`,
        brand: { "@type": "Brand", name: product.brand ?? "ENDMARKET" },
        category: "Кондиционеры и сплит-системы",
        manufacturer: { "@type": "Organization", name: product.brand ?? "ENDMARKET" },
        offers: {
          "@type": "Offer",
          "@id": `https://endmarket.ru/product/${slug}#offer`,
          url: `https://endmarket.ru/product/${slug}`,
          price: product.price,
          priceCurrency: "RUB",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            .toISOString()
            .split("T")[0],
          seller: {
            "@type": "Organization",
            "@id": "https://endmarket.ru/#organization",
            name: "ENDMARKET",
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "RU",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 14,
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "RU",
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              businessDays: { "@type": "QuantitativeValue", minValue: 1, maxValue: 7 },
            },
          },
        },
        additionalProperty: product.specs?.map((s) => ({
          "@type": "PropertyValue",
          name: s.label,
          value: s.value,
        })) ?? [],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: "https://endmarket.ru" },
          { "@type": "ListItem", position: 2, name: "Каталог", item: "https://endmarket.ru/collection" },
          { "@type": "ListItem", position: 3, name: product.name, item: `https://endmarket.ru/product/${slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Сколько стоит ${product.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${product.name} стоит ₽${product.price.toLocaleString("ru-RU")} в интернет-магазине ENDMARKET. Цена включает НДС. Доставка по России.`,
            },
          },
          {
            "@type": "Question",
            name: `Как купить ${product.name} с установкой?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Добавьте ${product.name} в корзину на endmarket.ru и при оформлении выберите услугу монтажа. Наши сертифицированные бригады работают в Москве и МО. Бесплатный замер при регистрации.`,
            },
          },
          {
            "@type": "Question",
            name: `Какая гарантия на ${product.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `На ${product.name} предоставляется официальная гарантия производителя ${product.brand ?? ""} — 24 месяца. ENDMARKET — официальный авторизованный дистрибьютор.`,
            },
          },
          {
            "@type": "Question",
            name: `Сколько стоит доставка ${product.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Доставка ${product.name} по Москве — курьером за 1–2 дня. По России — СДЭК/Boxberry за 3–7 рабочих дней. Условия уточняются при оформлении заказа.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
