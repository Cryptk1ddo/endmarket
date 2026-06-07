import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Гарантии",
  description: "Условия гарантии и возврата изделий ENDMARKET.",
};

const COVER = [
  { period: "3 года",  scope: "Гарантия", text: "Официальная гарантия производителя. Полное покрытие производственных дефектов при нормальной эксплуатации." },
  { period: "1 год",   scope: "Сервис",   text: "Бесплатный вызов мастера по Москве в течение гарантийного срока. Сертифицированные специалисты." },
  { period: "14 дней", scope: "Возврат",  text: "Возврат товара надлежащего качества при сохранении товарного вида и упаковки (ст. 26.1 ЗОЗПП)." },
];

const CONDITIONS = [
  "Гарантия распространяется на изделия, смонтированные сертифицированным специалистом.",
  "К гарантийному обращению необходимо приложить оригинал акта приёмки и фотографии дефекта.",
  "Гарантия не распространяется на повреждения вследствие неправильной эксплуатации, химического воздействия или кустарного монтажа.",
  "Гарантийный ремонт производится в нашей мастерской или у авторизованного сервисного партнёра.",
];

const INK = "#080808";
const MUTED = "#6e6e66";
const FAINT = "#a8a8a2";
const LINE = "rgba(0,0,0,0.1)";
const BARLOW = "var(--font-barlow)";
const COND = "var(--font-barlow-condensed)";

export default function GuaranteePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f1", color: INK, fontFamily: BARLOW }}>
      <div style={{ height: "72px" }} />

      <div className="gr-wrap">
        {/* Hero */}
        <section style={{ paddingTop: "clamp(3rem, 9vw, 6rem)", paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <p style={{ fontSize: "1.0625rem", color: FAINT, marginBottom: "1.25rem" }}>Гарантии</p>
          <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 4.75rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 0.98, margin: 0 }}>
            Обязательства качества
          </h1>
          <p style={{ fontSize: "1.0625rem", lineHeight: 1.6, color: MUTED, maxWidth: "34rem", marginTop: "1.75rem" }}>
            Официальная гарантия производителя, сервисное сопровождение в Москве и возврат по закону — на каждое изделие.
          </p>
        </section>

        {/* Coverage */}
        <section style={{ paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 1.5rem" }}>Покрытие</h2>
          <div>
            {COVER.map((c) => (
              <div key={c.scope} className="gr-row" style={{ borderTop: `1px solid ${LINE}` }}>
                <span className="gr-period" style={{ fontFamily: COND, fontSize: "clamp(2rem, 6vw, 2.75rem)", fontWeight: 700, color: FAINT, lineHeight: 0.95 }}>
                  {c.period}
                </span>
                <div>
                  <p style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 0.5rem", lineHeight: 1.15 }}>{c.scope}</p>
                  <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: MUTED, margin: 0, maxWidth: "32rem" }}>{c.text}</p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${LINE}` }} />
          </div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${LINE}` }} />

        {/* Conditions */}
        <section style={{ paddingTop: "clamp(2.5rem, 6vw, 4rem)", paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 1.5rem" }}>Условия гарантии</h2>
          <div>
            {CONDITIONS.map((text, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr", gap: "1.25rem", padding: "1.5rem 0", borderTop: `1px solid ${LINE}`, alignItems: "baseline" }}>
                <span style={{ fontFamily: COND, fontSize: "1.25rem", fontWeight: 700, color: FAINT, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</span>
                <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: "#2a2a22", margin: 0 }}>{text}</p>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${LINE}` }} />
          </div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${LINE}` }} />

        {/* CTA */}
        <section style={{ paddingTop: "clamp(2.5rem, 6vw, 4rem)", paddingBottom: "clamp(4rem, 9vw, 6rem)" }}>
          <p style={{ fontSize: "1.0625rem", color: MUTED, margin: 0 }}>
            Гарантийный случай?{" "}
            <Link href="/contact" style={{ color: INK, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "4px" }}>
              Свяжитесь с нами
            </Link>
          </p>
        </section>
      </div>

      <style>{`
        .gr-wrap {
          max-width: 880px;
          margin: 0 auto;
          padding-left: clamp(1.5rem, 5vw, 3rem);
          padding-right: clamp(1.5rem, 5vw, 3rem);
        }
        .gr-row {
          display: grid;
          grid-template-columns: 8rem 1fr;
          gap: 2rem;
          align-items: baseline;
          padding: 1.75rem 0;
        }
        @media (max-width: 640px) {
          .gr-row { grid-template-columns: 1fr; gap: 0.5rem; padding: 1.5rem 0; }
        }
      `}</style>
    </div>
  );
}
