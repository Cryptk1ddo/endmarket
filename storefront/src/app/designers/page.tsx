import type { Metadata } from "next";
import DesignersForm from "./DesignersForm";

export const metadata: Metadata = {
  title: "Программа для дизайнеров",
  description: "Профессиональная программа ENDMARKET для архитекторов и дизайнеров интерьера.",
};

const BENEFITS = [
  { n: "01", title: "Trade pricing", text: "Профессиональные цены на весь ассортимент. Условия обсуждаются индивидуально в зависимости от объёма." },
  { n: "02", title: "Приоритет производства", text: "Ваши заказы обрабатываются в первую очередь. Сокращённый срок при согласовании." },
  { n: "03", title: "Прямой доступ", text: "Персональный менеджер проекта. Прямой контакт с командой дизайна для кастомизации." },
  { n: "04", title: "Образцы материалов", text: "Комплект материальных образцов доступен для подтверждённых участников программы." },
];

export default function DesignersPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f8f6" }}>
      <div style={{ height: "72px" }} />

      <section style={{ padding: "5rem 2rem 4rem", borderBottom: "1px solid #e0ddd8" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1.5rem" }}>
          ENDMARKET / ДИЗАЙНЕРАМ
        </p>
        <h1 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 900, letterSpacing: "0.01em", color: "#080808", lineHeight: 0.9, margin: 0 }}>
          TRADE<br />
          <span style={{ fontWeight: 300, color: "#a8a8a2" }}>PROGRAMME</span>
        </h1>
      </section>

      {/* Benefits */}
      <section style={{ padding: "4rem 2rem", borderBottom: "1px solid #e0ddd8", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderLeft: "1px solid #e0ddd8" }}>
          {BENEFITS.map((b) => (
            <div key={b.n} style={{ padding: "2.5rem 2rem", borderRight: "1px solid #e0ddd8" }}>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.2em", color: "#a8a8a2", marginBottom: "1rem" }}>{b.n}</p>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.125rem", fontWeight: 700, letterSpacing: "0.03em", color: "#080808", marginBottom: "0.75rem" }}>{b.title}</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 300, lineHeight: 1.7, color: "#6e6e66" }}>{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eligibility */}
      <section style={{ padding: "4rem 2rem", borderBottom: "1px solid #e0ddd8", maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "2rem" }}>Квалификация</p>
        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #e0ddd8" }}>
          {[
            "Архитекторы с подтверждённой профессиональной практикой",
            "Дизайнеры интерьера с портфолио реализованных объектов",
            "Специализированные подрядчики в области климатического оборудования и монтажа",
            "Девелоперы высококлассной жилой и коммерческой недвижимости",
          ].map((text, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "40px 1fr", padding: "1.25rem 0", borderBottom: "1px solid #e0ddd8", alignItems: "start" }}>
              <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "0.6875rem", fontWeight: 700, color: "#a8a8a2", letterSpacing: "0.1em" }}>0{i + 1}</span>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, color: "#4a4a44", lineHeight: 1.6 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application form */}
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <DesignersForm />
      </div>
    </div>
  );
}
