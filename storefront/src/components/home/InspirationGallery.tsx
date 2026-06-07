import Image from "next/image";

const gallery = [
  {
    image: "/heroimages/moscow.png",
    caption: "Современный интерьер — Москва, РФ",
  },
  {
    image: "/heroimages/saint-petersburg.png",
    caption: "Жилой комплекс — Санкт-Петербург, РФ",
  },
  {
    image: "/heroimages/office.png",
    caption: "Офисное пространство — детали",
  },
];

export default function InspirationGallery() {
  return (
    <section
      style={{
        backgroundColor: "#f8f8f6",
        borderTop: "1px solid #e0ddd8",
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
          Архитектурные референсы
        </h2>
        <span className="label" style={{ color: "#a8a8a2" }}>
          Том 01
        </span>
      </div>

      {/* Gallery grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderLeft: "1px solid #e0ddd8",
        }}
        className="gallery-grid"
      >
        {gallery.map((item) => (
          <div
            key={item.caption}
            style={{
              borderRight: "1px solid #e0ddd8",
              borderBottom: "1px solid #e0ddd8",
            }}
          >
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#ededeb",
                aspectRatio: "4/3",
              }}
            >
              <Image
                src={item.image}
                alt={item.caption}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: "cover", filter: "grayscale(20%)" }}
                unoptimized
/>
            </div>
            <div style={{ padding: "0.875rem 1.25rem 1.25rem" }}>
              <p className="label" style={{ color: "#a8a8a2" }}>{item.caption}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
