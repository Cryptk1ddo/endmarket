"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import Link from "next/link";
import {
  getMe,
  getOrders,
  loginCustomer,
  logoutCustomer,
  registerCustomer,
  updateCustomer,
  updatePassword,
  requestPasswordReset,
  type Customer,
  type Order,
  type OrderItem,
} from "../account/account-api";


type AuthMode = "login" | "register";
type Tab = "orders" | "profile" | "security";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(amount: number, currency = "rub") {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amount / 100);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const STATUS_LABELS: Record<string, string> = {
  pending: "ОЖИДАЕТ",
  processing: "В ОБРАБОТКЕ",
  completed: "ВЫПОЛНЕН",
  canceled: "ОТМЕНЁН",
  refunded: "ВОЗВРАТ",
};

const FULFILLMENT_LABELS: Record<string, string> = {
  not_fulfilled: "НЕ ДОСТАВЛЕН",
  partially_fulfilled: "ЧАСТИЧНО",
  fulfilled: "ДОСТАВЛЕН",
  shipped: "ОТПРАВЛЕН",
  delivered: "ПОЛУЧЕН",
};

// ─── Shared style atoms ───────────────────────────────────────────────────────

const LABEL = {
  fontFamily: "var(--font-barlow)",
  fontSize: "0.5625rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
  color: "#a8a8a2",
};

const INPUT: React.CSSProperties = {
  fontFamily: "var(--font-barlow)",
  fontSize: "0.875rem",
  fontWeight: 300,
  color: "#080808",
  backgroundColor: "#f4f4f1",
  border: "1px solid #d8d8d0",
  outline: "none",
  padding: "0.95rem 1rem",
  width: "100%",
  letterSpacing: "0.02em",
};

const BTN_PRIMARY: React.CSSProperties = {
  fontFamily: "var(--font-barlow)",
  fontSize: "0.625rem",
  fontWeight: 600,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#f8f8f6",
  backgroundColor: "#080808",
  border: "none",
  padding: "0.875rem 2.5rem",
  cursor: "pointer",
  width: "100%",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <span style={LABEL}>{label}</span>
      {children}
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div style={{ padding: "0.75rem 1rem", backgroundColor: "#fff0f0", borderLeft: "2px solid #c00" }}>
      <span style={{ ...LABEL, color: "#c00", letterSpacing: "0.12em" }}>{msg}</span>
    </div>
  );
}

// ─── Auth form ────────────────────────────────────────────────────────────────

