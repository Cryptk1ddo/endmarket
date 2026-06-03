import type { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь с командой ENDMARKET — консультации по подбору изделий, проектные запросы.",
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f8f6" }}>
      <div style={{ height: "72px" }} />

      <section style={{ padding: "5rem 2rem 4rem", borderBottom: "1px solid #e0ddd8" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "1.5rem" }}>
          ENDMARKET / КОНТАКТЫ
        </p>
        <h1 style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 900, letterSpacing: "0.01em", color: "#080808", lineHeight: 0.9, margin: 0 }}>
          СВЯЗАТЬСЯ<br />
          <span style={{ fontWeight: 300, color: "#a8a8a2" }}>С КОМАНДОЙ</span>
        </h1>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Contact info */}
        <div style={{ padding: "4rem 2rem", borderRight: "1px solid #e0ddd8" }}>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "2.5rem" }}>Реквизиты</p>

          {[
            { label: "Email", value: "support@endmarket.ru" },
          ].map((item) => (
            <div key={item.label} style={{ paddingBottom: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid #e0ddd8" }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "0.375rem" }}>{item.label}</p>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.125rem", fontWeight: 700, color: "#080808", letterSpacing: "0.02em" }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Contact form (client component) */}
        <Suspense fallback={<div style={{ padding: "4rem 2rem" }} />}>
          <ContactForm />
        </Suspense>
      </div>
    </div>
  );
}
