import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика конфиденциальности ENDMARKET.",
};

const SECTIONS = [
  {
    n: "01",
    title: "Общие положения",
    text: "Настоящая политика конфиденциальности регулирует порядок обработки персональных данных пользователей сайта endmarket.ru. Используя сайт, вы соглашаетесь с условиями настоящей политики. Оператор персональных данных: ENDMARKET, Москва, Россия. Email: info@endmarket.ru.",
  },
  {
    n: "02",
    title: "Собираемые данные",
    text: "Мы собираем данные, которые вы предоставляете добровольно: имя, адрес электронной почты, номер телефона, почтовый адрес — при оформлении заказа, записи в шоурум или подаче заявки на участие в дизайнерской программе. Также автоматически фиксируются технические данные: IP-адрес, тип браузера, данные cookies.",
  },
  {
    n: "03",
    title: "Цели обработки",
    text: "Персональные данные используются для: обработки заказов и коммуникации по ним; ответа на запросы через форму обратной связи; отправки информационных материалов (при наличии согласия); улучшения работы сайта и качества сервиса.",
  },
  {
    n: "04",
    title: "Хранение и защита",
    text: "Данные хранятся на защищённых серверах в ЕС. Мы применяем технические и организационные меры для защиты данных от несанкционированного доступа. Срок хранения — не более необходимого для достижения целей обработки, если иное не предусмотрено законодательством.",
  },
  {
    n: "05",
    title: "Права субъекта данных",
    text: "В соответствии с GDPR вы вправе: запросить доступ к своим данным; потребовать их исправления или удаления; отозвать согласие на обработку; подать жалобу в надзорный орган. Запросы направляйте на: privacy@endmarket.ru",
  },
  {
    n: "06",
    title: "Cookies",
    text: "Сайт использует технические cookies, необходимые для корректной работы (корзина, сессия). Аналитические cookies используются только с вашего согласия. Вы можете управлять cookies в настройках браузера.",
  },
  {
    n: "07",
    title: "Изменения политики",
    text: "Мы оставляем за собой право вносить изменения в настоящую политику. Актуальная версия всегда доступна по адресу endmarket.ru/privacy. Дата последнего обновления: 1 января 2024.",
  },
];

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f8f6" }}>
      <div style={{ height: "72px" }} />

      <section style={{ padding: "5rem 2rem 4rem", borderBottom: "1px solid #e0ddd8" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1.5rem" }}>
          ENDMARKET / ПРАВОВАЯ ИНФОРМАЦИЯ
        </p>
        <h1 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, letterSpacing: "0.01em", color: "#080808", lineHeight: 0.9, margin: 0 }}>
          ПОЛИТИКА<br />
          <span style={{ fontWeight: 300, color: "#a8a8a2" }}>КОНФИДЕНЦИАЛЬНОСТИ</span>
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
          <a href="mailto:privacy@endmarket.ru" style={{ color: "#080808", textDecoration: "underline", textUnderlineOffset: "3px" }}>privacy@endmarket.ru</a>
          {" · "}
          <Link href="/terms" style={{ color: "#080808", textDecoration: "underline", textUnderlineOffset: "3px" }}>Публичная оферта</Link>
        </p>
      </section>
    </div>
  );
}
