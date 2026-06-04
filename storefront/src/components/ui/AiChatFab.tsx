"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "Какой кондиционер подойдёт для 30 м²?",
  "Сколько стоит монтаж?",
  "Есть ли кондиционеры с Wi-Fi?",
  "Какой бренд лучше: Ballu или Haier?",
];

const SYSTEM_CONTEXT = `Ты — AI-консультант интернет-магазина ENDMARKET.
Мы продаём кондиционеры брендов Ballu, Haier, Hisense, Daikin в России.
Виды внутренних блоков: Настенные, Кассетные, Канальные, Напольно-потолочные (консольные).
Email: support@endmarket.ru.
Гарантия: 24 месяца. Доставка по Москве: 1–2 дня.
Монтаж: от 6 900 ₽. Бесплатный выезд и замер при покупке.
Отвечай кратко, профессионально, на русском языке.`;

async function askAI(history: Message[], userText: string): Promise<string> {
  const messages = [
    { role: "system", content: SYSTEM_CONTEXT },
    ...history.map((m) => ({ role: m.role, content: m.text })),
    { role: "user", content: userText },
  ];

  const res = await fetch("/api/ai-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    // Graceful offline fallback
    return fallbackAnswer(userText);
  }

  const data = await res.json();
  return data.reply ?? fallbackAnswer(userText);
}

function fallbackAnswer(q: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("монтаж") || lower.includes("установк"))
    return "Монтаж стандартного сплит-кондиционера — от 6 900 ₽. Бесплатный выезд и замер при покупке оборудования. Напишите нам на support@endmarket.ru.";
  if (lower.includes("цен") || lower.includes("стоит"))
    return "Кондиционеры в каталоге от 28 900 ₽. Уточните модель — подберём оптимальный вариант.";
  if (lower.includes("wifi") || lower.includes("wi-fi") || lower.includes("умный"))
    return "Все модели Daikin и большинство Haier поддерживают Wi-Fi управление через приложение.";
  if (lower.includes("ballu") || lower.includes("haier") || lower.includes("hisense") || lower.includes("daikin"))
    return "Все бренды в каталоге — официальные поставки с гарантией производителя 24 месяца. Daikin — японское качество, Ballu — лучшее соотношение цены и надёжности.";
  return "Уточните вопрос или напишите нам на support@endmarket.ru — ответим в течение часа.";
}

export default function AiChatFab() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Добрый день. Помогу выбрать кондиционер или ответю на вопросы по монтажу." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput("");
    const next: Message[] = [...messages, { role: "user", text: q }];
    setMessages(next);
    setLoading(true);
    try {
      const reply = await askAI(messages, q);
      setMessages([...next, { role: "assistant", text: reply }]);
    } catch {
      setMessages([...next, { role: "assistant", text: fallbackAnswer(q) }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fab-panel"
          style={{
            position: "fixed",
            bottom: "calc(4.5rem + 1.5rem)",
            right: "1.5rem",
            zIndex: 200,
            width: "min(380px, calc(100vw - 2rem))",
            backgroundColor: "#f8f8f6",
            border: "1px solid #e0ddd8",
            display: "flex",
            flexDirection: "column",
            maxHeight: "min(520px, calc(100svh - 10rem))",
            boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.875rem 1.25rem",
              borderBottom: "1px solid #e0ddd8",
              backgroundColor: "#080808",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              {/* AI indicator */}
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "26px",
                  height: "26px",
                  backgroundColor: "#afc6d6",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                  <circle cx="9" cy="14" r="1" fill="#080808"/>
                  <circle cx="15" cy="14" r="1" fill="#080808"/>
                </svg>
              </span>
              <div>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#f8f8f6", margin: 0 }}>
                  AI-консультант
                </p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.625rem", color: "rgba(248,248,246,0.4)", margin: 0, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span className="fab-dot" style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#4ade80" }} />
                  ENDMARKET — онлайн
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(248,248,246,0.5)", padding: "0.25rem", display: "flex" }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className="anim-slide-up"
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  animationDelay: `${i * 0.04}s`,
                }}
              >
                <p
                  style={{
                    maxWidth: "80%",
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.8125rem",
                    fontWeight: 300,
                    lineHeight: 1.65,
                    color: m.role === "user" ? "#f8f8f6" : "#2a2a28",
                    backgroundColor: m.role === "user" ? "#080808" : "#eeeeed",
                    padding: "0.625rem 0.875rem",
                    margin: 0,
                  }}
                >
                  {m.text}
                </p>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex" }}>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", color: "#a8a8a2", backgroundColor: "#eeeeed", padding: "0.625rem 0.875rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                  <span>Думаю…</span>
                </p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — shown only at start */}
          {messages.length === 1 && (
            <div style={{ padding: "0 1.25rem 0.75rem", display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.6875rem",
                    fontWeight: 400,
                    color: "#555",
                    backgroundColor: "transparent",
                    border: "1px solid #d0ceca",
                    padding: "0.3rem 0.65rem",
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#080808"; e.currentTarget.style.color = "#080808"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d0ceca"; e.currentTarget.style.color = "#555"; }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ borderTop: "1px solid #e0ddd8", display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Задайте вопрос…"
              disabled={loading}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                fontFamily: "var(--font-barlow)",
                fontSize: "0.8125rem",
                fontWeight: 300,
                color: "#080808",
                padding: "0.875rem 1.25rem",
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                border: "none",
                borderLeft: "1px solid #e0ddd8",
                backgroundColor: "transparent",
                cursor: input.trim() && !loading ? "pointer" : "default",
                padding: "0.875rem 1rem",
                color: input.trim() && !loading ? "#080808" : "#c0c0bc",
                display: "flex",
                transition: "color 0.2s",
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="AI-консультант"
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 200,
          width: "52px",
          height: "52px",
          backgroundColor: "#080808",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.22)",
          transition: "transform 0.2s, background-color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? (
          <X size={20} color="#f8f8f6" />
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f8f8f6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
            <circle cx="9" cy="14" r="1" fill="#f8f8f6"/>
            <circle cx="15" cy="14" r="1" fill="#f8f8f6"/>
          </svg>
        )}
      </button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
