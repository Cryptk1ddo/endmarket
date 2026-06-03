"use client";

import { useState, useEffect, useCallback, startTransition } from "react";
import Link from "next/link";
import { medusa } from "@/lib/medusa";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface OrderItem {
  title: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  display_id: number;
  status: string;
  fulfillment_status: string;
  total: number;
  currency_code: string;
  created_at: string;
  items: OrderItem[];
}

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
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "1px solid #d0d0c8",
  outline: "none",
  padding: "0.5rem 0",
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
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await medusa.auth.login("customer", "emailpass", { email, password });
        const { customer } = await medusa.store.customer.retrieve();
        onSuccess(customer as unknown as Customer);
      } else {
        await medusa.auth.register("customer", "emailpass", { email, password });
        const { customer } = await medusa.store.customer.create({
          first_name: firstName,
          last_name: lastName,
          phone: phone || undefined,
          email,
        });
        onSuccess(customer as unknown as Customer);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка авторизации";
      setError(msg.includes("Invalid") || msg.includes("401") ? "Неверный email или пароль" : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "0 1rem" }}>
      {/* Mode toggle */}
      <div style={{ display: "flex", marginBottom: "3rem", borderBottom: "1px solid #e8e8e0" }}>
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
              padding: "0 1.5rem 1rem 0",
              cursor: "pointer",
              letterSpacing: "0.16em",
            }}
          >
            {m === "login" ? "ВОЙТИ" : "РЕГИСТРАЦИЯ"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        {mode === "register" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
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

        {error && <ErrorBanner msg={error} />}

        <button type="submit" style={{ ...BTN_PRIMARY, opacity: loading ? 0.6 : 1 }} disabled={loading}>
          {loading ? "—" : mode === "login" ? "ВОЙТИ В КАБИНЕТ" : "СОЗДАТЬ АККАУНТ"}
        </button>
      </form>
    </div>
  );
}

// ─── Orders tab ───────────────────────────────────────────────────────────────

