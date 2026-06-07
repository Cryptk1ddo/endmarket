"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";

export default function WishlistClient() {
  const { items, toggle } = useWishlist();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f8f6" }}>
      <div style={{ height: "72px" }} />

      {/* Header */}
      <div style={{ padding: "3rem 2rem 2rem", borderBottom: "1px solid #e0ddd8" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "0.5rem" }}>
          ENDMARKET / ИЗБРАННОЕ
        </p>
        <h1 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, letterSpacing: "0.02em", color: "#080808", margin: 0 }}>
          {items.length > 0 ? `${items.length} ${items.length === 1 ? "ОБЪЕКТ" : "ОБЪЕКТОВ"}` : "ИЗБРАННОЕ"}
        </h1>
      </div>

      {items.length === 0 ? (
        /* Empty state */
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8rem 2rem", gap: "1.5rem" }}>
          <Heart size={48} color="#e0ddd8" strokeWidth={1} />
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9375rem", color: "#a8a8a2", letterSpacing: "0.04em" }}>
            Нет сохранённых объектов
          </p>
          <Link
            href="/collection"
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#080808", textDecoration: "none", borderBottom: "1px solid #080808", paddingBottom: "2px" }}
          >
            Смотреть каталог
          </Link>
        </div>
      ) : (
        /* Grid */
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              borderLeft: "1px solid #e0ddd8",
              borderTop: "1px solid #e0ddd8",
            }}
            className="wishlist-grid"
          >
            {items.map((product) => (
              <div
                key={product.id}
                style={{ borderRight: "1px solid #e0ddd8", borderBottom: "1px solid #e0ddd8" }}
              >
                {/* Image */}
                <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#ededeb", aspectRatio: "3/4" }}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    style={{ objectFit: "cover", filter: "grayscale(10%)" }}
                    unoptimized
/>
                  {/* Remove button */}
                  <button
                    onClick={() => toggle(product)}
                    style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.9)", border: "none", width: "2rem", height: "2rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    aria-label="Удалить из избранного"
                  >
                    <Heart size={16} fill="#080808" color="#080808" />
                  </button>
                </div>
                {/* Info */}
                <div style={{ padding: "1rem 1.25rem 1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.1em", color: "#a8a8a2", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    {product.collection}
                  </p>
                  <Link href={`/product/${product.slug}`} style={{ textDecoration: "none" }}>
                    <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.125rem", fontWeight: 700, letterSpacing: "0.04em", color: "#080808", marginBottom: "0.375rem" }}>
                      {product.name}
                    </p>
                  </Link>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9375rem", fontWeight: 300, color: "#4a4a44" }}>
                    ₽{product.price.toLocaleString("ru-RU")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <style>{`
            @media (max-width: 900px) { .wishlist-grid { grid-template-columns: repeat(2, 1fr) !important; } }
            @media (max-width: 480px) { .wishlist-grid { grid-template-columns: 1fr !important; } }
          `}</style>
        </>
      )}
    </div>
  );
}
