"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { collectionLabels } from "@/lib/products";
import type { Product } from "@/lib/products";

export default function ProductShowcase({ featured }: { featured: Product[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section style={{ backgroundColor: "#f8f8f6", borderTop: "1px solid #e0ddd8" }}>
      {/* Section header */}
      <div
        style={{
          padding: "2.25rem 1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          borderBottom: "1px solid #e0ddd8",
        }}
      >
        <div>
          <p style={{ margin: "0 0 0.4rem", fontFamily: "var(--font-body)", fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8f8f88" }}>
            Кураторский выбор
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.45rem, 2.6vw, 2.35rem)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "#080808",
              margin: 0,
            }}
          >
            Рекомендуем
          </h2>
        </div>
        <Link
          href="/collection"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#6e6e66",
            textDecoration: "none",
            borderBottom: "1px solid #6e6e66",
            paddingBottom: "2px",
          }}
        >
          Весь каталог
        </Link>
      </div>

      {/* Product grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderLeft: "1px solid #e0ddd8",
        }}
        className="showcase-grid"
      >
        {featured.slice(0, 4).map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            style={{
              display: "block",
              textDecoration: "none",
              borderRight: "1px solid #e0ddd8",
              borderBottom: "1px solid #e0ddd8",
            }}
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Image */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#ededeb",
                aspectRatio: "3/4",
              }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, 25vw"
                style={{
                  objectFit: "cover",
                  filter: "grayscale(15%)",
                  transition: "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)",
                  transform: hoveredId === product.id ? "scale(1.04)" : "scale(1)",
                }}
                unoptimized
/>
            </div>

            {/* Info */}
            <div style={{ padding: "0.875rem 1rem 1.25rem" }}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8f8f88",
                  marginBottom: "0.5rem",
                }}
              >
                {product.brand} / {collectionLabels[product.collection] ?? product.collection}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: "-0.025em",
                  color: "#080808",
                  marginBottom: "0.5rem",
                }}
              >
                {product.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  lineHeight: 1.45,
                  color: "#6e6e66",
                  marginBottom: "0.75rem",
                }}
              >
                {product.subtitle}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  letterSpacing: "-0.015em",
                  color: "#080808",
                }}
              >
                ₽{product.price.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .showcase-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
