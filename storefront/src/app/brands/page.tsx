import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Бренды — ENDMARKET",
  description: "Кондиционеры Ballu, Haier, Hisense, Daikin. Официальные поставки, монтаж, гарантия.",
};

interface ModelEntry { slug: string; name: string; }
interface BrandEntry {
  id: string; name: string; origin: string; founded: string;
  tagline: string;
  intro: string[];        // editorial paragraphs
  stats: { label: string; value: string }[];
  heroSlug: string;       // model slug to pull b-lifestyle-interior from
  models: ModelEntry[];
}

function toModelName(slug: string, brand: string): string {
  return slug.replace(`${brand}-`, "").toUpperCase();
}

const BRANDS: BrandEntry[] = [
  {
    id: "ballu", name: "Ballu", origin: "Россия / Китай", founded: "1997",
    tagline: "Климатическая техника для реальной жизни",
    intro: [
      "Ballu — один из немногих брендов, сочетающих российскую сборочную историю с производственной базой в Китае. С 1997 года компания последовательно расширяет присутствие: от бюджетных on/off-агрегатов до инверторных серий с обогревом при −25 °C.",
      "Серия BSW — рабочая лошадь рынка: тихая, надёжная, с прозрачной сервисной сетью по всей России. Серия BSWI Ultra добавляет Wi-Fi, расширенный температурный диапазон и класс A++. Для встраиваемых решений — кассетные BLC и напольно-потолочные BLD."
    ],
    stats: [
      { label: "Основан", value: "1997" },
      { label: "Серий", value: "4" },
      { label: "Хладагент", value: "R-32" },
      { label: "Обогрев до", value: "−25 °C" },
    ],
    heroSlug: "ballu-bsw-12hn1",
    models: ["ballu-blc-07hn1","ballu-bld-09hn1","ballu-bsw-07hn1","ballu-bsw-09hn1","ballu-bsw-12hn1","ballu-bsw-18hn1","ballu-bswi-09hn1","ballu-bswi-12hn1","ballu-bswi-18hn1","ballu-bswi-24hn1"].map(s => ({ slug: s, name: toModelName(s, "ballu") })),
  },
  {
    id: "haier", name: "Haier", origin: "Цинтао, Китай", founded: "1984",
    tagline: "Мировой лидер. Технологии без компромиссов",
    intro: [
      "Haier — крупнейший производитель бытовой техники в мире по версии Euromonitor International с 2009 по сей день. Основан в 1984 году в Цинтао как небольшой завод холодильников, сегодня производит климатическое оборудование для 160 стран.",
      "Серия TT4HRA — флагманский настенный инвертор с технологией самоочистки испарителя UV Nano, режимом Self-Clean и встроенным Wi-Fi. Серия QM2HIA предлагает класс A+++ при рекордном КПД. Кассетные и канальные системы Haier проектируются под коммерческие объекты."
    ],
    stats: [
      { label: "Основан", value: "1984" },
      { label: "Стран присутствия", value: "160+" },
      { label: "Хладагент", value: "R-32 / R-410A" },
      { label: "Класс КПД", value: "A+++" },
    ],
    heroSlug: "haier-as12tt4hra",
    models: ["haier-ab48s2sd1fa","haier-ac36cs1era","haier-as07qm2hia","haier-as07tt4hra","haier-as09qm2hia","haier-as09tt4hra","haier-as12qm2hia","haier-as12tt4hra","haier-as18qm2hia","haier-as18tt4hra"].map(s => ({ slug: s, name: toModelName(s, "haier") })),
  },
  {
    id: "hisense", name: "Hisense", origin: "Циндао, Китай", founded: "1969",
    tagline: "Тишина как инженерная ценность",
    intro: [
      "Hisense основан в 1969 году и прошёл путь от государственного завода радиооборудования до глобального технологического концерна. Сегодня компания активно инвестирует в акустические технологии: уровень шума серии HR4SYDKG — от 17 дБ, что сопоставимо с шелестом листьев.",
      "Серия QC4SVETG4 ориентирована на энергоэффективность — класс A+++ с SEER до 8.5. Кассетные системы UR4SXCDG закрывают коммерческий сегмент: равномерный воздухораспределитель 4 × 360° и встроенный дренажный насос."
    ],
    stats: [
      { label: "Основан", value: "1969" },
      { label: "Мин. шум", value: "17 дБ" },
      { label: "Хладагент", value: "R-32" },
      { label: "Макс. SEER", value: "8.5" },
    ],
    heroSlug: "hisense-as12hr4sydkg",
    models: ["hisense-as07hr4sydkg","hisense-as07qc4svetg4","hisense-as09hr4sydkg","hisense-as09qc4svetg4","hisense-as09ur4sxcdg","hisense-as12hr4sydkg","hisense-as12qc4svetg4","hisense-as12ur4sxcdg","hisense-as18hr4sydkg","hisense-as18qc4svetg4"].map(s => ({ slug: s, name: toModelName(s, "hisense") })),
  },
  {
    id: "daikin", name: "Daikin", origin: "Осака, Япония", founded: "1924",
    tagline: "Сто лет точности. Японская инженерная школа",
    intro: [
      "Daikin основан в 1924 году в Осаке инженером Акирой Ямадой. Компания — единственный в мире производитель климатической техники, самостоятельно выпускающий компрессоры, хладагенты, электронику и холодильные контуры. Вертикальная интеграция — не маркетинг, а факт производственной истории.",
      "Технология Flash Streamer ионизирует воздух электрическим разрядом, разрушая аллергены, вирусы и летучие органические соединения. Серия FTXB предлагает оптимальный вход в японское качество, FTXF — флагманская линейка с обогревом при −20 °C и управлением через Daikin Mobile Controller. Серии FHA и FBQ — премиальные канальные и кассетные системы."
    ],
    stats: [
      { label: "Основан", value: "1924" },
      { label: "R&D-центров", value: "15" },
      { label: "Хладагент", value: "R-32" },
      { label: "Обогрев до", value: "−20 °C" },
    ],
    heroSlug: "daikin-ftxf35d",
    models: ["daikin-fbq35d","daikin-fdxs25e","daikin-fha60a","daikin-ftxb20c","daikin-ftxb25c","daikin-ftxb35c","daikin-ftxb50c","daikin-ftxf25d","daikin-ftxf35d","daikin-ftxf50d"].map(s => ({ slug: s, name: toModelName(s, "daikin") })),
  },
];

