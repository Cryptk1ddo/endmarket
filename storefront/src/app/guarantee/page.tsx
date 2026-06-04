import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Гарантии",
  description: "Условия гарантии и возврата изделий ENDMARKET.",
};

export default function GuaranteePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f8f6" }}>
      <div style={{ height: "72px" }} />

      <section style={{ padding: "5rem 2rem 4rem", borderBottom: "1px solid #e0ddd8" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1.5rem" }}>
          ENDMARKET / ГАРАНТИИ
        </p>
        <h1 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 900, letterSpacing: "0.01em", color: "#080808", lineHeight: 0.9, margin: 0 }}>
          ОБЯЗАТЕЛЬСТВА<br />
          <span style={{ fontWeight: 300, color: "#a8a8a2" }}>КАЧЕСТВА</span>
        </h1>
      </section>

      {/* Warranty blocks */}
      <section style={{ padding: "4rem 2rem", borderBottom: "1px solid #e0ddd8", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderLeft: "1px solid #e0ddd8" }}>
          {[
            { period: "3 года", scope: "Гарантия", text: "Официальная гарантия производителя. Полное покрытие производственных дефектов при нормальной эксплуатации." },
            { period: "1 год", scope: "Сервис", text: "Бесплатный вызов мастера по Москве в течение гарантийного срока. Сертифицированные специалисты." },
            { period: "14 дней", scope: "Возврат", text: "Возврат товара надлежащего качества в течение 14 дней. Сохранение товарного вида и оригинальной упаковки (ст. 26.1 ЗОЗПП)." },
          ].map((item) => (
            <div key={item.scope} style={{ padding: "2.5rem 2rem", borderRight: "1px solid #e0ddd8" }}>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "3rem", fontWeight: 900, color: "#ededeb", lineHeight: 1, marginBottom: "0.25rem" }}>{item.period}</p>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#080808", marginBottom: "1rem" }}>{item.scope}</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.7, color: "#6e6e66" }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Conditions */}
      <section style={{ padding: "4rem 2rem", borderBottom: "1px solid #e0ddd8", maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "2rem" }}>Условия гарантии</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", borderTop: "1px solid #e0ddd8" }}>
          {[
            "Гарантия распространяется на изделия, смонтированные сертифицированным специалистом.",
            "К гарантийному обращению необходимо приложить оригинал акта приёмки и фотографии дефекта.",
            "Гарантия не распространяется на повреждения вследствие неправильной эксплуатации, химического воздействия или кустарного монтажа.",
            "Гарантийный ремонт производится в нашей мастерской или у авторизованного сервисного партнёра.",
          ].map((text, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr", padding: "1.25rem 0", borderBottom: "1px solid #e0ddd8", alignItems: "start" }}>
              <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "0.6875rem", fontWeight: 700, color: "#a8a8a2", letterSpacing: "0.1em" }}>0{i + 1}</span>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.7, color: "#4a4a44" }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "3rem 2rem" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, color: "#6e6e66" }}>
          Гарантийный случай?{" "}
          <Link href="/contact" style={{ color: "#080808", textDecoration: "underline", textUnderlineOffset: "3px" }}>Свяжитесь с нами</Link>
        </p>
      </section>
    </div>
  );
}
