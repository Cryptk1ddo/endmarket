import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О бренде",
  description: "ENDMARKET — официальный дистрибьютор Ballu, Haier, Hisense, Daikin. Кондиционеры с гарантией, доставкой и монтажом. Москва, 2024.",
};

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f8f6" }}>
      <div style={{ height: "72px" }} />

      {/* Hero */}
      <section style={{ padding: "5rem 2rem 4rem", borderBottom: "1px solid #e0ddd8" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1.5rem" }}>
          ENDMARKET / О БРЕНДЕ
        </p>
        <h1 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(3.5rem, 8vw, 7rem)", fontWeight: 900, letterSpacing: "0.01em", color: "#080808", lineHeight: 0.9, margin: 0, maxWidth: "900px" }}>
          КЛИМАТ.<br />
          <span style={{ fontWeight: 300, color: "#a8a8a2" }}>БЕЗ КОМПРОМИССОВ.</span>
        </h1>
      </section>

      {/* Intro text */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", padding: "4rem 2rem", borderBottom: "1px solid #e0ddd8", maxWidth: "1400px", margin: "0 auto" }}>
        <div>
          <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.75rem", fontWeight: 300, lineHeight: 1.3, color: "#080808", letterSpacing: "0.01em" }}>
            ENDMARKET — официальный дистрибьютор Ballu, Haier, Hisense и Daikin в России. Кондиционеры для дома, офиса и коммерческих проектов.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.75, color: "#4a4a44" }}>
            Основан в 2024 году. Предлагаем кондиционеры с официальной гарантией производителя, быстрой доставкой и профессиональным монтажом.
          </p>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.75, color: "#4a4a44" }}>
            Климат — не опция. Наша задача — сделать его управляемым, комфортным и экономичным в любом помещении.
          </p>
        </div>
      </section>

      {/* Principles */}
      <section style={{ padding: "4rem 2rem", borderBottom: "1px solid #e0ddd8" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "3rem" }}>
          Принципы
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0", borderLeft: "1px solid #e0ddd8" }}>
          {[
            { n: "01", title: "Гарантия", text: "Официальная гарантия производителя. Сервисный центр в Москве." },
            { n: "02", title: "Доставка", text: "Курьер по Москве — 1–2 дня. СДЭК, Boxberry, Почта России — 3–7 рабочих дней." },
            { n: "03", title: "Монтаж", text: "Сертифицированные бригады для Ballu, Haier, Hisense, Daikin. Работаем по всей Москве и МО." },
          ].map((p) => (
            <div key={p.n} style={{ padding: "2.5rem 2rem", borderRight: "1px solid #e0ddd8" }}>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.2em", color: "#a8a8a2", marginBottom: "1rem" }}>{p.n}</p>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.5rem", fontWeight: 700, letterSpacing: "0.03em", color: "#080808", marginBottom: "0.75rem" }}>{p.title}</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.7, color: "#6e6e66" }}>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workshop */}
      <section style={{ padding: "4rem 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ backgroundColor: "#ededeb", aspectRatio: "4/3" }} />
        <div>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1.5rem" }}>Офис</p>
          <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "2.5rem", fontWeight: 700, letterSpacing: "0.02em", color: "#080808", lineHeight: 1.0, marginBottom: "1.5rem" }}>
            МОСКВА,<br />РОССИЯ
          </h2>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.75, color: "#4a4a44" }}>
            Наш офис расположен в Москве. Мы поставляем оборудование Ballu, Haier, Hisense и Daikin по всей России с официальной гарантией, сервисным сопровождением и профессиональным монтажом.
          </p>
        </div>
      </section>
    </div>
  );
}
