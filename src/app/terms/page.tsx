import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Публичная оферта",
  description: "Условия продажи и публичная оферта ENDMARKET.",
};

const SECTIONS = [
  {
    n: "01",
    title: "Предмет оферты",
    text: "Настоящий документ является публичной офертой ENDMARKET (ИП / ООО, далее — Продавец) и содержит условия продажи кондиционеров Ballu, Haier, Hisense, Daikin, представленных на сайте endmarket.ru. Принятие оферты (акцепт) осуществляется путём оформления заказа на сайте.",
  },
  {
    n: "02",
    title: "Заказ и подтверждение",
    text: "Заказ считается принятым после успешной оплаты через YooKassa и получения Покупателем письменного подтверждения на email. Продавец вправе отказать в продаже при отсутствии товара на складе.",
  },
  {
    n: "03",
    title: "Стоимость и оплата",
    text: "Цены на сайте указаны в рублях (₽) с учётом НДС. Оплата производится онлайн картой через платёжный сервис YooKassa (ООО НКО «ЮМани»). Полная оплата при оформлении заказа.",
  },
  {
    n: "04",
    title: "Сроки отправки",
    text: "Обработка заказа — в течение 1 рабочего дня. Доставка по Москве и МО — 1–2 дня. Доставка по России — 3–7 рабочих дней. Точные сроки зависят от региона и наличия товара.",
  },
  {
    n: "05",
    title: "Доставка",
    text: "Доставка осуществляется по всей России курьерскими службами СДЭК, Boxberry или Почтой России. Стоимость доставки включена в цену или рассчитывается при оформлении. Право собственности переходит к Покупателю с момента передачи изделия перевозчику.",
  },
  {
    n: "06",
    title: "Возврат и обмен",
    text: "Возврат товара надлежащего качества возможен в течение 14 дней с момента получения при сохранении товарного вида, потребительских свойств и документов. Возврат товара с производственным дефектом — в течение гарантийного срока за счёт Продавца.",
  },
  {
    n: "07",
    title: "Гарантия",
    text: "Гарантийный срок на оборудование — согласно документации производителя (Ballu, Haier, Hisense, Daikin): как правило, 1–3 года. Гарантия не распространяется на повреждения, вызванные ненадлежащей установкой, неправильной эксплуатацией или механическими повреждениями.",
  },
  {
    n: "08",
    title: "Применимое право",
    text: "Настоящая оферта регулируется законодательством Российской Федерации. Все споры подлежат рассмотрению в соответствии с действующим законодательством РФ. Продавец: ENDMARKET. Контакт: support@endmarket.ru.",
  },
];

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f8f6" }}>
      <div style={{ height: "72px" }} />

      <section style={{ padding: "5rem 2rem 4rem", borderBottom: "1px solid #e0ddd8" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1.5rem" }}>
          ENDMARKET / ПРАВОВАЯ ИНФОРМАЦИЯ
        </p>
        <h1 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, letterSpacing: "0.01em", color: "#080808", lineHeight: 0.9, margin: 0 }}>
          ПУБЛИЧНАЯ<br />
          <span style={{ fontWeight: 300, color: "#a8a8a2" }}>ОФЕРТА</span>
        </h1>
      </section>

      <section style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 2rem" }}>
        {SECTIONS.map((s) => (
          <div key={s.n} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: "1.5rem", paddingBottom: "2.5rem", marginBottom: "2.5rem", borderBottom: "1px solid #e0ddd8" }}>
            <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.14em", color: "#a8a8a2", paddingTop: "0.25rem" }}>{s.n}</span>
            <div>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.125rem", fontWeight: 700, letterSpacing: "0.03em", color: "#080808", marginBottom: "0.75rem" }}>{s.title}</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, lineHeight: 1.75, color: "#4a4a44" }}>{s.text}</p>
            </div>
          </div>
        ))}

        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 300, color: "#6e6e66" }}>
          Вопросы:{" "}
          <a href="mailto:support@endmarket.ru" style={{ color: "#080808", textDecoration: "underline", textUnderlineOffset: "3px" }}>support@endmarket.ru</a>
          {" · "}
          <Link href="/privacy" style={{ color: "#080808", textDecoration: "underline", textUnderlineOffset: "3px" }}>Политика конфиденциальности</Link>
        </p>
      </section>
    </div>
  );
}
