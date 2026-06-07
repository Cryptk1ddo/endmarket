import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description: "Сроки и условия доставки кондиционеров ENDMARKET.",
};

const STEPS = [
  { stage: "Обработка заказа",    note: "После подтверждения оплаты",        value: "1 день",   region: "Москва/МО · Россия" },
  { stage: "Доставка по Москве",  note: "Курьер до двери",                   value: "1–2 дня",  region: "Москва / МО" },
  { stage: "Доставка по России",  note: "СДЭК · Boxberry · Почта России",    value: "3–7 дней", region: "Вся Россия" },
  { stage: "Монтаж по запросу",   note: "Сертифицированные монтажники",      value: "По записи", region: "По договорённости" },
];

const PAY = [
  { title: "Оплата онлайн",   text: "Банковская карта через YooKassa. Полная оплата при оформлении заказа — безопасный эквайринг." },
  { title: "Возврат и обмен", text: "Возврат в течение 14 дней при сохранении товарного вида. Обмен по договорённости." },
];

const INK = "#080808";
const MUTED = "#6e6e66";
const FAINT = "#a8a8a2";
const LINE = "rgba(0,0,0,0.1)";
const BARLOW = "var(--font-barlow)";
const COND = "var(--font-barlow-condensed)";

export default function DeliveryPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f1", color: INK, fontFamily: BARLOW }}>
      <div style={{ height: "72px" }} />

      <div className="dlv-wrap">
        {/* Hero */}
        <section style={{ paddingTop: "clamp(3rem, 9vw, 6rem)", paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <p style={{ fontSize: "1.0625rem", color: FAINT, marginBottom: "1.25rem" }}>Доставка и оплата</p>
          <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 4.75rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 0.98, margin: 0 }}>
            Сроки и логистика
          </h1>
          <p style={{ fontSize: "1.0625rem", lineHeight: 1.6, color: MUTED, maxWidth: "34rem", marginTop: "1.75rem" }}>
            Доставляем по всей России. Курьер до двери в Москве, проверенные перевозчики в регионы и монтаж силами сертифицированных специалистов.
          </p>
        </section>

        {/* Сроки */}
        <section style={{ paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 1.5rem" }}>Сроки</h2>
          <div>
            {STEPS.map((s, i) => (
              <div key={s.stage} className="dlv-row" style={{ borderTop: `1px solid ${LINE}` }}>
                <span className="dlv-idx" style={{ fontFamily: COND, fontSize: "1.5rem", fontWeight: 700, color: FAINT, lineHeight: 1 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="dlv-body">
                  <p style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.01em", margin: 0, lineHeight: 1.15 }}>{s.stage}</p>
                  <p style={{ fontSize: "1rem", color: MUTED, margin: "0.4rem 0 0" }}>{s.note}</p>
                </div>
                <div className="dlv-val">
                  <p style={{ fontSize: "1.0625rem", fontWeight: 600, margin: 0 }}>{s.value}</p>
                  <p style={{ fontSize: "0.875rem", color: FAINT, margin: "0.3rem 0 0" }}>{s.region}</p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${LINE}` }} />
          </div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${LINE}` }} />

        {/* Оплата */}
        <section style={{ paddingTop: "clamp(2.5rem, 6vw, 4rem)", paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 1.5rem" }}>Оплата и возврат</h2>
          <div className="dlv-pay">
            {PAY.map((p) => (
              <div key={p.title} className="dlv-pay-item">
                <p style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 0.75rem", lineHeight: 1.15 }}>{p.title}</p>
                <p style={{ fontSize: "1.0625rem", lineHeight: 1.65, color: MUTED, margin: 0, maxWidth: "30rem" }}>{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${LINE}` }} />

        {/* CTA */}
        <section style={{ paddingTop: "clamp(2.5rem, 6vw, 4rem)", paddingBottom: "clamp(4rem, 9vw, 6rem)" }}>
          <p style={{ fontSize: "1.0625rem", color: MUTED, margin: 0 }}>
            Вопросы по логистике?{" "}
            <Link href="/contact" style={{ color: INK, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "4px" }}>
              Свяжитесь с нами
            </Link>
          </p>
        </section>
      </div>

      <style>{`
        .dlv-wrap {
          max-width: 880px;
          margin: 0 auto;
          padding-left: clamp(1.5rem, 5vw, 3rem);
          padding-right: clamp(1.5rem, 5vw, 3rem);
        }
        .dlv-row {
          display: grid;
          grid-template-columns: 3rem 1fr auto;
          gap: 1.75rem;
          align-items: baseline;
          padding: 1.75rem 0;
        }
        .dlv-val { text-align: right; }
        .dlv-pay {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 5vw, 4rem);
        }
        @media (max-width: 640px) {
          .dlv-row {
            grid-template-columns: 2.5rem 1fr;
            gap: 0.5rem 1.25rem;
            padding: 1.5rem 0;
          }
          .dlv-idx { grid-row: 1; }
          .dlv-body { grid-column: 2; grid-row: 1; }
          .dlv-val { grid-column: 2; grid-row: 2; text-align: left; }
          .dlv-pay { grid-template-columns: 1fr; gap: 2.5rem; }
        }
      `}</style>
    </div>
  );
}
