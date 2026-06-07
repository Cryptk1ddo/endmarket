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
  intro: string[];
  stats: { label: string; value: string }[];
  heroSlug: string;
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
      "Серия BSW — рабочая лошадь рынка: тихая, надёжная, с прозрачной сервисной сетью по всей России. Серия BSWI Ultra добавляет Wi-Fi, расширенный температурный диапазон и класс A++.",
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
      "Haier — крупнейший производитель бытовой техники в мире по версии Euromonitor International с 2009 года. Основан в 1984 году в Цинтао как небольшой завод холодильников, сегодня производит климатическое оборудование для 160 стран.",
      "Серия TT4HRA — флагманский настенный инвертор с самоочисткой испарителя UV Nano и встроенным Wi-Fi. Серия QM2HIA предлагает класс A+++ при рекордном КПД.",
    ],
    stats: [
      { label: "Основан", value: "1984" },
      { label: "Стран", value: "160+" },
      { label: "Хладагент", value: "R-32" },
      { label: "Класс КПД", value: "A+++" },
    ],
    heroSlug: "haier-as12tt4hra",
    models: ["haier-ab48s2sd1fa","haier-ac36cs1era","haier-as07qm2hia","haier-as07tt4hra","haier-as09qm2hia","haier-as09tt4hra","haier-as12qm2hia","haier-as12tt4hra","haier-as18qm2hia","haier-as18tt4hra"].map(s => ({ slug: s, name: toModelName(s, "haier") })),
  },
  {
    id: "hisense", name: "Hisense", origin: "Циндао, Китай", founded: "1969",
    tagline: "Тишина как инженерная ценность",
    intro: [
      "Hisense основан в 1969 году и прошёл путь от государственного завода радиооборудования до глобального технологического концерна. Уровень шума серии HR4SYDKG — от 17 дБ, что сопоставимо с шелестом листьев.",
      "Серия QC4SVETG4 ориентирована на энергоэффективность — класс A+++ с SEER до 8.5. Кассетные системы UR4SXCDG закрывают коммерческий сегмент.",
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
      "Daikin основан в 1924 году в Осаке. Компания — единственный в мире производитель климатической техники, самостоятельно выпускающий компрессоры, хладагенты, электронику и холодильные контуры. Вертикальная интеграция — факт производственной истории.",
      "Технология Flash Streamer ионизирует воздух, разрушая аллергены и летучие соединения. Серия FTXB — вход в японское качество, FTXF — флагман с обогревом при −20 °C.",
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

const INK = "#080808";
const MUTED = "#6e6e66";
const FAINT = "#a8a8a2";
const LINE = "rgba(0,0,0,0.1)";
const BARLOW = "var(--font-barlow)";
const COND = "var(--font-barlow-condensed)";

export default function BrandsPage() {
  const totalModels = BRANDS.reduce((n, b) => n + b.models.length, 0);

  return (
    <div style={{ backgroundColor: "#f4f4f1", color: INK, fontFamily: BARLOW }}>
      <div style={{ height: "72px" }} />

      <div className="br-wrap">
        {/* Hero */}
        <section style={{ paddingTop: "clamp(3rem, 9vw, 6rem)", paddingBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          <p style={{ fontSize: "1.0625rem", color: FAINT, marginBottom: "1.25rem" }}>
            Официальные партнёры · {BRANDS.length} бренда · {totalModels} моделей
          </p>
          <h1 style={{ fontSize: "clamp(3rem, 10vw, 6.5rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 0.95, margin: 0 }}>
            Бренды
          </h1>
          <p style={{ fontSize: "1.0625rem", lineHeight: 1.6, color: MUTED, maxWidth: "36rem", marginTop: "1.75rem" }}>
            Четыре инженерные школы — российская, китайская, японская — с официальной гарантией, доставкой и сертифицированным монтажом.
          </p>
        </section>

        {/* Brand index */}
        <nav style={{ paddingBottom: "clamp(2rem, 5vw, 3.5rem)" }}>
          {BRANDS.map((b) => (
            <a key={b.id} href={`#${b.id}`} className="br-index" style={{ borderTop: `1px solid ${LINE}`, color: INK, textDecoration: "none" }}>
              <span style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>{b.name}</span>
              <span style={{ fontSize: "0.95rem", color: FAINT }}>{b.origin}</span>
              <span style={{ fontSize: "0.95rem", color: MUTED, justifySelf: "end" }}>{b.models.length} моделей →</span>
            </a>
          ))}
          <div style={{ borderTop: `1px solid ${LINE}` }} />
        </nav>
      </div>

      {/* Brand sections */}
      {BRANDS.map((brand, i) => (
        <section key={brand.id} id={brand.id} style={{ borderTop: `1px solid ${LINE}`, scrollMarginTop: "80px" }}>
          <div className="br-wrap" style={{ paddingTop: "clamp(3rem, 7vw, 5.5rem)", paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
            <div className={`br-editorial ${i % 2 ? "br-rev" : ""}`}>
              {/* Media */}
              <div className="br-media">
                <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", backgroundColor: "#e7e6e1" }}>
                  <Image
                    src={`/generated/ac-campaigns/${brand.heroSlug}/b-lifestyle-interior.webp`}
                    alt={brand.name}
                    fill
                    className="br-hero-img"
                    unoptimized
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: "cover", filter: "grayscale(8%) contrast(1.03)", transition: "transform 1.4s ease" }}
                    priority={i === 0}
                  />
                </div>
              </div>

              {/* Text */}
              <div className="br-text">
                <p style={{ fontSize: "1rem", color: FAINT, marginBottom: "0.85rem" }}>{brand.origin} · осн. {brand.founded}</p>
                <h2 style={{ fontSize: "clamp(2.75rem, 7vw, 4.5rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 0.95, margin: "0 0 1.25rem" }}>
                  {brand.name}
                </h2>
                <p style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.6rem)", fontWeight: 400, lineHeight: 1.3, letterSpacing: "-0.01em", color: INK, margin: "0 0 1.75rem", maxWidth: "32rem" }}>
                  {brand.tagline}
                </p>
                {brand.intro.map((para, p) => (
                  <p key={p} style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: MUTED, margin: "0 0 1rem", maxWidth: "34rem" }}>{para}</p>
                ))}

                {/* Stats */}
                <div className="br-stats" style={{ marginTop: "2rem", borderTop: `1px solid ${LINE}`, paddingTop: "1.5rem" }}>
                  {brand.stats.map((s) => (
                    <div key={s.label}>
                      <p style={{ fontSize: "0.8125rem", color: FAINT, margin: "0 0 0.35rem" }}>{s.label}</p>
                      <p style={{ fontFamily: COND, fontSize: "1.5rem", fontWeight: 700, color: INK, margin: 0 }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/collection?brand=${brand.name}`}
                  style={{ display: "inline-block", marginTop: "2rem", backgroundColor: INK, color: "#f4f4f1", fontSize: "0.95rem", fontWeight: 600, letterSpacing: "0.02em", textDecoration: "none", padding: "0.95rem 2rem" }}
                >
                  Каталог {brand.name} →
                </Link>
              </div>
            </div>
          </div>

          {/* Model grid */}
          <div className="br-wrap" style={{ paddingBottom: "clamp(3rem, 7vw, 5.5rem)" }}>
            <p style={{ fontSize: "0.95rem", color: FAINT, margin: "0 0 1.25rem" }}>Модели в каталоге · {brand.models.length}</p>
            <div className="br-models">
              {brand.models.map((model) => (
                <Link key={model.slug} href={`/product/${model.slug}`} className="br-card" style={{ display: "block", textDecoration: "none", backgroundColor: "#f4f4f1" }}>
                  <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#e7e6e1" }}>
                    <Image
                      src={`/generated/ac-campaigns/${model.slug}/a-studio-hero.webp`}
                      alt={`${brand.name} ${model.name}`}
                      fill
                      className="br-card-img"
                      unoptimized
                      sizes="(max-width: 560px) 50vw, 20vw"
                      style={{ objectFit: "cover", filter: "grayscale(12%) contrast(1.03)", transition: "transform 0.8s ease, filter 0.4s ease" }}
                    />
                  </div>
                  <div style={{ padding: "0.9rem 1rem 1.1rem" }}>
                    <p style={{ fontSize: "0.8125rem", color: FAINT, margin: "0 0 0.25rem" }}>{brand.name}</p>
                    <p style={{ fontFamily: COND, fontSize: "1.0625rem", fontWeight: 700, letterSpacing: "0.02em", color: INK, margin: 0 }}>{model.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Closing CTA */}
      <section style={{ borderTop: `1px solid ${LINE}` }}>
        <div className="br-wrap" style={{ paddingTop: "clamp(3.5rem, 8vw, 6rem)", paddingBottom: "clamp(4rem, 9vw, 7rem)", textAlign: "center" }}>
          <p style={{ fontSize: "1.0625rem", color: FAINT, marginBottom: "1.25rem" }}>Подбор оборудования</p>
          <h2 style={{ fontSize: "clamp(2.25rem, 6vw, 4rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1, margin: "0 0 2rem" }}>
            {totalModels} моделей. Один выбор.
          </h2>
          <Link
            href="/collection"
            style={{ display: "inline-block", backgroundColor: INK, color: "#f4f4f1", fontSize: "0.95rem", fontWeight: 600, letterSpacing: "0.02em", textDecoration: "none", padding: "1.1rem 3rem" }}
          >
            Смотреть коллекцию →
          </Link>
        </div>
      </section>

      <style>{`
        .br-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding-left: clamp(1.5rem, 5vw, 3rem);
          padding-right: clamp(1.5rem, 5vw, 3rem);
        }
        .br-index {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 1.5rem;
          align-items: baseline;
          padding: 1.5rem 0;
          transition: opacity 0.2s ease;
        }
        .br-index:hover { opacity: 0.55; }
        .br-editorial {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
        }
        .br-rev .br-media { order: 2; }
        .br-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        .br-models {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1px;
          background: ${LINE};
          border: 1px solid ${LINE};
        }
        .br-hero-img:hover { transform: scale(1.03); }
        .br-card:hover .br-card-img { transform: scale(1.05); filter: grayscale(0%) contrast(1.05) !important; }
        @media (max-width: 900px) {
          .br-editorial { grid-template-columns: 1fr; }
          .br-rev .br-media { order: 0; }
          .br-models { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 560px) {
          .br-index { grid-template-columns: 1fr auto; }
          .br-index > :nth-child(2) { display: none; }
          .br-stats { grid-template-columns: repeat(2, 1fr); }
          .br-models { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
