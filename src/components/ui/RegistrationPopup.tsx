"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "em_reg_popup_dismissed";
const DELAY_MS = 12000;

export default function RegistrationPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const shouldShowOnPage = pathname.startsWith("/product") || pathname.startsWith("/collection");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!shouldShowOnPage) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [shouldShowOnPage]);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) return;
    setLoading(true);
    // Optimistic — fire and forget
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, source: "registration_popup" }),
      });
    } catch {
      // silent fail
    }
    setLoading(false);
    setSubmitted(true);
    setTimeout(dismiss, 2800);
  };

  if (!shouldShowOnPage || !visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={dismiss}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 300,
          backgroundColor: "rgba(8,8,8,0.72)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      />

      {/* Panel — centred */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Регистрация — бесплатный замер"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 301,
          width: "min(760px, calc(100vw - 2rem))",
          backgroundColor: "#f8f8f6",
          border: "1px solid #e0ddd8",
          borderTop: "2px solid #080808",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Left: image — no padding */}
        <div
          style={{
            position: "relative",
            width: "45%",
            flexShrink: 0,
            minHeight: "100%",
            backgroundColor: "#111",
          }}
        >
          <Image
            src="/heroimages/interior.png"
            alt="Интерьер с кинематографичным светом"
            fill
            sizes="(max-width: 768px) 45vw, 340px"
            style={{ objectFit: "cover", filter: "grayscale(18%) contrast(1.06) brightness(0.7)" }}
            priority
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(8,8,8,0.18) 0%, rgba(8,8,8,0.62) 100%)",
            }}
          />
          <p
            style={{
              position: "absolute",
              left: "0.75rem",
              bottom: "0.75rem",
              margin: 0,
              fontFamily: "var(--font-barlow)",
              fontSize: "0.5rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(248,248,246,0.72)",
            }}
          >
            ENDMARKET / CINEMATIC SERIES
          </p>
        </div>

        {/* Right: form content */}
        <div style={{ flex: 1, padding: "2.5rem 2rem 2.5rem", position: "relative" }}>
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Закрыть"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#080808",
            fontSize: "1.125rem",
            lineHeight: 1,
            padding: "0.25rem 0.5rem",
            opacity: 0.5,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
        >
          ×
        </button>

        {submitted ? (
          /* Success state */
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.5625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#a8a8a2", margin: 0 }}>
              ENDMARKET / ПОДТВЕРЖДЕНО
            </p>
            <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.01em", color: "#080808", margin: 0 }}>
              МЫ СВЯЖЕМСЯ<br />С ВАМИ
            </h2>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 300, lineHeight: 1.7, color: "#6e6e66", margin: 0 }}>
              Наш специалист запишет вас на бесплатный выезд и замер.
            </p>
          </div>
        ) : (
          <>
            {/* Label */}
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.5625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1rem" }}>
              ENDMARKET / РЕГИСТРАЦИЯ
            </p>

            {/* Headline */}
            <h2 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.01em", color: "#080808", marginBottom: "0.75rem" }}>
              ПРИ РЕГИСТРАЦИИ<br />— ВЫЕЗД И ЗАМЕР<br />БЕСПЛАТНО
            </h2>

            {/* Subline */}
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 300, lineHeight: 1.7, color: "#6e6e66", marginBottom: "1.75rem" }}>
              Специалист приедет, замерит помещение и подберёт оборудование.<br />
              Без обязательств — бесплатно.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  autoComplete="email"
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "0 1rem",
                    border: "1px solid #d0cdc8",
                    backgroundColor: "transparent",
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.8125rem",
                    fontWeight: 300,
                    color: "#080808",
                    outline: "none",
                    boxSizing: "border-box",
                    borderRadius: 0,
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#080808")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#d0cdc8")}
                />
              </div>

              <div style={{ position: "relative" }}>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Телефон"
                  autoComplete="tel"
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "0 1rem",
                    border: "1px solid #d0cdc8",
                    backgroundColor: "transparent",
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.8125rem",
                    fontWeight: 300,
                    color: "#080808",
                    outline: "none",
                    boxSizing: "border-box",
                    borderRadius: 0,
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#080808")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#d0cdc8")}
                />
              </div>

              <button
                type="submit"
                disabled={loading || (!email && !phone)}
                style={{
                  height: "52px",
                  backgroundColor: "#080808",
                  color: "#f8f8f6",
                  border: "none",
                  cursor: loading || (!email && !phone) ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.625rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  opacity: loading || (!email && !phone) ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {loading ? "..." : "Записаться на замер"}
              </button>

              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.5625rem", letterSpacing: "0.04em", color: "#c0bdb8", margin: 0 }}>
                Нажимая кнопку, вы соглашаетесь с{" "}
                <a href="/privacy" style={{ color: "#a8a8a2", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                  политикой конфиденциальности
                </a>
              </p>
            </form>
          </>
        )}
        </div>
      </div>
    </>
  );
}
