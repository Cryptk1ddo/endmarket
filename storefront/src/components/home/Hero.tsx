"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      style={{
        paddingTop: "64px",
        backgroundColor: "#f8f8f6",
      }}
    >
      {/* Announcement bar */}
      <div
        style={{
          backgroundColor: "#080808",
          color: "#f8f8f6",
          textAlign: "center",
          padding: "0.5rem 1.5rem",
          fontFamily: "var(--font-barlow)",
          fontSize: "0.625rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        Новая коллекция 2025 —{" "}
        <Link
          href="/collection"
          style={{ color: "#f8f8f6", textDecoration: "underline", textUnderlineOffset: "3px" }}
        >
          Смотреть объекты
        </Link>
      </div>

      {/* Hero image + text split */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "calc(100svh - 96px)",
        }}
        className="hero-grid"
      >
        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden" }} className="hero-img-panel">
          <Image
            src="/products/ballu/1_heroimage.png"
            alt="Интерьер с настенной климатической системой"
            fill
            style={{ objectFit: "cover", filter: "grayscale(20%) contrast(1.05)" }}
            priority
            unoptimized
          />
        </div>

        {/* Text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "2rem 1.5rem 2.5rem",
            borderLeft: "1px solid #e0ddd8",
          }}
          className="hero-text-panel"
        >
          <p
            className="label"
            style={{ marginBottom: "1.5rem", color: "#a8a8a2" }}
          >
            Осн. MMXXIV — Климатическая техника
          </p>
          <h1
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.01em",
              color: "#080808",
              marginBottom: "2rem",
            }}
          >
            КЛИМАТ
            <br />
            ДЛЯ
            <br />
            ДОМА.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.8125rem",
              fontWeight: 300,
              lineHeight: 1.75,
              color: "#6e6e66",
              maxWidth: "280px",
              marginBottom: "2rem",
            }}
          >
            Ballu, Haier, Hisense — официальный дистрибьютор. Гарантия, доставка, монтаж.
          </p>
          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <Link
              href="/collection"
              style={{
                display: "inline-block",
                fontFamily: "var(--font-barlow)",
                fontSize: "0.6875rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#080808",
                textDecoration: "none",
                borderBottom: "1px solid #080808",
                paddingBottom: "3px",
              }}
            >
              Весь каталог
            </Link>
            <a
              href="mailto:support@endmarket.ru"
              style={{
                display: "inline-block",
                fontFamily: "var(--font-barlow)",
                fontSize: "0.6875rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#6e6e66",
                textDecoration: "none",
                borderBottom: "1px solid #d0cdc8",
                paddingBottom: "3px",
              }}
            >
              Написать
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            min-height: 0 !important;
          }
          .hero-img-panel {
            aspect-ratio: 4/3;
            order: -1;
          }
          .hero-text-panel {
            border-left: none !important;
            border-top: 1px solid #e0ddd8;
            padding: 2rem 1.25rem 2.5rem !important;
            justify-content: flex-start !important;
          }
        }
        @media (min-width: 769px) {
          .hero-img-panel { min-height: 520px; }
          .hero-text-panel { padding: 3rem 3.5rem 3.5rem !important; }
        }
      `}</style>
    </section>
  );
}
