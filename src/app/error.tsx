"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
          Системная ошибка
        </p>
        <h2
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
          ЧТО-ТО
          <br />
          ПОШЛО НЕ ТАК
        </h2>
        <p
          style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "0.8125rem",
            fontWeight: 300,
            color: "#6e6e66",
            maxWidth: "320px",
            margin: "0 auto 3rem",
            lineHeight: 1.7,
          }}
        >
          Произошла непредвиденная ошибка. Попробуйте ещё раз или свяжитесь с нами.
        </p>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={reset}
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.625rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#f8f8f6",
              backgroundColor: "#080808",
              border: "none",
              padding: "0.75rem 1.5rem",
              cursor: "pointer",
            }}
          >
            Повторить
          </button>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.625rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#080808",
              textDecoration: "none",
              borderBottom: "1px solid #080808",
              paddingBottom: "2px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