export default function BrandsPage() {
  const totalModels = BRANDS.reduce((n, b) => n + b.models.length, 0);

  return (
    <>
      <div style={{ height: "64px" }} />

      {/* ── Page header ── */}
      <section style={{ padding: "4rem 2rem 3rem", borderBottom: "1px solid #e0ddd8" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.5625rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1rem" }}>
          ENDMARKET / ОФИЦИАЛЬНЫЕ ПАРТНЁРЫ — {BRANDS.length} БРЕНДА / {totalModels} МОДЕЛЕЙ
        </p>
        <h1 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(4rem, 10vw, 9rem)", fontWeight: 900, letterSpacing: "-0.01em", color: "#080808", lineHeight: 0.88, margin: 0 }}>
          БРЕНДЫ
        </h1>
      </section>

      {/* ── Brand sections ── */}
      {BRANDS.map((brand, bi) => (
        <section key={brand.id} style={{ borderBottom: "2px solid #080808" }}>

          {/* ── Brand editorial intro ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="brand-intro-grid">
            {/* Left: text */}
            <div style={{ padding: "4rem 3rem 4rem 2rem", borderRight: "1px solid #e0ddd8", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "3rem" }}>
              <div>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.5625rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1rem" }}>
                  {brand.origin} — осн. {brand.founded}
                </p>
                <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(4rem, 8vw, 7.5rem)", fontWeight: 900, letterSpacing: "-0.01em", color: "#080808", lineHeight: 0.85, margin: "0 0 2rem" }}>
                  {brand.name.toUpperCase()}
                </h2>
                <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(1rem, 2vw, 1.375rem)", fontWeight: 300, letterSpacing: "0.02em", color: "#6e6e66", lineHeight: 1.3, margin: "0 0 2.5rem", maxWidth: "520px" }}>
                  {brand.tagline}
                </p>
                {brand.intro.map((para, i) => (
                  <p key={i} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 300, color: "#6e6e66", lineHeight: 1.75, marginBottom: i < brand.intro.length - 1 ? "1.25rem" : 0, maxWidth: "540px" }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Stats row */}
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid #e0ddd8", paddingTop: "1.5rem", gap: "1rem" }} className="brand-stats-grid">
                  {brand.stats.map((s) => (
                    <div key={s.label}>
                      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.5rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "0.375rem" }}>{s.label}</p>
                      <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.25rem", fontWeight: 700, color: "#080808", margin: 0 }}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "2rem" }}>
                  <Link href={`/collection?brand=${brand.id}`} style={{ display: "inline-block", backgroundColor: "#080808", color: "#f8f8f6", fontFamily: "var(--font-barlow)", fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", padding: "0.875rem 2rem" }}>
                    Каталог {brand.name} →
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: lifestyle image */}
            <div style={{ position: "relative", minHeight: "560px", overflow: "hidden", backgroundColor: "#111" }}>
              <Image
                src={`/generated/ac-campaigns/${brand.heroSlug}/b-lifestyle-interior.webp`}
                alt={brand.name}
                fill
                className="brand-hero-img"
                unoptimized
                sizes="50vw"
                style={{ objectFit: "cover", filter: "grayscale(12%) contrast(1.06) brightness(0.82)", transition: "transform 1.4s ease" }}
                priority={bi === 0}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,8,8,0.35) 0%, transparent 60%)" }} />
              <p style={{ position: "absolute", right: "1.25rem", bottom: "1.25rem", margin: 0, fontFamily: "var(--font-barlow)", fontSize: "0.45rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(248,248,246,0.5)" }}>
                ENDMARKET / {brand.name.toUpperCase()} / EDITORIAL
              </p>
            </div>
          </div>

          {/* ── Model grid ── */}
          <div style={{ borderTop: "1px solid #e0ddd8" }}>
            <div style={{ padding: "1.25rem 2rem 1rem", borderBottom: "1px solid #e0ddd8" }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#a8a8a2", margin: 0 }}>
                {brand.name} — {brand.models.length} моделей в каталоге
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }} className="model-grid">
              {brand.models.map((model, mi) => (
                <Link
                  key={model.slug}
                  href={`/product/${model.slug}`}
                  className="model-card"
                  style={{
                    display: "block",
                    textDecoration: "none",
                    borderRight: mi % 5 !== 4 ? "1px solid #e0ddd8" : "none",
                    borderBottom: mi < brand.models.length - 5 ? "1px solid #e0ddd8" : "none",
                    overflow: "hidden",
                    backgroundColor: "#f0efec",
                  }}
                >
                  <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#e8e7e4" }}>
                    <Image
                      src={`/generated/ac-campaigns/${model.slug}/a-studio-hero.webp`}
                      alt={`${brand.name} ${model.name}`}
                      fill
                      className="model-img"
                      unoptimized
                      sizes="20vw"
                      style={{ objectFit: "cover", filter: "grayscale(15%) contrast(1.04)", transition: "transform 0.8s ease, filter 0.4s ease" }}
                    />
                  </div>
                  <div style={{ padding: "0.875rem 1rem 1rem" }}>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.5rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "0.25rem" }}>
                      {brand.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.04em", color: "#080808", margin: 0 }}>
                      {model.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── CTA ── */}
      <section style={{ backgroundColor: "#080808", padding: "5rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "2rem" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.5625rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#a8a8a2", margin: 0 }}>
          ENDMARKET / ПОДБОР ОБОРУДОВАНИЯ
        </p>
        <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 900, letterSpacing: "0.02em", color: "#f8f8f6", lineHeight: 0.92, margin: 0 }}>
          {totalModels} МОДЕЛЕЙ.<br />
          <span style={{ fontWeight: 300, color: "#6e6e66" }}>ОДИН ВЫБОР.</span>
        </h2>
        <Link href="/collection" style={{ display: "inline-block", backgroundColor: "#f8f8f6", color: "#080808", fontFamily: "var(--font-barlow)", fontSize: "0.5625rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", textDecoration: "none", padding: "1.125rem 3rem" }}>
          Смотреть коллекцию
        </Link>
      </section>

      <style>{`
        .brand-hero-img:hover { transform: scale(1.03); }
        .model-card:hover .model-img {
          transform: scale(1.06);
          filter: grayscale(0%) contrast(1.08) !important;
        }
        @media (max-width: 900px) {
          .brand-intro-grid { grid-template-columns: 1fr !important; }
          .brand-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .model-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .model-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
