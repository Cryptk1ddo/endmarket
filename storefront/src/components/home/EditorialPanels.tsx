"use client";

import Image from "next/image";
import Link from "next/link";

const panels = [
  {
    href: "/brands",
    image: "/heroimages/models.png",
    imageAlt: "Бренды — архитектурный объект",
    eyebrow: "Наши бренды",
    titleBold: "Ballu.",
    titleLight: "Haier. Hisense.",
    sub: "Официальные дистрибьюторы трёх ведущих мировых производителей",
    cta: "Смотреть бренды",
    position: "center top",
  },
  {
    href: "/brands",
    image: "/heroimages/interior.png",
    imageAlt: "Журнал — интерьер и архитектура",
    eyebrow: "Журнал",
    titleBold: "Климат.",
    titleLight: "Архитектура. Дом.",
    sub: "Экспертные статьи, обзоры и руководства по выбору климатической техники",
    cta: "Читать журнал",
    position: "center center",
  },
];

export default function EditorialPanels() {
  return (
    <>
      <style>{`
        .editorial-panel { position: relative; display: block; overflow: hidden; background: #0a0a0a; }
        .editorial-panel-img { transition: transform 2s cubic-bezier(0.16, 1, 0.3, 1); }
        .editorial-panel:hover .editorial-panel-img { transform: scale(1.06); }
        .editorial-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-barlow);
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #f8f8f6;
          text-decoration: none;
          border-bottom: 1px solid rgba(248,248,246,0.35);
          padding-bottom: 2px;
          transition: border-color 0.3s ease, color 0.3s ease;
        }
        .editorial-panel:hover .editorial-cta { border-color: #f8f8f6; }
        @media (max-width: 640px) {
          .editorial-grid { grid-template-columns: 1fr !important; }
          .editorial-panel { height: 70vw !important; min-height: 280px !important; }
        }
      `}</style>

      <section
        className="editorial-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2px",
          backgroundColor: "#1a1a18",
          borderTop: "1px solid #1a1a18",
        }}
      >
        {panels.map((panel) => (
          <Link
            key={panel.href + panel.eyebrow}
            href={panel.href}
            className="editorial-panel"
            style={{ height: "clamp(380px, 56vh, 680px)" }}
          >
            <Image
              src={panel.image}
              alt={panel.imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="editorial-panel-img"
              style={{
                objectFit: "cover",
                objectPosition: panel.position,
                filter: "brightness(0.55) grayscale(15%)",
              }}
              unoptimized
            />

            {/* gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
              }}
            />

            {/* eyebrow top-left */}
            <div
              style={{
                position: "absolute",
                top: "2rem",
                left: "2rem",
                fontFamily: "var(--font-barlow)",
                fontSize: "0.5625rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(248,248,246,0.5)",
              }}
            >
              {panel.eyebrow}
            </div>

            {/* text bottom-left */}
            <div
              style={{
                position: "absolute",
                bottom: "2.25rem",
                left: "2rem",
                right: "2rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  margin: "0 0 0.5rem",
                  lineHeight: 0.88,
                  color: "#f8f8f6",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(2.5rem, 5vw, 5rem)",
                    fontWeight: 900,
                    letterSpacing: "0.01em",
                  }}
                >
                  {panel.titleBold}
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(2.5rem, 5vw, 5rem)",
                    fontWeight: 300,
                    color: "#b8b8b4",
                    letterSpacing: "0.01em",
                  }}
                >
                  {panel.titleLight}
                </span>
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.75rem",
                  lineHeight: 1.5,
                  color: "rgba(248,248,246,0.6)",
                  margin: "0.75rem 0 1.25rem",
                  maxWidth: "28ch",
                }}
              >
                {panel.sub}
              </p>

              <span className="editorial-cta">
                {panel.cta}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
