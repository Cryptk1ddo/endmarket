"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Введите корректный адрес");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка. Попробуйте ещё раз.");
        return;
      }
      setSent(true);
      setEmail("");
    } catch {
      setError("Не удалось подключиться к серверу.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        backgroundColor: "#0a0a0a",
        color: "#f8f8f6",
        padding: "5rem 2rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: "1920px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          alignItems: "center",
        }}
        className="newsletter-grid"
      >
        {/* Left: copy */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.625rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(248,248,246,0.35)",
              marginBottom: "1rem",
            }}
          >
            ENDMARKET / ИНФОРМАЦИОННЫЙ КАНАЛ
          </p>
          <h2
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: "0.02em",
              color: "#f8f8f6",
              margin: 0,
            }}
          >
            НОВЫЕ ОБЪЕКТЫ.<br />
            <span style={{ fontWeight: 300, color: "rgba(248,248,246,0.4)" }}>
              ПЕРВЫМИ.
            </span>
          </h2>
        </div>

        {/* Right: form */}
        <div>
          {sent ? (
            <div>
              <p
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: "#f8f8f6",
                  marginBottom: "0.5rem",
                }}
              >
                ПОДПИСКА ОФОРМЛЕНА
              </p>
              <p
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.875rem",
                  fontWeight: 300,
                  color: "rgba(248,248,246,0.45)",
                }}
              >
                Вы получите уведомление при выходе новых объектов.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.8125rem",
                  fontWeight: 300,
                  color: "rgba(248,248,246,0.5)",
                  marginBottom: "1.5rem",
                  lineHeight: 1.6,
                }}
              >
                Уведомления о новых объектах, выставках и закрытых превью. Без спама.
              </p>
              <div style={{ display: "flex", gap: "0" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="Ваш email"
                  required
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRight: "none",
                    color: "#f8f8f6",
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.875rem",
                    fontWeight: 300,
                    padding: "0.875rem 1rem",
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "rgba(248,248,246,0.5)" : "#f8f8f6",
                    color: "#080808",
                    border: "1px solid #f8f8f6",
                    padding: "0.875rem 1.25rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label="Подписаться"
                >
                  <ArrowRight size={18} strokeWidth={1.5} />
                </button>
              </div>
              {error && (
                <p
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.75rem",
                    color: "#c0a090",
                    marginTop: "0.5rem",
                  }}
                >
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .newsletter-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