function AuthPanel({ onSuccess }: { onSuccess: (c: Customer) => void }) {
  const isDev = process.env.NODE_ENV === "development";
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function forgotPassword() {
    if (!email) { setError("Введите email для сброса пароля"); return; }
    setError("");
    try {
      await requestPasswordReset(email);
    } catch {
      /* request endpoint never reveals failure */
    } finally {
      setResetSent(true);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
    if (mode === "login") {
  const { customer } = await loginCustomer({
    email,
    password,
  });

  onSuccess(customer);
} else {
  const { customer } = await registerCustomer({
    email,
    password,
    first_name: firstName,
    last_name: lastName,
    phone: phone || undefined,
  });

  onSuccess(customer);
}
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка авторизации";
      setError(msg.includes("Invalid") || msg.includes("401") ? "Неверный email или пароль" : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 1rem" }}>
      <div style={{ border: "1px solid rgba(0,0,0,0.1)", backgroundColor: "#fcfcfa" }}>
        <div className="auth-grid" style={{ display: "grid", gridTemplateColumns: "minmax(320px, 0.95fr) minmax(0, 1.05fr)", minHeight: "640px" }}>
          <div
            className="auth-visual"
            style={{
              position: "relative",
              color: "#f3f3f1",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "2rem",
              borderRight: "1px solid rgba(0,0,0,0.1)",
              backgroundColor: "#0a0a0a",
              backgroundImage: "linear-gradient(180deg, rgba(8,8,8,0.12) 0%, rgba(8,8,8,0.78) 100%), url('/heroimages/e1d7effe71342dee19a84911b802eecc.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div>
              <p style={{ ...LABEL, color: "rgba(243,243,241,0.64)", marginBottom: "0.8rem" }}>ENDMARKET / ACCOUNT</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.1rem, 4vw, 3.6rem)", lineHeight: 0.9, letterSpacing: "-0.04em", margin: 0, color: "#f3f3f1" }}>
                {mode === "login" ? "WELCOME BACK" : "CREATE ACCOUNT"}
              </h2>
              <p style={{ margin: "1rem 0 0", fontFamily: "var(--font-barlow)", fontSize: "0.86rem", lineHeight: 1.6, color: "rgba(243,243,241,0.78)", maxWidth: "28rem" }}>
                История заказов, статусы доставок, персональные данные и быстрый доступ к избранным моделям в одном кабинете.
              </p>
            </div>
          </div>

          <div style={{ padding: "2.25rem 2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ marginBottom: "1.8rem" }}>
              <p style={{ ...LABEL, color: "#6e6e66", marginBottom: "0.7rem" }}>Личный кабинет</p>
              <h3 style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, fontSize: "clamp(1.85rem, 3vw, 2.8rem)", letterSpacing: "-0.02em", lineHeight: 1.0, color: "#080808", margin: 0 }}>
                {mode === "login" ? "Войдите в аккаунт" : "Регистрация"}
              </h3>
            </div>

            <div style={{ display: "flex", marginBottom: "1.5rem", borderBottom: "1px solid #e8e8e0" }}>
              {(["login", "register"] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  style={{
                    ...LABEL,
                    color: mode === m ? "#080808" : "#a8a8a2",
                    fontWeight: mode === m ? 600 : 400,
                    background: "none",
                    border: "none",
                    borderBottom: mode === m ? "2px solid #080808" : "2px solid transparent",
                    marginBottom: "-1px",
                    padding: "0 1.5rem 0.9rem 0",
                    cursor: "pointer",
                    letterSpacing: "0.16em",
                  }}
                >
                  {m === "login" ? "ВОЙТИ" : "РЕГИСТРАЦИЯ"}
                </button>
              ))}
            </div>

            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "32rem" }}>
              {mode === "register" && (
                <>
                  <div className="auth-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
                    <FieldGroup label="Имя">
                      <input style={INPUT} value={firstName} onChange={e => setFirstName(e.target.value)} required autoComplete="given-name" />
                    </FieldGroup>
                    <FieldGroup label="Фамилия">
                      <input style={INPUT} value={lastName} onChange={e => setLastName(e.target.value)} required autoComplete="family-name" />
                    </FieldGroup>
                  </div>
                  <FieldGroup label="Телефон">
                    <input style={INPUT} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" autoComplete="tel" />
                  </FieldGroup>
                </>
              )}

              <FieldGroup label="Email">
                <input style={INPUT} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </FieldGroup>

              <FieldGroup label="Пароль">
                <input style={INPUT} type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} />
              </FieldGroup>

              {mode === "login" && (
                resetSent ? (
                  <span style={{ ...LABEL, color: "#2d7a3a", letterSpacing: "0.12em" }}>
                    ССЫЛКА ДЛЯ СБРОСА ОТПРАВЛЕНА НА EMAIL
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={forgotPassword}
                    style={{
                      ...LABEL,
                      border: "none",
                      background: "none",
                      padding: 0,
                      textAlign: "left",
                      letterSpacing: "0.14em",
                      color: "#6e6e66",
                      cursor: "pointer",
                    }}
                  >
                    ЗАБЫЛИ ПАРОЛЬ?
                  </button>
                )
              )}

              {error && <ErrorBanner msg={error} />}

              <button type="submit" style={{ ...BTN_PRIMARY, opacity: loading ? 0.6 : 1, marginTop: "0.4rem" }} disabled={loading}>
                {loading ? "—" : mode === "login" ? "ВОЙТИ В КАБИНЕТ" : "СОЗДАТЬ АККАУНТ"}
              </button>

              {isDev && (
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    onSuccess({
                      id: "dev-dashboard-user",
                      email: "dev@local.artwater",
                      first_name: "Dev",
                      last_name: "Preview",
                      phone: "+7 000 000-00-00",
                    });
                  }}
                  style={{
                    ...LABEL,
                    marginTop: "0.25rem",
                    width: "100%",
                    border: "1px dashed #a8a8a2",
                    background: "transparent",
                    color: "#6e6e66",
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    letterSpacing: "0.14em",
                  }}
                >
                  DEV: БЫСТРЫЙ ВХОД В DASHBOARD
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 980px) {
          .auth-grid { grid-template-columns: 1fr !important; }
          .auth-visual {
            min-height: 320px;
            border-right: none !important;
            border-bottom: 1px solid rgba(0,0,0,0.1);
          }
        }
        @media (max-width: 840px) {
          .auth-shell { padding: 0 !important; }
          .auth-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Orders tab ───────────────────────────────────────────────────────────────

function OrdersTab({ customerId }: { customerId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

 useEffect(() => {
  getOrders()
    .then(({ orders: raw }) => {
      startTransition(() => {
        setOrders(raw as unknown as Order[]);
        setLoading(false);
      });
    })
    .catch(() => startTransition(() => setLoading(false)));
}, [customerId]);

  if (loading) {
    return <div style={{ ...LABEL, paddingTop: "2rem" }}>Загрузка заказов...</div>;
  }

  if (orders.length === 0) {
    return (
      <div style={{ paddingTop: "2rem" }}>
        <p style={{ ...LABEL, marginBottom: "1.5rem" }}>Заказов пока нет</p>
        <Link href="/collection" style={{ ...LABEL, color: "#080808", textDecoration: "none", borderBottom: "1px solid #080808", paddingBottom: "2px", letterSpacing: "0.14em" }}>
          ПЕРЕЙТИ В КАТАЛОГ →
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      <style>{`
        @media (max-width: 1024px) {
          .acc-order-row {
            grid-template-columns: 1fr auto !important;
            gap: 0.5rem 1rem !important;
            padding: 1.1rem 0 !important;
          }
          .acc-order-row > :nth-child(1) { grid-column: 1; grid-row: 1; }
          .acc-order-row > :nth-child(4) { grid-column: 2; grid-row: 1; text-align: right; }
          .acc-order-row > :nth-child(2) { grid-column: 1; grid-row: 2; }
          .acc-order-row > :nth-child(3) { grid-column: 2; grid-row: 2; text-align: right; }
        }
      `}</style>
      {orders.map((order) => (
        <div key={order.id} style={{ borderBottom: "1px solid #e8e8e0" }}>
          {/* Row */}
          <button
            className="acc-order-row"
            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "1fr auto auto auto",
              gap: "2rem",
              alignItems: "center",
              padding: "1.25rem 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 500, color: "#080808" }}>
              №{order.display_id}
            </span>
            <span style={{ ...LABEL, whiteSpace: "nowrap" }}>{formatDate(order.created_at)}</span>
            <span style={{ ...LABEL, color: order.status === "completed" ? "#080808" : "#a8a8a2" }}>
              {STATUS_LABELS[order.status] ?? order.status.toUpperCase()}
            </span>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 600, color: "#080808", whiteSpace: "nowrap" }}>
              {formatPrice(order.total, order.currency_code)}
            </span>
          </button>

          {/* Expanded items */}
          {expanded === order.id && (
            <div style={{ paddingBottom: "1.25rem", paddingLeft: "0" }}>
              <div style={{ ...LABEL, marginBottom: "0.75rem" }}>
                {FULFILLMENT_LABELS[order.fulfillment_status] ?? order.fulfillment_status}
              </div>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderTop: "1px solid #f0f0e8" }}>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 300, color: "#2a2a22" }}>
                    {item.title} × {item.quantity}
                  </span>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 400, color: "#080808" }}>
                    {formatPrice(item.unit_price * item.quantity, order.currency_code)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Profile tab ──────────────────────────────────────────────────────────────

function ProfileTab({ customer, onUpdate }: { customer: Customer; onUpdate: (c: Customer) => void }) {
  const [firstName, setFirstName] = useState(customer.first_name);
  const [lastName, setLastName] = useState(customer.last_name);
  const [phone, setPhone] = useState(customer.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const { customer: updated } = await updateCustomer({
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
      });
      onUpdate(updated as unknown as Customer);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Не удалось сохранить изменения");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 520 }}>
      <FieldGroup label="Email">
        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, color: "#6e6e66", padding: "0.5rem 0" }}>
          {customer.email}
        </span>
      </FieldGroup>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <FieldGroup label="Имя">
          <input style={INPUT} value={firstName} onChange={e => setFirstName(e.target.value)} required />
        </FieldGroup>
        <FieldGroup label="Фамилия">
          <input style={INPUT} value={lastName} onChange={e => setLastName(e.target.value)} required />
        </FieldGroup>
      </div>

      <FieldGroup label="Телефон">
        <input style={INPUT} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" />
      </FieldGroup>

      {error && <ErrorBanner msg={error} />}

      {saved && (
        <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f0f8f0", borderLeft: "2px solid #2d7a3a" }}>
          <span style={{ ...LABEL, color: "#2d7a3a", letterSpacing: "0.12em" }}>ИЗМЕНЕНИЯ СОХРАНЕНЫ</span>
        </div>
      )}

      <button type="submit" style={{ ...BTN_PRIMARY, width: "auto", padding: "0.875rem 2.5rem", opacity: saving ? 0.6 : 1 }} disabled={saving}>
        {saving ? "—" : "СОХРАНИТЬ"}
      </button>
    </form>
  );
}

// ─── Security tab ─────────────────────────────────────────────────────────────

function SecurityTab({ customer }: { customer: Customer }) {
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 8) { setError("Минимум 8 символов"); return; }
    if (next !== confirm) { setError("Пароли не совпадают"); return; }
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await updatePassword(next);
      setSaved(true);
      setNext(""); setConfirm("");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Не удалось изменить пароль");
    } finally {
      setSaving(false);
    }
  }

  async function sendResetLink() {
    setSending(true);
    setSent(false);
    try {
      await requestPasswordReset(customer.email);
    } catch {
      /* request endpoint never reveals failure */
    } finally {
      setSent(true);
      setSending(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: 400 }}>
      <form onSubmit={changePassword} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        <FieldGroup label="Новый пароль">
          <input style={INPUT} type="password" value={next} onChange={e => setNext(e.target.value)} required autoComplete="new-password" minLength={8} />
        </FieldGroup>
        <FieldGroup label="Повторите пароль">
          <input style={INPUT} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required autoComplete="new-password" minLength={8} />
        </FieldGroup>

        {error && <ErrorBanner msg={error} />}
        {saved && (
          <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f0f8f0", borderLeft: "2px solid #2d7a3a" }}>
            <span style={{ ...LABEL, color: "#2d7a3a", letterSpacing: "0.12em" }}>ПАРОЛЬ ОБНОВЛЁН</span>
          </div>
        )}

        <button type="submit" style={{ ...BTN_PRIMARY, width: "auto", padding: "0.875rem 2.5rem", opacity: saving ? 0.6 : 1 }} disabled={saving}>
          {saving ? "—" : "ИЗМЕНИТЬ ПАРОЛЬ"}
        </button>
      </form>

      <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "1.75rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <span style={LABEL}>Забыли текущий пароль?</span>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, color: "#6e6e66", lineHeight: 1.6, margin: 0 }}>
          Отправим ссылку для сброса пароля на {customer.email}.
        </p>
        {sent ? (
          <div style={{ padding: "0.75rem 1rem", backgroundColor: "#f0f8f0", borderLeft: "2px solid #2d7a3a" }}>
            <span style={{ ...LABEL, color: "#2d7a3a", letterSpacing: "0.12em" }}>ССЫЛКА ОТПРАВЛЕНА НА EMAIL</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={sendResetLink}
            disabled={sending}
            style={{
              ...LABEL,
              alignSelf: "flex-start",
              border: "1px solid #080808",
              background: "transparent",
              color: "#080808",
              padding: "0.7rem 1.5rem",
              cursor: "pointer",
              letterSpacing: "0.14em",
              opacity: sending ? 0.6 : 1,
            }}
          >
            {sending ? "—" : "ОТПРАВИТЬ ССЫЛКУ"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ customer, onLogout }: { customer: Customer; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("orders");
  const [currentCustomer, setCurrentCustomer] = useState(customer);

  const tabs: { id: Tab; label: string }[] = [
    { id: "orders", label: "Заказы" },
    { id: "profile", label: "Профиль" },
    { id: "security", label: "Безопасность" },
  ];

  async function logout() {
    try { await logoutCustomer(); } catch { /* ignore */ }
    onLogout();
  }

  const fullName = currentCustomer.first_name
    ? `${currentCustomer.first_name} ${currentCustomer.last_name}`.trim()
    : currentCustomer.email;
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const customerTag = currentCustomer.email.split("@")[0]?.toUpperCase() || "CLIENT";
  const joinedAt = new Date().getFullYear();

  return (
    <>
      {/* ─── DESKTOP LAYOUT (≥1024px) ─── */}
      <div className="db-desktop" style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", border: "1px solid rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>

        {/* Top identity bar */}
        <div style={{ display: "grid", gridTemplateColumns: "260px minmax(0, 1fr)", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
          <div style={{ padding: "1.1rem 1.25rem", borderRight: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "0.9rem" }}>
            <div style={{ width: "40px", height: "40px", flexShrink: 0, backgroundColor: "#080808", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-barlow-condensed)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em" }}>
              {initials || "EM"}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: "var(--font-barlow-condensed)", fontSize: "0.98rem", fontWeight: 700, color: "#080808", lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fullName.toUpperCase()}</p>
              <p style={{ ...LABEL, margin: "0.2rem 0 0", color: "#a8a8a2" }}>#{customerTag}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 1.5rem" }}>
            <div>
              <p style={{ ...LABEL, color: "#a8a8a2", margin: 0 }}>ENDMARKET / ЛИЧНЫЙ КАБИНЕТ</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", color: "#4d4d45", margin: "0.25rem 0 0", wordBreak: "break-all" }}>{currentCustomer.email}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <span style={{ ...LABEL, color: "#a8a8a2", border: "1px solid rgba(0,0,0,0.1)", padding: "0.35rem 0.75rem", whiteSpace: "nowrap" }}>АКТИВЕН</span>
              <button onClick={logout} style={{ ...LABEL, background: "none", border: "none", cursor: "pointer", color: "#a8a8a2", padding: 0, letterSpacing: "0.14em", whiteSpace: "nowrap" }}>ВЫЙТИ →</button>
            </div>
          </div>
        </div>

        {/* Body: sidebar + content */}
        <div style={{ display: "grid", gridTemplateColumns: "260px minmax(0, 1fr)", flex: 1, minHeight: 0 }}>

          {/* Sidebar nav */}
          <nav style={{ borderRight: "1px solid rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1 }}>
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.85rem",
                    padding: "1rem 1.25rem",
                    background: tab === t.id ? "#080808" : "transparent",
                    color: tab === t.id ? "#fff" : "#4d4d45",
                    border: "none",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1, opacity: tab === t.id ? 1 : 0.28, minWidth: "2rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
            <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <Link href="/wishlist" style={{ ...LABEL, color: "#4d4d45", textDecoration: "none", display: "flex", justifyContent: "space-between" }}><span>ИЗБРАННОЕ</span><span>→</span></Link>
              <Link href="/collection" style={{ ...LABEL, color: "#4d4d45", textDecoration: "none", display: "flex", justifyContent: "space-between" }}><span>КАТАЛОГ</span><span>→</span></Link>
              <Link href="/delivery" style={{ ...LABEL, color: "#4d4d45", textDecoration: "none", display: "flex", justifyContent: "space-between" }}><span>ДОСТАВКА</span><span>→</span></Link>
            </div>
          </nav>

          {/* Content */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Stats strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
              {[
                { label: "КЛИЕНТ", value: customerTag, mono: true },
                { label: "EMAIL", value: currentCustomer.email, small: true },
                { label: "С НАМИ", value: `${joinedAt}`, mono: true },
              ].map((s, i) => (
                <div key={s.label} style={{ padding: "1rem 1.25rem", borderRight: i < 2 ? "1px solid rgba(0,0,0,0.1)" : "none" }}>
                  <p style={{ ...LABEL, color: "#a8a8a2", marginBottom: "0.3rem" }}>{s.label}</p>
                  <p style={{ margin: 0, fontFamily: s.small ? "var(--font-barlow)" : "var(--font-barlow-condensed)", fontSize: s.small ? "0.78rem" : "1.25rem", fontWeight: s.small ? 400 : 700, color: "#080808", letterSpacing: s.mono ? "0.04em" : 0, wordBreak: "break-all", lineHeight: 1.15 }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Section header */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem", padding: "0.6rem 1.25rem", borderBottom: "1px solid rgba(0,0,0,0.1)", backgroundColor: "#f9f8f5" }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-barlow)", fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)", fontWeight: 700, letterSpacing: "-0.02em", color: "#080808", lineHeight: 1 }}>
                {tabs.find(t => t.id === tab)?.label}
              </h3>
              <span style={{ ...LABEL, color: "#a8a8a2" }}>ЛИЧНЫЙ КАБИНЕТ / ENDMARKET</span>
            </div>

            {/* Tab content */}
            <div style={{ padding: "1.5rem", flex: 1 }}>
              {tab === "orders" && <OrdersTab customerId={currentCustomer.id} />}
              {tab === "profile" && <ProfileTab customer={currentCustomer} onUpdate={setCurrentCustomer} />}
              {tab === "security" && <SecurityTab customer={currentCustomer} />}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MOBILE LAYOUT (<1024px) ─── */}
      <div className="db-mobile" style={{ display: "none", flex: 1, width: "100%", minHeight: 0, flexDirection: "column", border: "1px solid rgba(0,0,0,0.1)", backgroundColor: "#fff" }}>

        {/* Identity bar */}
        <div style={{ padding: "1rem", borderBottom: "1px solid rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{ width: "44px", height: "44px", flexShrink: 0, backgroundColor: "#080808", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-barlow-condensed)", fontSize: "0.9rem", fontWeight: 700 }}>
            {initials || "EM"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontFamily: "var(--font-barlow-condensed)", fontSize: "1rem", fontWeight: 700, color: "#080808", lineHeight: 1.1 }}>{fullName.toUpperCase()}</p>
            <p style={{ margin: "0.2rem 0 0", fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "#a8a8a2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentCustomer.email}</p>
          </div>
          <button onClick={logout} style={{ ...LABEL, background: "none", border: "1px solid rgba(0,0,0,0.1)", cursor: "pointer", color: "#a8a8a2", padding: "0.45rem 0.65rem", letterSpacing: "0.1em", flexShrink: 0 }}>ВЫЙТИ</button>
        </div>

        {/* Horizontal stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
          {[
            { label: "КЛИЕНТ", value: customerTag },
            { label: "СТАТУС", value: "АКТИВЕН" },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: "0.85rem 1rem", borderRight: i === 0 ? "1px solid rgba(0,0,0,0.1)" : "none" }}>
              <p style={{ ...LABEL, color: "#a8a8a2", marginBottom: "0.25rem" }}>{s.label}</p>
              <p style={{ margin: 0, fontFamily: "var(--font-barlow-condensed)", fontSize: "1.1rem", fontWeight: 700, color: "#080808" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Section heading */}
        <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid rgba(0,0,0,0.1)", backgroundColor: "#f9f8f5" }}>
          <h3 style={{ margin: 0, fontFamily: "var(--font-barlow)", fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#080808", lineHeight: 1 }}>
            {tabs.find(t => t.id === tab)?.label}
          </h3>
        </div>

        {/* Content */}
        <div style={{ padding: "1rem", flex: 1, minHeight: "320px" }}>
          {tab === "orders" && <OrdersTab customerId={currentCustomer.id} />}
          {tab === "profile" && <ProfileTab customer={currentCustomer} onUpdate={setCurrentCustomer} />}
          {tab === "security" && <SecurityTab customer={currentCustomer} />}
        </div>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          {[
            { href: "/wishlist", label: "ИЗБРАННОЕ" },
            { href: "/collection", label: "КАТАЛОГ" },
            { href: "/delivery", label: "ДОСТАВКА" },
          ].map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                ...LABEL,
                color: "#4d4d45",
                textDecoration: "none",
                padding: "0.95rem 0.5rem",
                borderRight: i < 2 ? "1px solid rgba(0,0,0,0.1)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                letterSpacing: "0.1em",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Bottom tab bar */}
        <div style={{ position: "sticky", bottom: 0, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: "1px solid rgba(0,0,0,0.1)", backgroundColor: "#fff", zIndex: 10, paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                ...LABEL,
                border: "none",
                borderRight: i < 2 ? "1px solid rgba(0,0,0,0.1)" : "none",
                background: tab === t.id ? "#080808" : "transparent",
                color: tab === t.id ? "#fff" : "#6e6e66",
                padding: "1rem 0.5rem",
                cursor: "pointer",
                letterSpacing: "0.12em",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.1rem", fontWeight: 700, lineHeight: 1, opacity: tab === t.id ? 1 : 0.35 }}>{String(i + 1).padStart(2, "0")}</span>
              <span>{t.label.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .db-desktop { display: none !important; }
          .db-mobile { display: flex !important; }
        }
        @media (max-width: 480px) {
          .db-mobile { border-left: none !important; border-right: none !important; }
        }
      `}</style>
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ProfileClient() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [checking, setChecking] = useState(true);

  const fetchCustomer = useCallback(async () => {
    try {
      const { customer: c } = await getMe();
      startTransition(() => setCustomer(c));
    } catch {
      startTransition(() => setCustomer(null));
    } finally {
      startTransition(() => setChecking(false));
    }
  }, []);

  useEffect(() => { fetchCustomer(); }, [fetchCustomer]);

  function handleLogout() {
    startTransition(() => setCustomer(null));
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f4f1" }}>
      <div style={{ height: "72px" }} />

      <div
        className="account-content"
        style={customer ? { padding: 0, minHeight: "calc(100vh - 72px)", display: "flex" } : { padding: "3rem 1rem 6rem" }}
      >
        {checking ? (
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <p style={{ ...LABEL }}>—</p>
          </div>
        ) : customer ? (
          <Dashboard customer={customer} onLogout={handleLogout} />
        ) : <AuthPanel onSuccess={setCustomer} />}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .account-content { padding: 0 0 calc(4rem + env(safe-area-inset-bottom, 0px)) !important; }
        }
      `}</style>
    </div>
  );
}
