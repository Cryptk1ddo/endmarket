"use client";

import { useState } from "react";

export default function DesignersForm() {
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
    <section style={{ padding: "4rem 2rem", borderTop: "1px solid #e0ddd8" }}>
      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "2.5rem" }}>
        Заявка на участие
      </p>
      {sent ? (
        <div>
          <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.5rem", fontWeight: 700, color: "#080808" }}>Заявка принята.</p>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, color: "#6e6e66", marginTop: "0.5rem" }}>Рассматриваем в течение 5 рабочих дней.</p>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem 3rem", maxWidth: "800px" }}>
          <input required placeholder="Имя и фамилия" style={field} />
          <input required type="email" placeholder="Email" style={field} />
          <input required placeholder="Компания / студия" style={field} />
          <input required placeholder="Сайт / Instagram" style={field} />
          <select required defaultValue="" style={{ ...field, appearance: "none" as const, cursor: "pointer" }}>
            <option value="" disabled>Специализация</option>
            <option>Архитектура</option>
            <option>Дизайн интерьера</option>
            <option>Девелопмент</option>
            <option>Подрядные работы</option>
          </select>
          <input placeholder="Примерный годовой бюджет (€)" style={field} />
          <div style={{ gridColumn: "1 / -1" }}>
            <textarea placeholder="Расскажите о типичных проектах" rows={4} style={{ ...field, borderBottom: "none", border: "1px solid #e0ddd8", padding: "1rem", resize: "none" }} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button
              type="submit"
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f8f8f6", background: "#080808", border: "none", padding: "1.125rem 2rem", cursor: "pointer" }}
            >
              Подать заявку
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
