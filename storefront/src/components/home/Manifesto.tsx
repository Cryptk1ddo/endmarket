
export default function Manifesto() {
  return (
    <section
      style={{
        padding: "5rem 2rem",
        backgroundColor: "#f8f8f6",
        borderTop: "1px solid #e0ddd8",
        borderBottom: "1px solid #e0ddd8",
      }}
    >
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <p className="label" style={{ color: "#a8a8a2", marginBottom: "2rem" }}>
          Манифест — 2024
        </p>

        <h2
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontSize: "clamp(2rem, 5vw, 4.5rem)",
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
            color: "#080808",
            marginBottom: "2.5rem",
          }}
        >
          Климат — это не просто опция или функция,
          <br />
          <span style={{ fontWeight: 300, color: "#6e6e66" }}>это атмосфера, в которой хочется жить.</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            paddingTop: "2.5rem",
            borderTop: "1px solid #e0ddd8",
          }}
          className="manifesto-cols"
        >
          <p
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.8125rem",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "#6e6e66",
            }}
          >
            Каждая установка кондиционера начинается с вопроса:
            {" "}«Где оптимально разместить внутренний блок, чтобы обеспечить равномерное охлаждение всего помещения?»
            {" "}«Какие задачи должен решать кондиционер — просто охлаждать воздух, очищать его или поддерживать точную температуру?»
          </p>
          <p
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.8125rem",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "#6e6e66",
            }}
          >
            И мы знаем ответы на ваши вопросы, и знаем как воплотить это в реальность — от консультации до запуска системы.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .manifesto-cols { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
      `}</style>
    </section>
  );
}