function OrdersTab({ customerId }: { customerId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    medusa.store.order
      .list({ customer_id: customerId, fields: "id,display_id,status,fulfillment_status,total,currency_code,created_at,*items" })
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
      {orders.map((order) => (
        <div key={order.id} style={{ borderBottom: "1px solid #e8e8e0" }}>
          {/* Row */}
          <button
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
      const { customer: updated } = await medusa.store.customer.update({
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

function SecurityTab() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) { setError("Пароли не совпадают"); return; }
    if (next.length < 8) { setError("Минимум 8 символов"); return; }
    setSaving(true);
    setError("");
    try {
      await medusa.store.customer.update({ password: next } as never);
      setSaved(true);
      setCurrent(""); setNext(""); setConfirm("");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Не удалось изменить пароль");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: "1.75rem", maxWidth: 400 }}>
      <FieldGroup label="Текущий пароль">
        <input style={INPUT} type="password" value={current} onChange={e => setCurrent(e.target.value)} required autoComplete="current-password" />
      </FieldGroup>
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
    try { await medusa.auth.logout(); } catch { /* ignore */ }
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

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", width: "100%" }}>
      <div className="profile-shell" style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem", alignItems: "start" }}>
        <aside className="profile-aside" style={{ border: "1px solid #e0ddd8", backgroundColor: "#fcfcfa", position: "sticky", top: "96px" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #e0ddd8" }}>
            <p style={{ ...LABEL, marginBottom: "0.75rem" }}>ENDMARKET / КАБИНЕТ</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginBottom: "0.625rem" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "999px",
                  backgroundColor: "#080808",
                  color: "#f8f8f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-barlow-condensed)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  fontSize: "0.875rem",
                }}
              >
                {initials || "EM"}
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.125rem", fontWeight: 700, color: "#080808", margin: 0, lineHeight: 1 }}>
                  {fullName.toUpperCase()}
                </p>
                <p style={{ ...LABEL, marginTop: "0.25rem", letterSpacing: "0.14em" }}>АКТИВНЫЙ ПРОФИЛЬ</p>
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "#6e6e66", margin: 0 }}>
              {currentCustomer.email}
            </p>
          </div>

          <div style={{ padding: "1rem 1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", borderBottom: "1px solid #e0ddd8" }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  ...LABEL,
                  width: "100%",
                  textAlign: "left",
                  background: tab === t.id ? "#080808" : "transparent",
                  color: tab === t.id ? "#f8f8f6" : "#6e6e66",
                  border: "1px solid",
                  borderColor: tab === t.id ? "#080808" : "#d8d8d0",
                  padding: "0.75rem 0.875rem",
                  cursor: "pointer",
                  letterSpacing: "0.14em",
                }}
              >
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link href="/wishlist" style={{ ...LABEL, color: "#080808", textDecoration: "none", letterSpacing: "0.14em" }}>
              ИЗБРАННОЕ →
            </Link>
            <Link href="/collection" style={{ ...LABEL, color: "#080808", textDecoration: "none", letterSpacing: "0.14em" }}>
              КАТАЛОГ →
            </Link>
            <Link href="/delivery" style={{ ...LABEL, color: "#080808", textDecoration: "none", letterSpacing: "0.14em" }}>
              ДОСТАВКА →
            </Link>
            <button onClick={logout} style={{ ...LABEL, marginTop: "0.75rem", background: "none", border: "none", cursor: "pointer", color: "#a8a8a2", textAlign: "left", padding: 0 }}>
              ВЫЙТИ →
            </button>
          </div>
        </aside>

        <main style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="profile-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.75rem" }}>
            <div style={{ border: "1px solid #e0ddd8", backgroundColor: "#fcfcfa", padding: "1rem" }}>
              <p style={{ ...LABEL, marginBottom: "0.5rem" }}>ПРОФИЛЬ</p>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.5rem", lineHeight: 1, color: "#080808", margin: 0 }}>01</p>
            </div>
            <div style={{ border: "1px solid #e0ddd8", backgroundColor: "#fcfcfa", padding: "1rem" }}>
              <p style={{ ...LABEL, marginBottom: "0.5rem" }}>EMAIL</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", color: "#080808", margin: 0, wordBreak: "break-all" }}>{currentCustomer.email}</p>
            </div>
            <div style={{ border: "1px solid #e0ddd8", backgroundColor: "#fcfcfa", padding: "1rem" }}>
              <p style={{ ...LABEL, marginBottom: "0.5rem" }}>СТАТУС</p>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1rem", color: "#080808", margin: 0 }}>АКТИВЕН</p>
            </div>
          </div>

          <section style={{ border: "1px solid #e0ddd8", backgroundColor: "#fcfcfa", padding: "1.5rem" }}>
            <div style={{ borderBottom: "1px solid #ecece6", marginBottom: "1.25rem", paddingBottom: "0.75rem" }}>
              <p style={{ ...LABEL, color: "#6e6e66", margin: 0 }}>{tabs.find((item) => item.id === tab)?.label.toUpperCase()}</p>
            </div>
            {tab === "orders" && <OrdersTab customerId={currentCustomer.id} />}
            {tab === "profile" && <ProfileTab customer={currentCustomer} onUpdate={setCurrentCustomer} />}
            {tab === "security" && <SecurityTab />}
          </section>
        </main>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .profile-shell { grid-template-columns: 1fr !important; }
          .profile-aside { position: static !important; }
        }
        @media (max-width: 768px) {
          .profile-stats { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function ProfileClient() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [checking, setChecking] = useState(true);

  const fetchCustomer = useCallback(async () => {
    try {
      const { customer: c } = await medusa.store.customer.retrieve();
      startTransition(() => setCustomer(c as unknown as Customer));
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
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f8f6" }}>
      <div style={{ height: "72px" }} />

      <div style={{ padding: "4rem 2rem 6rem" }}>
        {checking ? (
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <p style={{ ...LABEL }}>—</p>
          </div>
        ) : customer ? (
          <Dashboard customer={customer} onLogout={handleLogout} />
        ) : (
          <div>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <p style={{ ...LABEL, marginBottom: "1.5rem" }}>ENDMARKET / ЛИЧНЫЙ КАБИНЕТ</p>
              <h1 style={{
                fontFamily: "var(--font-barlow-condensed)",
                fontSize: "clamp(3rem, 8vw, 5rem)",
                fontWeight: 900,
                letterSpacing: "-0.01em",
                color: "#080808",
                lineHeight: 0.88,
                margin: 0,
              }}>
                ВХОД
              </h1>
            </div>
            <AuthPanel onSuccess={setCustomer} />
          </div>
        )}
      </div>
    </div>
  );
}
