"use client";

import { useState } from "react";

export default function AppointmentForm() {
  const [sent, setSent] = useState(false);

  const field = {
    fontFamily: "var(--font-barlow)",
    fontSize: "0.875rem",
    fontWeight: 300,
    color: "#080808",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #e0ddd8",
    outline: "none",
    padding: "0.75rem 0",
    width: "100%",
  } as React.CSSProperties;

  return (
    <div style={{ padding: "4rem 2rem" }}>
      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "2.5rem" }}>
        Запись на посещение
      </p>
      {sent ? (
        <div style={{ padding: "3rem 0" }}>
          <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.5rem", fontWeight: 700, color: "#080808" }}>Запись подтверждена.</p>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, color: "#6e6e66", marginTop: "0.5rem" }}>Мы свяжемся для подтверждения даты.</p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <input required placeholder="Имя" style={field} />
            <input required type="email" placeholder="Email" style={field} />
          </div>
          <input required type="date" style={field} />
          <select defaultValue="" style={{ ...field, appearance: "none" as const, cursor: "pointer" }}>
            <option value="" disabled>Цель визита</option>
            <option>Общее ознакомление</option>
            <option>Подбор изделий для проекта</option>
            <option>Встреча с дизайнером</option>
          </select>
          <textarea placeholder="Комментарий (необязательно)" rows={4} style={{ ...field, borderBottom: "none", border: "1px solid #e0ddd8", padding: "1rem", resize: "none" }} />
          <button
            type="submit"
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f8f8f6", background: "#080808", border: "none", padding: "1.125rem 2rem", cursor: "pointer", textAlign: "left" }}
          >
            Записаться
          </button>
        </form>
      )}
    </div>
  );
}
