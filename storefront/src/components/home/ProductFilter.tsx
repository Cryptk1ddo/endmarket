"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { collectionLabels } from "@/lib/products";

const COLLECTIONS = ["Настенные", "Кассетные", "Канальные", "Напольно-потолочные"] as const;
type CollectionKey = (typeof COLLECTIONS)[number];

export default function ProductFilter({ products }: { products: Product[] }) {
  const [activeTab, setActiveTab] = useState<CollectionKey>("Настенные");
  const visible = products.filter((p) => p.collection === activeTab);

  return (
    <section className="pfSection" style={{ maxWidth: "1920px", margin: "0 auto", padding: "0 1.5rem 5rem", backgroundColor: "#f3f3f1" }}>
      <style>{`
        .pfSection {
          position: relative;
        }
        .pfTopBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          padding: 2rem 0 1.4rem;
        }
        .pfTabs {
          display: flex;
          gap: 2rem;
          min-width: 0;
        }
        .pfTabButton {
          white-space: nowrap;
          flex: 0 0 auto;
        }
        .pfHeading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .aw-strip::-webkit-scrollbar { display: none; }
        .aw-strip { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 960px) {
          .pfTabs {
            gap: 1.25rem;
            overflow-x: auto;
            padding-bottom: 0.25rem;
            margin: 0 -0.25rem;
            padding-right: 0.25rem;
          }
        }
        @media (max-width: 640px) {
          .pfSection {
            padding: 0 0 4rem !important;
          }
          .pfTopBar {
            padding: 1.15rem 1rem 0.9rem;
          }
          .pfTabs {
            gap: 0.85rem;
            margin: 0;
            padding-bottom: 0.5rem;
            scroll-snap-type: x proximity;
          }
          .pfTabButton {
            scroll-snap-align: start;
            font-size: 0.74rem !important;
            letter-spacing: 0.03em !important;
            padding-bottom: 0.55rem !important;
          }
          .pfHeading {
            padding: 0 1rem;
            align-items: flex-start;
            flex-direction: column;
            margin-bottom: 1.25rem;
          }
          .pfArchiveTitle {
            font-size: clamp(1.9rem, 9vw, 2.6rem) !important;
            line-height: 0.92;
          }
          .pfArchiveLink {
            padding-top: 0.15rem;
            font-size: 0.62rem !important;
            letter-spacing: 0.16em !important;
          }
          .aw-strip {
            gap: 0.9rem !important;
            margin: 0 !important;
            padding: 0 1rem 1.25rem !important;
          }
          .pfCard,
          .pfAllCard {
            min-width: 76vw !important;
            width: 76vw !important;
          }
          .pfCardTitle {
            font-size: 1.05rem !important;
            line-height: 0.96 !important;
          }
          .pfCardCopy {
            font-size: 0.8rem !important;
            line-height: 1.45 !important;
          }
        }
        @media (min-width: 641px) {
          .pfHeading {
            border-top: 1px solid rgba(8, 8, 8, 0.08);
            padding-top: 1.15rem;
          }
        }
      `}</style>
      {/* Tab nav */}
      <div
        className="pfTopBar"
      >
        <div className="pfTabs">
          {COLLECTIONS.map((col) => (
            <button
              key={col}
              onClick={() => setActiveTab(col)}
              className="pfTabButton"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: activeTab === col ? "#080808" : "#8f8f88",
                background: "none",
                border: "none",
                borderBottom: activeTab === col ? "2px solid #080808" : "2px solid transparent",
                paddingBottom: "4px",
                cursor: "pointer",
                transition: "color 0.2s",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {collectionLabels[col]}
            </button>
          ))}
        </div>
      </div>

      {/* Product heading */}
      <div
        className="pfHeading"
      >
        <div>
          <p style={{ margin: "0 0 0.35rem", fontFamily: "var(--font-body)", fontSize: "0.625rem", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8f8f88" }}>
            Архив моделей
          </p>
          <h3
            className="pfArchiveTitle"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "#080808",
              margin: 0,
            }}
          >
            {collectionLabels[activeTab]}
          </h3>
        </div>
        <Link
          className="pfArchiveLink"
          href={`/collection?collection=${encodeURIComponent(activeTab)}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontFamily: "var(--font-body)",
            fontSize: "0.6875rem",
            fontWeight: 500,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#080808",
            textDecoration: "none",
          }}
        >
          Смотреть все <ChevronRight size={14} />
        </Link>
      </div>

      {/* Product strip */}
      <div
        className="aw-strip"
        style={{
          display: "flex",
          gap: "1.5rem",
          overflowX: "auto",
          margin: "0 -1.5rem",
          padding: "0 1.5rem 1.5rem",
        }}
      >
        {visible.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="product-card pfCard"
            style={{
              minWidth: "260px",
              width: "260px",
              flexShrink: 0,
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "3/4",
                backgroundColor: "#eaeae8",
                overflow: "hidden",
                marginBottom: "1rem",
              }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="260px"
                className="pcard-img"
                style={{ objectFit: "cover", filter: "grayscale(10%)" }}
                unoptimized
/>
              {product.featured && (
                <div
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    left: "0.75rem",
                    backgroundColor: "#f8f8f6",
                    color: "#080808",
                    fontSize: "0.5625rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    padding: "0.25rem 0.5rem",
                  }}
                >
                  Избранное
                </div>
              )}
            </div>
            <div>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#8f8f88",
                }}
              >
                {product.brand}
              </span>
              <h4
                className="pfCardTitle"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1875rem",
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: "#080808",
                  margin: "0.35rem 0 0.45rem",
                  lineHeight: 1,
                }}
              >
                {product.name}
              </h4>
              <p
                className="pfCardCopy"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.75rem",
                  fontWeight: 400,
                  lineHeight: 1.45,
                  color: "#6e6e66",
                  marginBottom: "0.625rem",
                }}
              >
                {product.subtitle}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#8f8f88",
                  marginBottom: "0.5rem",
                }}
              >
                {product.material}
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

        {/* View all card */}
        <Link
          href="/collection"
          className="pfAllCard"
          style={{
            minWidth: "260px",
            width: "260px",
            flexShrink: 0,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            aspectRatio: "3/4",
            backgroundColor: "#0a0a0a",
            color: "#f8f8f6",
            flexDirection: "column",
            gap: "0.75rem",
            alignSelf: "flex-start",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.875rem",
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            ВСЕ
          </span>
          <ChevronRight size={20} />
        </Link>
      </div>
    </section>
  );
}
