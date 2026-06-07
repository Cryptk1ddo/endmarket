"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { confirmPasswordReset } from "../account-api";

const INK = "#080808";
const MUTED = "#6e6e66";
const FAINT = "#a8a8a2";
const LINE = "rgba(0,0,0,0.1)";
const BARLOW = "var(--font-barlow)";

const LABEL: React.CSSProperties = {
  fontFamily: BARLOW,
  fontSize: "0.5625rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: FAINT,
};

const INPUT: React.CSSProperties = {
  fontFamily: BARLOW,
  fontSize: "0.875rem",
  fontWeight: 300,
  color: INK,
  backgroundColor: "#f4f4f1",
  border: "1px solid #d8d8d0",
  outline: "none",
  padding: "0.95rem 1rem",
  width: "100%",
  letterSpacing: "0.02em",
};

function ResetForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 8) { setError("Минимум 8 символов"); return; }
    if (next !== confirm) { setError("Пароли не совпадают"); return; }
    setSaving(true);
    setError("");
    try {
      await confirmPasswordReset(token, next);
      setDone(true);
    } catch {
      setError("Ссылка недействительна или истекла. Запросите новую.");
    } finally {
      setSaving(false);
    }
  }

  if (!token) {
    return (
      <p style={{ fontFamily: BARLOW, fontSize: "1.0625rem", lineHeight: 1.6, color: MUTED, margin: 0 }}>
        Ссылка недействительна. Запросите сброс пароля заново в{" "}
        <Link href="/account" style={{ color: INK, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "4px" }}>личном кабинете</Link>.
      </p>
    );
  }

  if (done) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f0f8f0", borderLeft: "2px solid #2d7a3a" }}>
          <span style={{ ...LABEL, color: "#2d7a3a", letterSpacing: "0.12em" }}>ПАРОЛЬ ОБНОВЛЁН</span>
        </div>
        <Link
          href="/account"
          style={{ alignSelf: "flex-start", fontFamily: BARLOW, fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f4f4f1", backgroundColor: INK, textDecoration: "none", padding: "0.875rem 2.5rem" }}
        >
          Войти в аккаунт
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 400 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        <span style={LABEL}>Новый пароль</span>
        <input style={INPUT} type="password" value={next} onChange={e => setNext(e.target.value)} required autoComplete="new-password" minLength={8} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
        <span style={LABEL}>Повторите пароль</span>
        <input style={INPUT} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" minLength={8} />
      </div>

      {error && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "#fff0f0", borderLeft: "2px solid #c00" }}>
          <span style={{ ...LABEL, color: "#c00", letterSpacing: "0.12em" }}>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        style={{ fontFamily: BARLOW, fontSize: "0.625rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f4f4f1", backgroundColor: INK, border: "none", padding: "0.875rem 2.5rem", cursor: "pointer", width: "auto", alignSelf: "flex-start", opacity: saving ? 0.6 : 1 }}
      >
        {saving ? "—" : "Сохранить пароль"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f1", color: INK, fontFamily: BARLOW }}>
      <div style={{ height: "72px" }} />
      <div style={{ maxWidth: "880px", margin: "0 auto", paddingLeft: "clamp(1.5rem, 5vw, 3rem)", paddingRight: "clamp(1.5rem, 5vw, 3rem)" }}>
        <section style={{ paddingTop: "clamp(3rem, 9vw, 6rem)", paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
          <p style={{ fontSize: "1.0625rem", color: FAINT, marginBottom: "1.25rem" }}>Безопасность</p>
          <h1 style={{ fontSize: "clamp(2.5rem, 7vw, 4.75rem)", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 0.98, margin: "0 0 1.75rem" }}>
            Сброс пароля
          </h1>
        </section>
        <section style={{ borderTop: `1px solid ${LINE}`, paddingTop: "clamp(2rem, 5vw, 3rem)", paddingBottom: "clamp(4rem, 9vw, 6rem)" }}>
          <Suspense fallback={<span style={LABEL}>—</span>}>
            <ResetForm />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
