import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О бренде",
  description: "ENDMARKET — официальный дистрибьютор Ballu, Haier, Hisense, Daikin. Кондиционеры с гарантией, доставкой и монтажом. Москва, 2024.",
};

const PRINCIPLES = [
  { n: "01", title: "Гарантия", text: "Официальная гарантия производителя. Сервисный центр в Москве." },
  { n: "02", title: "Доставка", text: "Курьер по Москве — 1–2 дня. СДЭК, Boxberry, Почта России — 3–7 рабочих дней." },
  { n: "03", title: "Монтаж",   text: "Сертифицированные бригады для Ballu, Haier, Hisense, Daikin. Работаем по всей Москве и МО." },
];

const INK = "#080808";
const MUTED = "#6e6e66";
const FAINT = "#a8a8a2";
const LINE = "rgba(0,0,0,0.1)";
const BARLOW = "var(--font-barlow)";
const COND = "var(--font-barlow-condensed)";

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f1", color: INK, fontFamily: BARLOW }}>
      <div style={{ height: "72px" }} />

      <div className="ab-wrap">
        {/* Hero */}
        <section style={{ paddingTop: "clamp(3rem, 9vw, 6rem)", paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <p style={{ fontSize: "1.0625rem", color: FAINT, marginBottom: "1.25rem" }}>О бренде</p>
          <h1 style={{ fontSize: "clamp(2.75rem, 8vw, 5.5rem)", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 0.96, margin: 0 }}>
            Климат без компромиссов
          </h1>
        </section>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${LINE}` }} />

        {/* Intro */}
        <section className="ab-intro" style={{ paddingTop: "clamp(2.5rem, 6vw, 4rem)", paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <p style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 400, lineHeight: 1.3, letterSpacing: "-0.01em", margin: 0 }}>
            ENDMARKET — официальный дистрибьютор Ballu, Haier, Hisense и Daikin в России. Кондиционеры для дома, офиса и коммерческих проектов.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: MUTED, margin: 0 }}>
              Основан в 2024 году. Предлагаем кондиционеры с официальной гарантией производителя, быстрой доставкой и профессиональным монтажом.
            </p>
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: MUTED, margin: 0 }}>
              Климат — не опция. Наша задача — сделать его управляемым, комфортным и экономичным в любом помещении.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${LINE}` }} />

        {/* Principles */}
        <section style={{ paddingTop: "clamp(2.5rem, 6vw, 4rem)", paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 1.5rem" }}>Принципы</h2>
          <div>
            {PRINCIPLES.map((p) => (
              <div key={p.n} style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr", gap: "1.25rem", padding: "1.75rem 0", borderTop: `1px solid ${LINE}`, alignItems: "baseline" }}>
                <span style={{ fontFamily: COND, fontSize: "1.25rem", fontWeight: 700, color: FAINT, lineHeight: 1 }}>{p.n}</span>
                <div>
                  <p style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 0.5rem", lineHeight: 1.15 }}>{p.title}</p>
                  <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: MUTED, margin: 0, maxWidth: "32rem" }}>{p.text}</p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${LINE}` }} />
          </div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${LINE}` }} />

        {/* Office */}
        <section className="ab-office" style={{ paddingTop: "clamp(2.5rem, 6vw, 4rem)", paddingBottom: "clamp(4rem, 9vw, 6rem)" }}>
          <div style={{ backgroundColor: "#e7e6e1", aspectRatio: "4/3" }} />
          <div>
            <p style={{ fontSize: "1.0625rem", color: FAINT, marginBottom: "1rem" }}>Офис</p>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, margin: "0 0 1.5rem" }}>
              Москва, Россия
            </h2>
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: MUTED, margin: 0 }}>
              Наш офис расположен в Москве. Мы поставляем оборудование Ballu, Haier, Hisense и Daikin по всей России с официальной гарантией, сервисным сопровождением и профессиональным монтажом.
            </p>
          </div>
        </section>
      </div>

      <style>{`
        .ab-wrap {
          max-width: 880px;
          margin: 0 auto;
          padding-left: clamp(1.5rem, 5vw, 3rem);
          padding-right: clamp(1.5rem, 5vw, 3rem);
        }
        .ab-intro {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: start;
        }
        .ab-office {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 5vw, 4rem);
          align-items: center;
        }
        @media (max-width: 720px) {
          .ab-intro, .ab-office { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
