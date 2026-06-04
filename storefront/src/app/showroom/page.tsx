import type { Metadata } from "next";
import AppointmentForm from "./AppointmentForm";

export const metadata: Metadata = {
  title: "Шоурум",
  description: "Шоурум ENDMARKET в Москве. Запись на посещение по предварительной договорённости.",
};

export default function ShowroomPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f8f6" }}>
      <div style={{ height: "72px" }} />

      <section style={{ padding: "5rem 2rem 4rem", borderBottom: "1px solid #e0ddd8" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1.5rem" }}>
          ENDMARKET / ШОУРУМ
        </p>
        <h1 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 900, letterSpacing: "0.01em", color: "#080808", lineHeight: 0.9, margin: 0 }}>
          МОСКВА<br />
          <span style={{ fontWeight: 300, color: "#a8a8a2" }}>РОССИЯ</span>
        </h1>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Info */}
        <div style={{ padding: "4rem 2rem", borderRight: "1px solid #e0ddd8" }}>
          <div style={{ backgroundColor: "#ededeb", aspectRatio: "4/3", marginBottom: "3rem" }} />

          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "2rem" }}>Информация</p>

          {[
            { label: "Адрес", value: "ул. Профсоюзная, 65, Москва" },
            { label: "Часы работы", value: "Пн–Пт: 10:00–18:00\nСб: по предварительной записи" },
            { label: "Посещение", value: "Только по записи. Без записи не принимаем." },
          ].map((item) => (
            <div key={item.label} style={{ paddingBottom: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #e0ddd8" }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "0.375rem" }}>{item.label}</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9375rem", fontWeight: 300, color: "#4a4a44", lineHeight: 1.6, whiteSpace: "pre-line" }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Appointment form */}
        <AppointmentForm />
      </div>
    </div>
  );
}
