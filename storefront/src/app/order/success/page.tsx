import Link from "next/link";

interface Props {
  searchParams: Promise<{ ref?: string; dev?: string }>;
}

export async function generateMetadata() {
  return { title: "ENDMARKET — Заказ оплачен" };
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { ref, dev } = await searchParams;

  return (
    <div
      style={{
        minHeight: "100svh",
        backgroundColor: "#f8f8f6",
        paddingTop: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "560px", padding: "2rem" }}>
        <div
          style={{
            width: "48px",
            height: "1px",
            backgroundColor: "#080808",
            margin: "0 auto 4rem",
          }}
        />
        <p
          style={{
            margin: "0 0 1.5rem",
            fontFamily: "var(--font-barlow), sans-serif",
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#a8a8a2",
          }}
        >
          ENDMARKET
        </p>
        <h1
          style={{
            fontFamily: "var(--font-barlow-condensed), sans-serif",
            fontSize: "clamp(3rem, 8vw, 5.5rem)",
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.01em",
            color: "#080808",
            textTransform: "uppercase",
            marginBottom: "2.5rem",
          }}
        >
          {dev ? "Заказ оформлен" : "Оплата принята"}
        </h1>

        {ref && (
          <div
            style={{
              display: "inline-block",
              backgroundColor: "#080808",
              color: "#f3f3f1",
              padding: "1rem 2rem",
              marginBottom: "2.5rem",
            }}
          >
            <p
              style={{
                margin: "0 0 0.25rem",
                fontFamily: "var(--font-barlow), sans-serif",
                fontSize: "9px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#a8a8a2",
              }}
            >
              Номер заказа
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-barlow-condensed), sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#f3f3f1",
              }}
            >
              {ref}
            </p>
          </div>
        )}

        <p
          style={{
            margin: "0 0 3rem",
            fontFamily: "var(--font-barlow), sans-serif",
            fontSize: "14px",
            fontWeight: 300,
            lineHeight: 1.8,
            color: "#555",
          }}
        >
          {dev
            ? "Заказ оплачен. Ожидайте подтверждения на email. Мы свяжемся с вами для уточнения деталей доставки."
            : "Спасибо за покупку. Чек и подтверждение будут отправлены на ваш email. Наш менеджер свяжется с вами для уточнения сроков доставки и монтажа."}
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/collection"
            style={{
              display: "inline-block",
              padding: "0.875rem 2rem",
              backgroundColor: "#080808",
              color: "#f3f3f1",
              fontFamily: "var(--font-barlow), sans-serif",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Все модели
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "0.875rem 2rem",
              border: "1px solid #d0d0cc",
              color: "#080808",
              fontFamily: "var(--font-barlow), sans-serif",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            На главную
          </Link>
        </div>

        <div
          style={{
            width: "48px",
            height: "1px",
            backgroundColor: "#e0e0dc",
            margin: "4rem auto 0",
          }}
        />
      </div>
    </div>
  );
}
