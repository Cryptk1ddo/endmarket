import Image from "next/image";
import Link from "next/link";
import { products, getFeaturedProducts } from "@/lib/products";
import ProductShowcase from "@/components/home/ProductShowcase";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import Manifesto from "@/components/home/Manifesto";
import InspirationGallery from "@/components/home/InspirationGallery";
import ProductFilter from "@/components/home/ProductFilter";
import EditorialPanels from "@/components/home/EditorialPanels";

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      <style>{`
        .banner-img { transition: transform 1.5s ease-out; }
        .hero-banner:hover .banner-img { transform: scale(1.04); }
        .metrics-strip { flex-wrap: wrap; row-gap: 0.65rem; }
        @media (max-width: 640px) {
          .hero-section { grid-template-columns: 1fr !important; }
          .promo-bar { grid-template-columns: 1fr !important; }
          .metrics-strip { padding: 0.875rem 1.25rem !important; }
        }
      `}</style>

      {/* Offset for fixed nav */}
      <div style={{ height: "72px" }} />

      {/* ── Promo Bar ── */}
      <div
        className="promo-bar"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          fontSize: "0.6875rem",
          letterSpacing: "0.14em",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          lineHeight: 1.5,
          textTransform: "uppercase",
        }}
      >
        <div style={{ backgroundColor: "#f3f3f1", color: "#6e6e66", padding: "0.625rem 1.5rem", textAlign: "center", borderBottom: "1px solid #e0ddd8", borderRight: "1px solid #e0ddd8" }}>
          Ballu, Haier, Hisense — официальный дистрибьютор |{"\ "}
          <Link href="/collection" style={{ color: "#080808", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Смотреть каталог
          </Link>
        </div>
        <div style={{ backgroundColor: "#eaeae8", color: "#6e6e66", padding: "0.625rem 1.5rem", textAlign: "center", borderBottom: "1px solid #e0ddd8" }}>
          Доставка по всей России — 1–7 дней |{"\ "}
          <Link href="/delivery" style={{ color: "#080808", textDecoration: "underline", textUnderlineOffset: "3px" }}>
            Подробнее
          </Link>
        </div>
      </div>

      {/* ── Hero: Split Banners ── */}
      <section
        className="hero-section"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", backgroundColor: "#e0ddd8" }}
      >
        <Link href="/collection?collection=Настенные" className="hero-banner" style={{ position: "relative", display: "block", height: "clamp(400px, 70vh, 800px)", overflow: "hidden", backgroundColor: "#1a1a1a" }}>
          <Image
            src="/heroimages/splitsystems.png"
            alt="Сплит-системы"
            fill
            sizes="50vw"
            className="banner-img"
            style={{ objectFit: "cover", objectPosition: "center top", filter: "brightness(0.75)" }}
            priority
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />
          <div style={{ position: "absolute", bottom: "2.5rem", left: "clamp(1.5rem, 4vw, 2.5rem)", right: "1.5rem" }}>
            <p style={{ margin: "0 0 0.875rem", fontFamily: "var(--font-body)", fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(243,243,241,0.72)" }}>
              ENDMARKET / WALL SYSTEMS
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", color: "#f8f8f6", lineHeight: 0.86, margin: 0 }}>
              <span style={{ display: "block", fontSize: "clamp(3.4rem, 6vw, 6.8rem)", fontWeight: 700, letterSpacing: "-0.05em" }}>Сплит</span>
              <span style={{ display: "block", fontSize: "clamp(3.4rem, 6vw, 6.8rem)", fontWeight: 300, letterSpacing: "-0.05em", color: "#c7c7c5" }}>системы</span>
            </h2>
            <p style={{ maxWidth: "20rem", margin: "0.875rem 0 0", fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 400, lineHeight: 1.5, color: "rgba(243,243,241,0.82)" }}>
              Тихие инверторные серии для спальни, кабинета и жилых пространств с монтажом под ключ.
            </p>
          </div>
        </Link>

        <Link href="/collection?collection=Кассетные" className="hero-banner" style={{ position: "relative", display: "block", height: "clamp(400px, 70vh, 800px)", overflow: "hidden", backgroundColor: "#1a1a1a" }}>
          <Image
            src="/heroimages/mutlisplitsystems.png"
            alt="Кассетные системы"
            fill
            sizes="50vw"
            className="banner-img"
            style={{ objectFit: "cover", objectPosition: "center", filter: "brightness(0.7)" }}
            priority
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }} />
          <div style={{ position: "absolute", bottom: "2.5rem", left: "clamp(1.5rem, 4vw, 2.5rem)", right: "1.5rem" }}>
            <p style={{ margin: "0 0 0.875rem", fontFamily: "var(--font-body)", fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(243,243,241,0.72)" }}>
              ENDMARKET / COMMERCIAL SYSTEMS
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", color: "#f8f8f6", lineHeight: 0.86, margin: 0 }}>
              <span style={{ display: "block", fontSize: "clamp(3.4rem, 6vw, 6.8rem)", fontWeight: 700, letterSpacing: "-0.05em" }}>Кассетные</span>
              <span style={{ display: "block", fontSize: "clamp(3.4rem, 6vw, 6.8rem)", fontWeight: 300, letterSpacing: "-0.05em", color: "#c7c7c5" }}>системы</span>
            </h2>
            <p style={{ maxWidth: "21rem", margin: "0.875rem 0 0", fontFamily: "var(--font-body)", fontSize: "0.8125rem", fontWeight: 400, lineHeight: 1.5, color: "rgba(243,243,241,0.82)" }}>
              Решения для шоурумов, офисов и открытых залов, где важны чистая геометрия и равномерный поток воздуха.
            </p>
          </div>
        </Link>
      </section>

      {/* ── Brand metrics strip ── */}
      <div className="metrics-strip" style={{ display: "flex", alignItems: "center", padding: "1rem 2rem", borderBottom: "1px solid #e0ddd8", backgroundColor: "#f8f8f6" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0", fontFamily: "var(--font-body)", fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8f8f88" }}>
          {["4 БРЕНДА", "12 МОДЕЛЕЙ", "ОФИЦИАЛЬНЫЙ ДИСТРИБЬЮТОР", "ГАРАНТИЯ ПРОИЗВОДИТЕЛЯ"].map((stat, i) => (
            <span key={stat} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {i > 0 && <span style={{ margin: "0 1rem", opacity: 0.4 }}>·</span>}
              {stat}
            </span>
          ))}
        </div>
      </div>

      {/* ── Featured Products ── */}
      <ProductShowcase featured={featured} />

      {/* ── Collections ── */}
      <FeaturedCollections products={products} />

      {/* ── Manifesto ── */}
      <Manifesto />

      {/* ── Editorial Panels: Brands + Blog ── */}
      <EditorialPanels />

      {/* ── Inspiration Gallery ── */}
      <InspirationGallery />

      {/* ── Product Filter (client island) ── */}
      <ProductFilter products={products} />
    </>
  );
}
