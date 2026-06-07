"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";

// Email regex — RFC-5322 simplified
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Step = "form" | "success";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Россия",
    city: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [reference, setReference] = useState("");

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Введите имя и фамилию";
    if (!EMAIL_RE.test(form.email)) e.email = "Введите корректный email";
    if (!form.city.trim()) e.city = "Введите город";
    if (!form.address.trim() || form.address.trim().length < 5) e.address = "Введите адрес доставки";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setApiError("");
    setIsSubmitting(true);
    try {
      const payload = {
        form,
        items: items.map((i) => ({
          productId: i.product.id,
          slug: i.product.slug,
          name: i.product.name,
          quantity: i.quantity,
          clientPrice: i.product.price,
        })),
      };
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || "Ошибка при отправке заказа. Попробуйте ещё раз.");
        return;
      }
      clear();
      // Redirect to YooKassa payment page (or dev success page)
      if (data.payment_url) {
        window.location.href = data.payment_url;
        return;
      }
      setReference(data.reference || "");
      setStep("success");
    } catch {
      setApiError("Не удалось связаться с сервером. Проверьте соединение.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "success") {
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
        <div style={{ textAlign: "center", maxWidth: "520px", padding: "2rem" }}>
          <div
            style={{ width: "48px", height: "1px", backgroundColor: "#080808", margin: "0 auto 4rem" }}
          />
          <p
            className="label"
            style={{ color: "#a8a8a2", marginBottom: "1.5rem", letterSpacing: "0.2em" }}
          >
            ENDMARKET — ПОДТВЕРЖДЕНИЕ
          </p>
          <h1
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: "-0.01em",
              color: "#080808",
              marginBottom: "2rem",
            }}
          >
            ЗАКАЗ
            <br />
            ПРИНЯТ
          </h1>
          {reference && (
            <p
              style={{
                fontFamily: "var(--font-barlow)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#080808",
                marginBottom: "1.5rem",
                fontWeight: 500,
              }}
            >
              {reference}
            </p>
          )}
          <p
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.875rem",
              fontWeight: 300,
              lineHeight: 1.8,
              color: "#6e6e66",
              marginBottom: "0.5rem",
            }}
          >
            Мы свяжемся с вами в течение 24 часов для подтверждения заказа и согласования деталей.
          </p>
          <p
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.8125rem",
              fontWeight: 300,
              color: "#a8a8a2",
              marginBottom: "4rem",
            }}
          >
            Доставка по Москве — 1–2 дня. Доставка по России — 3–7 рабочих дней.
          </p>
          <div
            style={{ width: "48px", height: "1px", backgroundColor: "#e0ddd8", margin: "0 auto 3rem" }}
          />
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.6875rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#080808",
              textDecoration: "none",
              borderBottom: "1px solid #080808",
              paddingBottom: "3px",
            }}
          >
            На главную
          </Link>
        </div>
      </div>
    );
  }

  const label = (text: string) => (
    <label
      style={{
        fontFamily: "var(--font-barlow)",
        fontSize: "0.625rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase" as const,
        color: "#a8a8a2",
        display: "block",
        marginBottom: "0.5rem",
      }}
    >
      {text}
    </label>
  );

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "0.875rem 0",
    fontFamily: "var(--font-barlow)",
    fontSize: "0.9375rem",
    fontWeight: 300,
    color: "#080808",
    background: "none",
    border: "none",
    borderBottom: "1px solid #e0ddd8",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100svh", backgroundColor: "#f8f8f6", paddingTop: "64px" }}>
      {/* Header */}
      <div style={{ padding: "2.5rem 2rem 1.75rem", borderBottom: "1px solid #e0ddd8" }}>
        <p className="label" style={{ color: "#a8a8a2", marginBottom: "0.75rem" }}>
          Шаг 1 из 1
        </p>
        <h1
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.01em",
            color: "#080808",
          }}
        >
          ОФОРМЛЕНИЕ ЗАКАЗА
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="checkout-grid">
        {/* Left: Form */}
        <div style={{ padding: "2.5rem 2rem", borderRight: "1px solid #e0ddd8" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {/* Contact */}
            <section>
              <p
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#080808",
                  marginBottom: "1.75rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid #e0ddd8",
                }}
              >
                Контактные данные
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  {label("Имя и фамилия *")}
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Александр Иванов"
                    style={{ ...inputBase, borderColor: errors.name ? "#c0392b" : "#e0ddd8" }}
                    onFocus={(e) => (e.target.style.borderColor = "#080808")}
                    onBlur={(e) => (e.target.style.borderColor = errors.name ? "#c0392b" : "#e0ddd8")}
                  />
                  {errors.name && (
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", color: "#c0392b", marginTop: "0.25rem" }}>
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  {label("Email *")}
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="hello@example.com"
                    style={{ ...inputBase, borderColor: errors.email ? "#c0392b" : "#e0ddd8" }}
                    onFocus={(e) => (e.target.style.borderColor = "#080808")}
                    onBlur={(e) => (e.target.style.borderColor = errors.email ? "#c0392b" : "#e0ddd8")}
                  />
                  {errors.email && (
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", color: "#c0392b", marginTop: "0.25rem" }}>
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  {label("Телефон")}
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+7 (999) 000-00-00"
                    style={inputBase}
                    onFocus={(e) => (e.target.style.borderColor = "#080808")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0ddd8")}
                  />
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section>
              <p
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#080808",
                  marginBottom: "1.75rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid #e0ddd8",
                }}
              >
                Адрес доставки
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  {label("Страна")}
                  <input
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    style={inputBase}
                    onFocus={(e) => (e.target.style.borderColor = "#080808")}
                    onBlur={(e) => (e.target.style.borderColor = "#e0ddd8")}
                  />
                </div>
                <div>
                  {label("Город *")}
                  <input
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="Москва"
                    style={{ ...inputBase, borderColor: errors.city ? "#c0392b" : "#e0ddd8" }}
                    onFocus={(e) => (e.target.style.borderColor = "#080808")}
                    onBlur={(e) => (e.target.style.borderColor = errors.city ? "#c0392b" : "#e0ddd8")}
                  />
                  {errors.city && (
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", color: "#c0392b", marginTop: "0.25rem" }}>
                      {errors.city}
                    </p>
                  )}
                </div>
                <div>
                  {label("Адрес *")}
                  <input
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="ул. Арбат, д. 1, кв. 10"
                    style={{ ...inputBase, borderColor: errors.address ? "#c0392b" : "#e0ddd8" }}
                    onFocus={(e) => (e.target.style.borderColor = "#080808")}
                    onBlur={(e) => (e.target.style.borderColor = errors.address ? "#c0392b" : "#e0ddd8")}
                  />
                  {errors.address && (
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", color: "#c0392b", marginTop: "0.25rem" }}>
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Notes */}
            <section>
              <p
                style={{
                  fontFamily: "var(--font-barlow-condensed)",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#080808",
                  marginBottom: "1.75rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid #e0ddd8",
                }}
              >
                Комментарий
              </p>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Пожелания по отделке, монтажу, особые требования..."
                rows={4}
                style={{ ...inputBase, resize: "vertical" }}
                onFocus={(e) => (e.target.style.borderColor = "#080808")}
                onBlur={(e) => (e.target.style.borderColor = "#e0ddd8")}
              />
            </section>

            <div>
              {apiError && (
                <p
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.75rem",
                    color: "#c0392b",
                    marginBottom: "1rem",
                    lineHeight: 1.5,
                  }}
                >
                  {apiError}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: isSubmitting ? "#6e6e66" : "#080808",
                  color: "#f8f8f6",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "1.125rem 2.5rem",
                  transition: "background-color 0.2s",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = "#1a1a18"; }}
                onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = "#080808"; }}
              >
                {isSubmitting ? "Перенаправление..." : "Перейти к оплате"}
              </button>
              <p
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.6875rem",
                  fontWeight: 300,
                  color: "#a8a8a2",
                  lineHeight: 1.6,
                  marginTop: "1.25rem",
                  maxWidth: "380px",
                }}
              >
                Нажимая «Перейти к оплате», вы соглашаетесь с условиями обработки персональных данных.
                Оплата через YooKassa — безопасно и быстро.
              </p>
            </div>
          </form>
        </div>

        {/* Right: Order summary */}
        <div style={{ padding: "2.5rem 2rem", backgroundColor: "#f0efec" }} className="checkout-summary-sticky">
            <p
              style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#080808",
                marginBottom: "1.75rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid #e0ddd8",
              }}
            >
              Ваш заказ
            </p>

            {items.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.875rem",
                    fontWeight: 300,
                    color: "#6e6e66",
                    marginBottom: "1.25rem",
                  }}
                >
                  Корзина пуста
                </p>
                <Link
                  href="/collection"
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.6875rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#080808",
                    textDecoration: "none",
                    borderBottom: "1px solid #080808",
                    paddingBottom: "2px",
                  }}
                >
                  Перейти в каталог
                </Link>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      style={{
                        display: "flex",
                        gap: "1.25rem",
                        alignItems: "flex-start",
                        padding: "1.25rem 0",
                        borderBottom: "1px solid #e0ddd8",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "64px",
                          flexShrink: 0,
                          aspectRatio: "3/4",
                          backgroundColor: "#ededeb",
                        }}
                      >
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          style={{ objectFit: "cover", filter: "grayscale(20%)" }}
                          sizes="80px"
                          unoptimized
