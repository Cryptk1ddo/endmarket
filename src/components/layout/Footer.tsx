"use client";

import Link from "next/link";
import { Mail } from "lucide-react";

const CATALOG_LINKS = [
  { label: "Все модели",         href: "/collection" },
  { label: "Ballu",              href: "/collection?brand=Ballu" },
  { label: "Haier",              href: "/collection?brand=Haier" },
  { label: "Hisense",            href: "/collection?brand=Hisense" },
  { label: "Daikin",             href: "/collection?brand=Daikin" },
];

const SERVICE_LINKS = [
  { label: "Доставка и оплата", href: "/delivery" },
  { label: "Гарантия и возврат", href: "/guarantee" },
  { label: "Монтаж и установка", href: "/installation" },
  { label: "О компании", href: "/about" },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#0a0a0a", color: "#f8f8f6", padding: "3rem 1.25rem 2rem" }}>
      <div
        style={{ maxWidth: "1920px", margin: "0 auto" }}
      >
        {/* 4-col grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2.5rem",
            paddingBottom: "3rem",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                display: "block",
                fontFamily: "var(--font-barlow-condensed)",
                fontSize: "1.25rem",
                fontWeight: 900,
                letterSpacing: "0.25em",
                color: "#f8f8f6",
                textDecoration: "none",
                marginBottom: "1rem",
              }}
            >
              ENDMARKET
            </Link>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 300, lineHeight: 1.7, color: "rgba(248,248,246,0.5)", maxWidth: "240px" }}>
              Кондиционеры Ballu, Haier, Hisense, Daikin. Официальный дистрибьютор. Осн. 2024.
            </p>
          </div>

          {/* Catalog */}
          <div>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#f8f8f6", marginBottom: "1.25rem" }}>
              Каталог
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {CATALOG_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 300, color: "rgba(248,248,246,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#afc6d6")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(248,248,246,0.5)")}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Service */}
          <div>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#f8f8f6", marginBottom: "1.25rem" }}>
              Сервис
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {SERVICE_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 300, color: "rgba(248,248,246,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f8f8f6")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(248,248,246,0.5)")}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#f8f8f6", marginBottom: "1.25rem" }}>
              Контакты
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <Mail size={14} style={{ color: "#a8a8a2", flexShrink: 0 }} />
                <a href="mailto:support@endmarket.ru" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 300, color: "rgba(248,248,246,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f8f8f6")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(248,248,246,0.5)")}>
                  support@endmarket.ru
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", color: "rgba(248,248,246,0.3)" }}>
            © 2024 ENDMARKET. Все права защищены.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { label: "Политика конфиденциальности", href: "/privacy" },
              { label: "Публичная оферта", href: "/terms" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", color: "rgba(248,248,246,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(248,248,246,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(248,248,246,0.3)")}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
