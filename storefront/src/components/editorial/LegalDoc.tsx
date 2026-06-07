import type { ReactNode } from "react";

const INK = "#080808";
const MUTED = "#6e6e66";
const FAINT = "#a8a8a2";
const LINE = "rgba(0,0,0,0.1)";
const BARLOW = "var(--font-barlow)";
const COND = "var(--font-barlow-condensed)";

interface Section {
  n: string;
  title: string;
  text: string;
}

export default function LegalDoc({
  eyebrow,
  title,
  intro,
  sections,
  footer,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  sections: Section[];
  footer?: ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f1", color: INK, fontFamily: BARLOW }}>
      <div style={{ height: "72px" }} />

      <div style={{ maxWidth: "880px", margin: "0 auto", paddingLeft: "clamp(1.5rem, 5vw, 3rem)", paddingRight: "clamp(1.5rem, 5vw, 3rem)" }}>
        {/* Hero */}
        <section style={{ paddingTop: "clamp(3rem, 9vw, 6rem)", paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <p style={{ fontSize: "1.0625rem", color: FAINT, marginBottom: "1.25rem" }}>{eyebrow}</p>
          <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 4.75rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 0.98, margin: 0 }}>
            {title}
          </h1>
          {intro && (
            <p style={{ fontSize: "1.0625rem", lineHeight: 1.6, color: MUTED, maxWidth: "34rem", marginTop: "1.75rem" }}>{intro}</p>
          )}
        </section>

        {/* Sections */}
        <section style={{ paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          {sections.map((s) => (
            <div
              key={s.n}
              style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr", gap: "1.25rem", padding: "2rem 0", borderTop: `1px solid ${LINE}`, alignItems: "baseline" }}
            >
              <span style={{ fontFamily: COND, fontSize: "1.25rem", fontWeight: 700, color: FAINT, lineHeight: 1 }}>{s.n}</span>
              <div>
                <p style={{ fontSize: "1.375rem", fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 0.6rem", lineHeight: 1.15 }}>{s.title}</p>
                <p style={{ fontSize: "1.0625rem", lineHeight: 1.7, color: MUTED, margin: 0 }}>{s.text}</p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${LINE}` }} />

          {footer && (
            <p style={{ fontSize: "1rem", color: MUTED, marginTop: "2rem" }}>{footer}</p>
          )}
        </section>
      </div>
    </div>
  );
}