/>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontFamily: "var(--font-barlow-condensed)",
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "#080808",
                            lineHeight: 1.1,
                            marginBottom: "0.25rem",
                          }}
                        >
                          {item.product.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-barlow)",
                            fontSize: "0.6875rem",
                            fontWeight: 300,
                            color: "#6e6e66",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {item.product.subtitle}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-barlow)",
                            fontSize: "0.6875rem",
                            color: "#a8a8a2",
                          }}
                        >
                          × {item.quantity}
                        </p>
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-barlow)",
                          fontSize: "0.9375rem",
                          fontWeight: 400,
                          color: "#080808",
                          flexShrink: 0,
                        }}
                      >
                        ₽{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="label" style={{ color: "#6e6e66" }}>
                      Сумма заказа
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-barlow)",
                        fontSize: "0.875rem",
                        color: "#080808",
                      }}
                    >
                      ₽{total.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="label" style={{ color: "#6e6e66" }}>
                      Доставка
                    </span>
                    <span className="label" style={{ color: "#6e6e66" }}>
                      По запросу
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      borderTop: "1px solid #e0ddd8",
                      paddingTop: "1rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-barlow-condensed)",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#080808",
                      }}
                    >
                      Итого
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-barlow-condensed)",
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        color: "#080808",
                      }}
                    >
                      ₽{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "2rem",
                    padding: "1.25rem",
                    backgroundColor: "#f8f8f6",
                    border: "1px solid #e0ddd8",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-barlow)",
                      fontSize: "0.75rem",
                      fontWeight: 300,
                      lineHeight: 1.7,
                      color: "#6e6e66",
                    }}
                  >
                    <span style={{ color: "#080808", fontWeight: 400 }}>Оплата через YooKassa.</span>{" "}
                    Полная оплата картой при оформлении. Доставка: 1–7 дней в зависимости от региона.
                  </p>
                </div>
              </>
            )}
        </div>
      </div>

      <style>{`
        .checkout-grid { align-items: start; }
        .checkout-summary-sticky {
          position: sticky;
          top: calc(64px + 2rem);
          align-self: start;
        }
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
          .checkout-summary-sticky {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
