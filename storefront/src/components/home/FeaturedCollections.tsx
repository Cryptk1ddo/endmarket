import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";

const COLLECTION_IMAGES: Record<string, string> = {
  "Настенные":           "/typesimages/1.png",
  "Кассетные":           "/typesimages/2.png",
  "Канальные":           "/typesimages/3.png",
  "Напольно-потолочные": "/typesimages/4.png",
};

const COLLECTION_LABELS: Record<string, string> = {
  "Настенные":           "НАСТЕННЫЕ",
  "Кассетные":           "КАССЕТНЫЕ",
  "Канальные":           "КАНАЛЬНЫЕ",
  "Напольно-потолочные": "НАПОЛЬНО-ПОТОЛОЧНЫЕ",
};

const COLLECTIONS = ["Настенные", "Кассетные", "Канальные", "Напольно-потолочные"];

export default function FeaturedCollections({ products }: { products: Product[] }) {
  const cols = COLLECTIONS.map((key) => ({
    key,
    label: COLLECTION_LABELS[key],
    image: COLLECTION_IMAGES[key],
    count: products.filter((p) => p.collection === key).length,
  }));
  return (
    <section
      style={{
        backgroundColor: "#f8f8f6",
        borderTop: "1px solid #e0ddd8",
        borderBottom: "1px solid #e0ddd8",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "2.5rem 2rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e0ddd8",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
            fontWeight: 900,
            letterSpacing: "0.06em",
            color: "#080808",
          }}
        >
          Виды внутренних блоков
        </h2>
        <Link
          href="/collection"
          style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "0.6875rem",
            letterSpacing: "0.12em",
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

      {/* 4-col grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderLeft: "1px solid #e0ddd8",
        }}
        className="collections-grid"
      >
        {cols.map((col, idx) => (
          <Link
            key={col.key}
            href={`/collection?collection=${encodeURIComponent(col.key)}`}
            className="collection-card"
            style={{
              display: "block",
              textDecoration: "none",
              borderRight: "1px solid #e0ddd8",
            }}
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
                src={col.image}
                alt={col.label}
                fill
                sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, 25vw"
                className="card-img"
                style={{
                  objectFit: "cover",
                  filter: "grayscale(15%)",
                }}
                unoptimized
/>
            </div>

            {/* Label */}
            <div style={{ padding: "1rem 1.25rem 1.5rem" }}>
              <p
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.04em",
                  color: "#a8a8a2",
                  marginBottom: "0.375rem",
                }}
              >
                {col.count} {col.count === 1 ? "изделие" : "изделий"}
              </p>
              <p
                className="card-label"
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  color: "#080808",
                }}
              >
                {col.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .collections-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .collections-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

