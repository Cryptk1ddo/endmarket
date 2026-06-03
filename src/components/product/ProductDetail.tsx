"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { collectionLabels, getProductsByCollection } from "@/lib/products";
import { Heart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

type Tab = "specs" | "materials" | "care";

const TAB_LABELS: Record<Tab, string> = {
  specs: "Характеристики",
  materials: "Комплектация",
  care: "Обслуживание",
};

export default function ProductDetail({ product }: { product: Product }) {
  const [tab, setTab] = useState<Tab>("specs");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [arOpen, setArOpen] = useState(false);
  const { add } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const images = product.images ?? [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div style={{ minHeight: "100svh", backgroundColor: "#f8f8f6", paddingTop: "64px" }}>
      {/* Breadcrumb */}
      <div
        style={{
          padding: "0.875rem 1.25rem",
          borderBottom: "1px solid #e0ddd8",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Главная", href: "/" },
          { label: "Каталог", href: "/collection" },
          {
            label: collectionLabels[product.collection] ?? product.collection,
            href: `/collection?collection=${encodeURIComponent(product.collection)}`,
          },
          { label: product.name, href: null },
        ].map((crumb, i) => (
          <span key={crumb.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {i > 0 && (
              <span style={{ color: "#a8a8a2", fontSize: "0.6875rem" }}>/</span>
            )}
            {crumb.href ? (
              <Link
                href={crumb.href}
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  color: "#6e6e66",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#080808")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6e6e66")}
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.08em",
                  color: "#080808",
                }}
              >
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Main grid */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "start" }}
        className="product-detail-grid"
      >
        {/* Left: Images */}
        <div style={{ borderRight: "1px solid #e0ddd8" }}>

          {/* ── Desktop: full vertical stack, no crop ── */}
          <div className="pdp-gallery-desktop">
            {images.map((src, n) => (
              <div
                key={n}
                style={{
                  borderBottom: "1px solid #e0ddd8",
                  backgroundColor: "#f0f0ee",
                  height: "100svh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Image
                  src={src}
                  alt={n === 0 ? product.name : ""}
                  width={0}
                  height={0}
                  sizes="50vw"
                  style={{ height: "100%", width: "auto", maxWidth: "100%", display: "block" }}
                  priority={n === 0}
                />
              </div>
            ))}
            <button
              onClick={() => setArOpen(true)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.625rem",
                padding: "0.875rem 1.5rem",
                backgroundColor: "transparent",
                border: "none",
                borderTop: "1px solid #e0ddd8",
                cursor: "pointer",
                fontFamily: "var(--font-barlow)",
                fontSize: "0.625rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#080808",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#080808"; e.currentTarget.style.color = "#f8f8f6"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#080808"; }}
              aria-label="AR — примерить в интерьере"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
              AR — Примерить в интерьере
            </button>
          </div>

          {/* ── Mobile: single image + thumbnail strip ── */}
          <div className="pdp-gallery-mobile">
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#0a0a0a",
                aspectRatio: "3/4",
              }}
            >
              <Image
                src={images[activeImg]}
                alt={product.name}
                fill
                sizes="100vw"
                style={{ objectFit: "contain", filter: "grayscale(12%) contrast(1.03)" }}
                priority
                loading="eager"
              />

            </div>
            <button
              onClick={() => setArOpen(true)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.625rem",
                padding: "0.875rem 1.5rem",
                backgroundColor: "transparent",
                border: "none",
                borderTop: "1px solid #e0ddd8",
                cursor: "pointer",
                fontFamily: "var(--font-barlow)",
                fontSize: "0.625rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#080808",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#080808"; e.currentTarget.style.color = "#f8f8f6"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#080808"; }}
              aria-label="AR — примерить в интерьере"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
              AR — Примерить в интерьере
            </button>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                borderTop: "1px solid #e0ddd8",
              }}
            >
              {images.map((src, n) => (
                <button
                  key={n}
                  onClick={() => setActiveImg(n)}
                  style={{
                    position: "relative",
                    aspectRatio: "1/1",
                    backgroundColor: "#0a0a0a",
                    border: "none",
                    borderRight: (n + 1) % 4 !== 0 ? "1px solid #1a1a1a" : "none",
                    borderBottom: n < images.length - 4 ? "1px solid #1a1a1a" : "none",
                    cursor: "pointer",
                    padding: 0,
                    outline: activeImg === n ? "2px solid #f8f8f6" : "none",
                    outlineOffset: "-2px",
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="25vw"
                    style={{ objectFit: "contain", filter: "grayscale(18%)" }}
                  />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Info */}
        <div
          className="pdp-info-panel"
          style={{
            position: "sticky",
            top: "64px",
            alignSelf: "start",
            padding: "2.5rem 2rem 3rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.75rem",
          }}
        >
          {/* Header */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-barlow)",
                fontSize: "0.6875rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#a8a8a2",
                marginBottom: "0.75rem",
              }}
            >
              {collectionLabels[product.collection] ?? product.collection}
            </p>
            <h1
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontSize: "clamp(2.5rem, 5vw, 5rem)",
                fontWeight: 900,
                lineHeight: 0.88,
                letterSpacing: "-0.01em",
                color: "#080808",
                marginBottom: "0.625rem",
              }}
            >
              {product.name}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-barlow)",
                fontSize: "0.8125rem",
                fontWeight: 300,
                color: "#6e6e66",
              }}
            >
              {product.subtitle}
            </p>
          </div>

          {/* Price */}
          <div
            style={{
              borderTop: "1px solid #e0ddd8",
              borderBottom: "1px solid #e0ddd8",
              padding: "1.25rem 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.625rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontSize: "2.25rem",
                  fontWeight: 700,
                  color: "#080808",
                }}
              >
                ₽{product.price.toLocaleString()}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.6875rem",
                  fontWeight: 300,
                  color: "#a8a8a2",
                  letterSpacing: "0.06em",
                }}
              >
                вкл. НДС
              </span>
              <button
                onClick={() => toggle(product)}
                style={{ marginLeft: "auto", background: "none", border: "1px solid #e0ddd8", width: "2.25rem", height: "2.25rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                aria-label={isWishlisted(product.id) ? "Убрать из избранного" : "Добавить в избранное"}
              >
                <Heart size={16} fill={isWishlisted(product.id) ? "#080808" : "none"} color="#080808" strokeWidth={1.5} />
              </button>
            </div>
            <p
              style={{
                fontFamily: "var(--font-barlow)",
                fontSize: "0.6875rem",
                fontWeight: 300,
                color: "#a8a8a2",
                marginTop: "0.25rem",
              }}
            >
              В наличии · Доставка 1–7 дней
            </p>
          </div>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.875rem",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "#6e6e66",
            }}
          >
            {product.longDescription}
          </p>

          {/* Qty + Add to cart */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{ display: "flex", border: "1px solid #e0ddd8" }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{
                  width: "44px",
                  height: "52px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "1.125rem",
                  color: "#080808",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                −
              </button>
              <span
                style={{
                  width: "44px",
                  height: "52px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.9375rem",
                  color: "#080808",
                  borderLeft: "1px solid #e0ddd8",
                  borderRight: "1px solid #e0ddd8",
                }}
              >
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                style={{
                  width: "44px",
                  height: "52px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "1.125rem",
                  color: "#080808",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              style={{
                flex: 1,
                height: "52px",
                backgroundColor: added ? "#2d6a3f" : "#080808",
                color: "#f8f8f6",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-barlow)",
                fontSize: "0.6875rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                transition: "background-color 0.3s",
              }}
            >
              {added ? "✓ Добавлено в корзину" : "Добавить в корзину"}
            </button>
          </div>

          {/* Request quote CTA */}
          <div style={{ marginTop: "0.75rem" }}>
            <Link
              href={`/contact?product=${encodeURIComponent(product.slug)}`}
              style={{
                display: "block",
                textAlign: "center",
                padding: "0.875rem 1.5rem",
                border: "1px solid #d0cdc8",
                fontFamily: "var(--font-barlow)",
                fontSize: "0.6875rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#4a4a44",
                textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#080808"; e.currentTarget.style.color = "#080808"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d0cdc8"; e.currentTarget.style.color = "#4a4a44"; }}
            >
              Запросить расчёт
            </Link>
          </div>

          {/* Tabs */}
          <div>
            <div style={{ display: "flex", borderBottom: "1px solid #e0ddd8" }}>
              {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.6875rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: tab === t ? "#080808" : "#6e6e66",
                    fontWeight: tab === t ? 600 : 400,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.875rem 1.5rem 0.875rem 0",
                    borderBottom: tab === t ? "2px solid #080808" : "2px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  {TAB_LABELS[t]}
                </button>
              ))}
            </div>

            <div style={{ paddingTop: "1.25rem" }}>
              {tab === "specs" && (
                <div>
                  {product.specs.map((s) => (
                    <div
                      key={s.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        borderBottom: "1px solid #e0ddd8",
                        padding: "0.625rem 0",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-barlow)",
                          fontSize: "0.6875rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#a8a8a2",
                        }}
                      >
                        {s.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-barlow)",
                          fontSize: "0.8125rem",
                          fontWeight: 400,
                          color: "#080808",
                        }}
                      >
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "materials" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {[
                    { label: "Внутренний блок", value: "1 шт." },
                    { label: "Наружный блок", value: "1 шт." },
                    { label: "Пульт ДУ" },
                    { label: "Монтажная пластина" },
                    { label: "Межблочный кабель" },
                    { label: "Дренажная трубка" },
                    { label: "Термоизоляция" },
                    { label: "Инструкция и паспорт изделия" },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #e0ddd8", padding: "0.625rem 0" }}>
                      <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#a8a8a2" }}>{item.label}</span>
                      {item.value && <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", color: "#080808" }}>{item.value}</span>}
                    </div>
                  ))}
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 300, lineHeight: 1.8, color: "#6e6e66", marginTop: "0.5rem" }}>
                    Комплектация проверяется на заводе и в пункте выдачи. Гарантия производителя — {product.brand}.
                  </p>
                </div>
              )}

              {tab === "care" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {[
                    "Чистка фильтров — 1 раз в 2–3 месяца. Промывайте под теплой водой, дайте высохнуть и установите обратно.",
                    "Ежегодное ТО: проверка давления в системе, чистка теплообменника и дренажной ванны. Включено в цену пользователя.",
                    "Корпус внутреннего блока: протирайте мягкой влажной тканью. Не используйте абразивные средства.",
                    "Зимой: не отключайте прибор в период длительных морозов — режим обогрева поддерживает температуру внутреннего блока не ниже +5 °C.",
                    "При неисправности или нестандартном шуме — звоните в сервисный центр {product.brand}. Выезд специалиста в течение 24 часов.",
                ].map((text, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-barlow)",
                          fontSize: "0.625rem",
                          letterSpacing: "0.1em",
                          color: "#a8a8a2",
                          flexShrink: 0,
                          marginTop: "0.125rem",
                        }}
                      >
                        0{i + 1}
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--font-barlow)",
                          fontSize: "0.8125rem",
                          fontWeight: 300,
                          lineHeight: 1.7,
                          color: "#6e6e66",
                        }}
                        dangerouslySetInnerHTML={{ __html: text.replace("{product.brand}", product.brand) }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer links */}
          <div
            style={{
              borderTop: "1px solid #e0ddd8",
              paddingTop: "1.25rem",
              display: "flex",
              gap: "1.75rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Консультация", href: "mailto:support@endmarket.ru" },
              { label: "Весь каталог", href: "/collection" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#6e6e66",
                  textDecoration: "none",
                  borderBottom: "1px solid #e0ddd8",
                  paddingBottom: "2px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#080808")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6e6e66")}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {(() => {
        const related = getProductsByCollection(product.collection)
          .filter((p) => p.id !== product.id)
          .slice(0, 4);
        if (related.length === 0) return null;
        return (
          <section style={{ borderTop: "1px solid #e0ddd8", padding: "3rem 2rem 4rem", backgroundColor: "#f8f8f6" }}>
            <div style={{ maxWidth: "1920px", margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
                <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(1.25rem, 3vw, 2rem)", fontWeight: 900, letterSpacing: "0.04em", color: "#080808", margin: 0 }}>
                  ИЗ ЭТОЙ КОЛЛЕКЦИИ
                </h2>
                <Link
                  href={`/collection?collection=${encodeURIComponent(product.collection)}`}
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#6e6e66", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#080808")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#6e6e66")}
                >
                  Смотреть все →
                </Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }} className="related-grid">
                {related.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/product/${rp.slug}`}
                    style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}
                    className="related-card"
                  >
                    <div style={{ position: "relative", aspectRatio: "3/4", backgroundColor: "#eaeae8", overflow: "hidden", marginBottom: "0.875rem" }}>
                      <Image
                        src={rp.image}
                        alt={rp.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        style={{ objectFit: "cover", filter: "grayscale(12%)", transition: "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)" }}
                        className="related-img"
                      />
                    </div>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 400, color: "#080808", margin: "0 0 0.25rem" }}>{rp.name}</p>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, color: "#6e6e66", margin: 0 }}>₽{rp.price.toLocaleString()}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* AR Modal */}
      {arOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AR — Примерить в интерьере"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            backgroundColor: "rgba(8,8,8,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setArOpen(false); }}
        >
          <div
            style={{
              backgroundColor: "#f8f8f6",
              maxWidth: "520px",
              width: "100%",
              padding: "3rem 2.5rem",
              position: "relative",
            }}
          >
            <button
              onClick={() => setArOpen(false)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#080808",
                fontSize: "1.25rem",
                lineHeight: 1,
                padding: "0.25rem",
              }}
              aria-label="Закрыть"
            >
              ×
            </button>

            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.5625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1.25rem" }}>
              ENDMARKET / AR-ВИЗУАЛИЗАЦИЯ
            </p>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.01em", color: "#080808", marginBottom: "1.5rem" }}>
              ПРИМЕРЬТЕ<br />В ВАШЕМ<br />ИНТЕРЬЕРЕ
            </h2>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.8, color: "#6e6e66", marginBottom: "2rem" }}>
              Наведите камеру смартфона на стену и разместите {product.name} в пространстве до покупки. Технология работает на iOS 12+ и Android 8+.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <a
                href={`https://endmarket.ru/ar/${product.slug}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.625rem",
                  height: "52px",
                  backgroundColor: "#080808",
                  color: "#f8f8f6",
                  textDecoration: "none",
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.625rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                Открыть на смартфоне
              </a>
              <button
                onClick={() => setArOpen(false)}
                style={{
                  height: "48px",
                  border: "1px solid #d0cdc8",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.625rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#6e6e66",
                }}
              >
                Закрыть
              </button>
            </div>

            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.625rem", letterSpacing: "0.06em", color: "#c0bdb8", marginTop: "1.5rem" }}>
              Функция AR доступна на мобильных устройствах с поддержкой ARKit / ARCore
            </p>
          </div>
        </div>
      )}

      <style>{`
        .pdp-gallery-desktop { display: block; }
        .pdp-gallery-mobile { display: none; }
        .pdp-info-panel {
          position: sticky;
          top: 64px;
        }
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
          .aw-sticky-atc { display: flex !important; }
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pdp-gallery-desktop { display: none !important; }
          .pdp-gallery-mobile { display: block !important; }
          .pdp-info-panel { position: static !important; }
        }
        .related-card:hover .related-img { transform: scale(1.04) !important; }
      `}</style>

      {/* Sticky mobile ATC bar */}
      <div
        className="aw-sticky-atc"
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: "#080808",
          borderTop: "1px solid #1a1a1a",
          padding: "0.875rem 1.25rem",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "0.9375rem", fontWeight: 700, color: "#f8f8f6", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.name}
          </p>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 300, color: "#a8a8a2", margin: 0 }}>
            ₽{product.price.toLocaleString()}
          </p>
        </div>
        <button
          onClick={handleAdd}
          style={{
            flexShrink: 0,
            height: "48px",
            padding: "0 1.5rem",
            backgroundColor: added ? "#2d6a3f" : "#f8f8f6",
            color: "#080808",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-barlow)",
            fontSize: "0.625rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 700,
            transition: "background-color 0.3s",
          }}
        >
          {added ? "✓ Добавлено" : "В корзину"}
        </button>
      </div>
    </div>
  );
}
