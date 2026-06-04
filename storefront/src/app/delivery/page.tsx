import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description: "Сроки и условия доставки кондиционеров ENDMARKET.",
};

const TIMELINES = [
  { stage: "Обработка заказа", region: "Москва / МО", other: "Вся Россия", note: "После подтверждения оплаты" },
  { stage: "Доставка по Москве", region: "1–2 дня", other: "—", note: "Курьерская доставка до двери" },
  { stage: "Доставка по России", region: "—", other: "3–7 рабочих дней", note: "СДЭК, Boxberry или Почта России" },
  { stage: "Монтаж (по запросу)", region: "По договорённости", other: "По договорённости", note: "Сертифицированные монтажники" },
];

export default function DeliveryPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f8f6" }}>
      <div style={{ height: "72px" }} />

      <section style={{ padding: "5rem 2rem 4rem", borderBottom: "1px solid #e0ddd8" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1.5rem" }}>
          ENDMARKET / ДОСТАВКА
        </p>
        <h1 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 900, letterSpacing: "0.01em", color: "#080808", lineHeight: 0.9, margin: 0 }}>
          СРОКИ И<br />
          <span style={{ fontWeight: 300, color: "#a8a8a2" }}>ЛОГИСТИКА</span>
        </h1>
      </section>

      {/* Timeline table */}
      <section style={{ padding: "4rem 2rem", borderBottom: "1px solid #e0ddd8", maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "2rem" }}>Сроки</p>
        <div style={{ borderTop: "1px solid #e0ddd8" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", padding: "0.75rem 0", borderBottom: "1px solid #e0ddd8" }}>
            {["Этап", "Москва / МО", "Вся Россия", "Примечание"].map((h) => (
              <span key={h} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a8a8a2" }}>{h}</span>
            ))}
          </div>
          {TIMELINES.map((row) => (
            <div key={row.stage} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 2fr", padding: "1.25rem 0", borderBottom: "1px solid #e0ddd8", alignItems: "center" }}>
              <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.03em", color: "#080808" }}>{row.stage}</span>
              <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, color: "#4a4a44" }}>{row.region}</span>
              <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, color: "#4a4a44" }}>{row.other}</span>
              <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 300, color: "#a8a8a2" }}>{row.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Payment */}
      <section style={{ padding: "4rem 2rem", borderBottom: "1px solid #e0ddd8", maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "2rem" }}>Оплата</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem", borderLeft: "1px solid #e0ddd8" }}>
          {[
            { title: "Оплата онлайн", text: "Банковская карта через YooKassa. Полная оплата при оформлении заказа. Безопасный эквайринг." },
            { title: "Возврат и обмен", text: "Возврат в течение 14 дней при сохранении товарного вида. Обмен по договорённости." },
          ].map((item) => (
            <div key={item.title} style={{ padding: "2rem", borderRight: "1px solid #e0ddd8" }}>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.25rem", fontWeight: 700, letterSpacing: "0.03em", color: "#080808", marginBottom: "0.75rem" }}>{item.title}</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.7, color: "#6e6e66" }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "3rem 2rem" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, color: "#6e6e66" }}>
          Вопросы по логистике?{" "}
          <Link href="/contact" style={{ color: "#080808", textDecoration: "underline", textUnderlineOffset: "3px" }}>Свяжитесь с нами</Link>
        </p>
      </section>
    </div>
  );
}
