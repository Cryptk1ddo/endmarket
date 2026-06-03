import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ENDMARKET — Монтаж и установка",
  description:
    "Профессиональный монтаж кондиционеров Ballu, Haier, Hisense, Daikin. Сертифицированные монтажники, гарантия на работы, обслуживание по Москве и МО.",
};

const STEPS = [
  {
    num: "01",
    title: "Замер и консультация",
    body: "Выезд специалиста, расчёт мощности под площадь помещения, выбор оптимальной модели. Бесплатно при покупке оборудования.",
  },
  {
    num: "02",
    title: "Монтаж внутреннего блока",
    body: "Крепление на несущую стену, разводка фреоновой магистрали, дренажной трубки и кабеля питания.",
  },
  {
    num: "03",
    title: "Монтаж наружного блока",
    body: "Установка на фасад или кровлю с применением сертифицированного крепления. Работа на высоте — с альпинистским снаряжением.",
  },
  {
    num: "04",
    title: "Вакуумирование и заправка",
    body: "Откачка влаги и воздуха из системы. Дозаправка фреоном R32 или R410A до заводского норматива.",
  },
  {
    num: "05",
    title: "Пуско-наладка",
    body: "Тестирование всех режимов, проверка температурного перепада и давления в системе. Настройка пульта и Wi-Fi модуля.",
  },
  {
    num: "06",
    title: "Гарантийное обслуживание",
    body: "Годовое ТО в подарок: чистка фильтров, проверка давления, диагностика электроники. Выезд в течение 24 часов при неисправности.",
  },
];

const PRICES = [
  { service: "Настенный сплит (до 12 BTU)", price: "от 6 900 ₽" },
  { service: "Настенный сплит (18–24 BTU)", price: "от 8 900 ₽" },
  { service: "Кассетный кондиционер", price: "от 14 900 ₽" },
  { service: "Канальный кондиционер", price: "от 18 900 ₽" },
  { service: "Мультисплит (2 блока)", price: "от 16 900 ₽" },
  { service: "Демонтаж старого оборудования", price: "от 3 500 ₽" },
];

export default function InstallationPage() {
  return (
    <main
      style={{
        minHeight: "100svh",
        backgroundColor: "#f8f8f6",
        paddingTop: "64px",
      }}
    >
      {/* Hero */}
      <section
        style={{
          maxWidth: "1920px",
          margin: "0 auto",
          padding: "6rem 1.5rem 4rem",
          borderBottom: "1px solid #e0e0dc",
        }}
      >
        <p
          style={{
            margin: "0 0 1.5rem",
            fontFamily: "var(--font-barlow)",
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#a8a8a2",
          }}
        >
          ENDMARKET — МОНТАЖ
        </p>
        <h1
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontSize: "clamp(4rem, 10vw, 9rem)",
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.02em",
            color: "#080808",
            textTransform: "uppercase",
            margin: "0 0 2rem",
            maxWidth: "900px",
          }}
        >
          Монтаж<br />и установка
        </h1>
        <p
          style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            fontWeight: 300,
            lineHeight: 1.7,
            color: "#555",
            maxWidth: "600px",
            margin: 0,
          }}
        >
          Сертифицированная бригада. Работаем с Ballu, Haier, Hisense и Daikin.
          Монтаж в день доставки. Гарантия на работы 2 года.
        </p>
      </section>

      {/* Steps */}
      <section
        style={{
          maxWidth: "1920px",
          margin: "0 auto",
          padding: "5rem 1.5rem",
          borderBottom: "1px solid #e0e0dc",
        }}
      >
        <p
          style={{
            margin: "0 0 3rem",
            fontFamily: "var(--font-barlow)",
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#a8a8a2",
          }}
        >
          Этапы работ
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "0",
          }}
        >
          {STEPS.map((step) => (
            <div
              key={step.num}
              style={{
                padding: "2.5rem",
                borderTop: "1px solid #e0e0dc",
                borderRight: "1px solid #e0e0dc",
              }}
            >
              <p
                style={{
                  margin: "0 0 1rem",
                  fontFamily: "var(--font-barlow-condensed)",
                  fontSize: "3rem",
                  fontWeight: 900,
                  color: "#e0e0dc",
                  lineHeight: 1,
                }}
              >
                {step.num}
              </p>
              <p
                style={{
                  margin: "0 0 0.75rem",
                  fontFamily: "var(--font-barlow)",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#080808",
                }}
              >
                {step.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-barlow)",
                  fontSize: "14px",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: "#555",
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section
        style={{
          maxWidth: "1920px",
          margin: "0 auto",
          padding: "5rem 1.5rem",
          borderBottom: "1px solid #e0e0dc",
        }}
      >
        <p
          style={{
            margin: "0 0 3rem",
            fontFamily: "var(--font-barlow)",
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#a8a8a2",
          }}
        >
          Стоимость работ
        </p>
        <div style={{ maxWidth: "680px" }}>
          {PRICES.map((row, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.25rem 0",
                borderBottom: "1px solid #e0e0dc",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "#333",
                }}
              >
                {row.service}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#080808",
                  whiteSpace: "nowrap",
                }}
              >
                {row.price}
              </span>
            </div>
          ))}
          <p
            style={{
              margin: "1.5rem 0 0",
              fontFamily: "var(--font-barlow)",
              fontSize: "12px",
              fontWeight: 300,
              color: "#a8a8a2",
              lineHeight: 1.6,
            }}
          >
            Цены указаны для стандартных условий монтажа (высота до 3 м,
            трасса до 5 м). Точная стоимость — по результатам замера.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          maxWidth: "1920px",
          margin: "0 auto",
          padding: "5rem 1.5rem",
        }}
      >
        <p
          style={{
            margin: "0 0 1rem",
            fontFamily: "var(--font-barlow)",
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#a8a8a2",
          }}
        >
          Оставить заявку
        </p>
        <h2
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
            color: "#080808",
            textTransform: "uppercase",
            margin: "0 0 2rem",
          }}
        >
          Вызвать замерщика
        </h2>
        <p
          style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "14px",
            fontWeight: 300,
            color: "#555",
            marginBottom: "2.5rem",
            lineHeight: 1.7,
            maxWidth: "500px",
          }}
        >
          Напишите нам — согласуем удобное время выезда специалиста.
          Бесплатный замер при покупке оборудования в ENDMARKET.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link
            href="/contact"
            style={{
              display: "inline-block",
              padding: "0.875rem 2.5rem",
              backgroundColor: "#080808",
              color: "#f3f3f1",
              fontFamily: "var(--font-barlow)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Связаться
          </Link>
          <Link
            href="/collection"
            style={{
              display: "inline-block",
              padding: "0.875rem 2.5rem",
              border: "1px solid #d0d0cc",
              color: "#080808",
              fontFamily: "var(--font-barlow)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Все модели
          </Link>
        </div>
      </section>
    </main>
  );
}
