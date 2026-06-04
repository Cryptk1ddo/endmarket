import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "404 — Объект не найден" };

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100svh",
        paddingTop: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f8f6",
      }}
    >
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ width: "1px", height: "48px", backgroundColor: "#c7c7c5", margin: "0 auto 3rem" }} />
        <p
          style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "0.625rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#a8a8a2",
            marginBottom: "2rem",
          }}
        >
          404 — Объект не найден
        </p>
        <h1
          style={{
            fontFamily: "var(--font-barlow-condensed)",
            fontSize: "clamp(8rem, 24vw, 18rem)",
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: "-0.03em",
            color: "#ebebea",
            marginBottom: "4rem",
            userSelect: "none",
          }}
        >
          404
        </h1>
        <p
          style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "0.875rem",
            fontWeight: 300,
            color: "#6e6e66",
            maxWidth: "320px",
            margin: "0 auto 3rem",
            lineHeight: 1.7,
          }}
        >
          Этот объект не существует или был удалён из каталога.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-barlow)",
            fontSize: "0.625rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#080808",
            textDecoration: "none",
            borderBottom: "1px solid #080808",
            paddingBottom: "2px",
          }}
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
