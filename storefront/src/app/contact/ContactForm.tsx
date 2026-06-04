"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/lib/products";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");
  const linkedProduct = productSlug ? products.find((p) => p.slug === productSlug) : null;

  const [sent, setSent] = useState(false);
  const [requestType, setRequestType] = useState(linkedProduct ? "Расчёт изделия" : "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

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
    letterSpacing: "0.02em",
  } as React.CSSProperties;

  return (
    <div style={{ padding: "4rem 2rem" }}>
      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "2.5rem" }}>
        Запрос
      </p>

      {sent ? (
        <div style={{ padding: "3rem 0" }}>
          <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.5rem", fontWeight: 700, color: "#080808" }}>Получено.</p>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, color: "#6e6e66", marginTop: "0.5rem" }}>Мы ответим в течение 24 часов.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {linkedProduct && (
            <div style={{ padding: "0.875rem 1rem", backgroundColor: "#f0ede8", borderLeft: "2px solid #080808" }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#6e6e66", margin: "0 0 0.25rem" }}>Изделие</p>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1rem", fontWeight: 700, color: "#080808", margin: 0 }}>{linkedProduct.name} — ₽{linkedProduct.price.toLocaleString()}</p>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <input required placeholder="Имя" style={field} />
            <input required type="email" placeholder="Email" style={field} />
          </div>
          <input placeholder="Телефон" style={field} />
          <select
            required
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            style={{ ...field, appearance: "none" as const, cursor: "pointer" }}
          >
            <option value="" disabled>Тип запроса</option>
            {linkedProduct && <option>Расчёт изделия</option>}
            <option>Подбор изделия</option>
            <option>Проектный запрос</option>
            <option>Дизайнерская программа</option>
            <option>Гарантийный случай</option>
            <option>Другое</option>
          </select>
          <textarea
            placeholder="Сообщение"
            rows={5}
            defaultValue={linkedProduct ? `Интересует расчёт стоимости и сроков: ${linkedProduct.name}` : ""}
            style={{ ...field, borderBottom: "none", border: "1px solid #e0ddd8", padding: "1rem", resize: "none" }}
          />
          <button
            type="submit"
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f8f8f6", background: "#080808", border: "none", padding: "1.125rem 2rem", cursor: "pointer", textAlign: "left" }}
          >
            Отправить
          </button>
        </form>
      )}
    </div>
  );
}
