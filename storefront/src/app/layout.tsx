import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Condensed } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Newsletter from "@/components/home/Newsletter";
import SmoothScrollProvider from "@/components/ui/SmoothScrollProvider";
import RegistrationPopup from "@/components/ui/RegistrationPopup";
// import AiChatFab from "@/components/ui/AiChatFab"; // TODO: re-enable when ready
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";

const YM_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

const plexSans = IBM_Plex_Sans({
  variable: "--font-barlow",
  subsets: ["latin", "cyrillic-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plexSansCondensed = IBM_Plex_Sans_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin", "cyrillic-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://endmarket.ru"),
  title: {
    default: "ENDMARKET — Кондиционеры Ballu, Haier, Hisense, Daikin",
    template: "%s — ENDMARKET",
  },
  description:
    "Интернет-магазин кондиционеров и сплит-систем. Ballu, Haier, Hisense — официальный дистрибьютор. Доставка по России. Монтаж в Москве и МО.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://endmarket.ru",
    siteName: "ENDMARKET",
    title: "ENDMARKET — Кондиционеры Ballu, Haier, Hisense, Daikin",
    description:
      "Официальный дистрибьютор кондиционеров. Гарантия производителя. Доставка по России.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ENDMARKET — Кондиционеры",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ENDMARKET — Кондиционеры Ballu, Haier, Hisense, Daikin",
    description: "Официальный дистрибьютор. Гарантия производителя. Доставка по России.",
    images: [
      "/og-image.jpg",
    ],
  },
  robots: { index: true, follow: true },
  keywords: [
    "кондиционер", "сплит-система", "инвертор",
    "Ballu", "Haier", "Hisense", "Daikin",
    "купить кондиционер Москва", "монтаж кондиционера",
    "официальный дистрибьютор кондиционеров",
    "кондиционер с установкой", "сплит-система инверторная",
    "бесплатный замер кондиционера", "ENDMARKET",
    "endmarket.ru",
  ],
  alternates: { canonical: "https://endmarket.ru" },
  category: "Климатическая техника",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://endmarket.ru/#organization",
        name: "ENDMARKET",
        url: "https://endmarket.ru",
        logo: "https://endmarket.ru/og-image.jpg",
        description:
          "Официальный дистрибьютор кондиционеров Ballu, Haier, Hisense и Daikin в России. Продажа, доставка и монтаж климатической техники в Москве и МО. Гарантия производителя.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Москва",
          addressCountry: "RU",
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: "support@endmarket.ru",
          contactType: "customer service",
          availableLanguage: "Russian",
        },
        sameAs: [
          "https://t.me/endmarket",
          "https://endmarket.ru/about",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Кондиционеры и сплит-системы",
          itemListElement: [
            { "@type": "OfferCatalog", name: "Ballu" },
            { "@type": "OfferCatalog", name: "Haier" },
            { "@type": "OfferCatalog", name: "Hisense" },
            { "@type": "OfferCatalog", name: "Daikin" },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://endmarket.ru/#website",
        url: "https://endmarket.ru",
        name: "ENDMARKET",
        description: "Интернет-магазин кондиционеров — официальный дистрибьютор Ballu, Haier, Hisense, Daikin",
        publisher: { "@id": "https://endmarket.ru/#organization" },
        inLanguage: "ru-RU",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://endmarket.ru/collection?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://endmarket.ru/#localbusiness",
        name: "ENDMARKET",
        url: "https://endmarket.ru",
        telephone: "+7-800-000-0000",
        priceRange: "₽₽",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Москва",
          addressRegion: "Москва",
          addressCountry: "RU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 55.7558,
          longitude: 37.6176,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "20:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Saturday"],
            opens: "10:00",
            closes: "18:00",
          },
        ],
        currenciesAccepted: "RUB",
        paymentAccepted: "Карта, наличные",
        areaServed: ["Москва", "Московская область", "Россия"],
        makesOffer: [
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Кондиционер Ballu" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Кондиционер Haier" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Кондиционер Hisense" } },
          { "@type": "Offer", itemOffered: { "@type": "Product", name: "Кондиционер Daikin" } },
        ],
      },
    ],
  };

  return (
    <html
      lang="ru"
      className={`${plexSans.variable} ${plexSansCondensed.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <CartProvider>
          <WishlistProvider>
            <SmoothScrollProvider>
              <Navigation />
              <main>{children}</main>
              <Newsletter />
              <Footer />
              <RegistrationPopup />
              {/* <AiChatFab /> */}
            </SmoothScrollProvider>
          </WishlistProvider>
        </CartProvider>

        {/* Yandex Metrica — loads after interactive, no render blocking */}
        {YM_ID && (
          <Script id="ym-init" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${YM_ID},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true});`}
          </Script>
        )}
      </body>
    </html>
  );
}
