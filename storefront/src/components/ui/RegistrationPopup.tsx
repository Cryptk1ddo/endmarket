"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "em_reg_popup_dismissed";
const DELAY_MS = 12000;

export default function RegistrationPopup() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const shouldShowOnPage = pathname.startsWith("/product") || pathname.startsWith("/collection");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!shouldShowOnPage) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [shouldShowOnPage]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const prevOverflow = document.body.style.overflow;
    if (visible) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const frame = window.requestAnimationFrame(() => {
      if (submitted) {
        closeButtonRef.current?.focus();
        return;
      }
      emailInputRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !dialog.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last || !dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [submitted, visible]);

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
      <div
        role="presentation"
        onClick={dismiss}
        className="regPopupBackdrop"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="regPopupTitle"
        aria-describedby="regPopupDescription"
        aria-label="Регистрация — бесплатный замер"
        className={`regPopupPanel${isMobile ? " isMobile" : ""}`}
        ref={dialogRef}
      >
        {isMobile ? <div className="mobileDragHandle" aria-hidden="true" /> : null}

        <div className={`regPopupVisual${isMobile ? " isMobile" : ""}`}>
          <Image
            src="/heroimages/interior.png"
            alt="Интерьер с кинематографичным светом"
            fill
            sizes="(max-width: 768px) 100vw, 340px"
            style={{ objectFit: "cover", filter: "grayscale(12%) contrast(1.08) brightness(0.68)" }}
            priority
            unoptimized
          />
          <div className="regPopupVisualOverlay" />
          <p className="regPopupVisualCaption">
            ENDMARKET / CINEMATIC SERIES
          </p>
        </div>

        <div className="regPopupContent">
        <button
          onClick={dismiss}
          aria-label="Закрыть"
          className="regPopupClose"
          ref={closeButtonRef}
        >
          ×
        </button>

        {submitted ? (
          <div className="successWrap" aria-live="polite" aria-atomic="true">
            <p className="eyebrowText">
              ENDMARKET / ПОДТВЕРЖДЕНО
            </p>
            <h2 id="regPopupTitle" className="popupTitle successTitle">
              МЫ СВЯЖЕМСЯ<br />С ВАМИ
            </h2>
            <p id="regPopupDescription" className="supportText">
              Наш специалист запишет вас на бесплатный выезд и замер.
            </p>
          </div>
        ) : (
          <>
            <p className="eyebrowText">
              ENDMARKET / РЕГИСТРАЦИЯ
            </p>

            <h2 id="regPopupTitle" className="popupTitle">
              ПРИ РЕГИСТРАЦИИ<br />— ВЫЕЗД И ЗАМЕР<br />БЕСПЛАТНО
            </h2>

            <p id="regPopupDescription" className="supportText">
              Специалист приедет, замерит помещение и подберёт оборудование.<br />
              Без обязательств — бесплатно.
            </p>

            <div className="benefitRow" aria-hidden="true">
              <span>2 минуты</span>
              <span>Быстрый звонок</span>
              <span>0 ₽ замер</span>
            </div>

            <form onSubmit={handleSubmit} className="popupForm">
              <div>
                <input
                  ref={emailInputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  autoComplete="email"
                  className="popupInput"
                />
              </div>

              <div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Телефон"
                  autoComplete="tel"
                  inputMode="tel"
                  className="popupInput"
                />
              </div>

              <div className="popupActionWrap">
                <button
                  type="submit"
                  disabled={loading || (!email && !phone)}
                  className="submitButton"
                >
                  {loading ? "..." : "Записаться на замер"}
                </button>

                <p className="privacyText">
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <a href="/privacy" className="privacyLink">
                    политикой конфиденциальности
                  </a>
                </p>
              </div>
            </form>
          </>
        )}
        </div>
      </div>

      <style jsx>{`
        .regPopupBackdrop {
          position: fixed;
          inset: 0;
          z-index: 300;
          background: rgba(8, 8, 8, 0.72);
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
          animation: fadeIn 220ms ease;
        }

        .regPopupPanel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 301;
          width: min(780px, calc(100vw - 2rem));
          min-height: min(560px, calc(100dvh - 2rem));
          max-height: calc(100dvh - 2rem);
          background: #f8f8f6;
          border: 1px solid #dfdcd8;
          border-top: 2px solid #080808;
          display: flex;
          overflow: hidden;
          animation: popupRiseDesktop 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .regPopupPanel.isMobile {
          top: auto;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          max-height: min(94dvh, 760px);
          min-height: auto;
          border: none;
          border-top: 1px solid rgba(243, 243, 241, 0.08);
          border-radius: 0;
          background: #0a0a0a;
          transform: none;
          display: block;
          animation: popupRiseMobile 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .mobileDragHandle {
          display: none;
        }

        .regPopupVisual {
          position: relative;
          width: 43%;
          flex-shrink: 0;
          background: #111;
        }

        .regPopupVisual.isMobile {
          width: 100%;
          height: 104px;
        }

        .regPopupVisualOverlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(8, 8, 8, 0.1) 0%, rgba(8, 8, 8, 0.65) 100%);
        }

        .regPopupVisualCaption {
          position: absolute;
          left: 0.75rem;
          bottom: 0.75rem;
          margin: 0;
          font-family: var(--font-barlow);
          font-size: 0.52rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(248, 248, 246, 0.76);
        }

        .regPopupContent {
          position: relative;
          flex: 1;
          padding: 2.4rem 2rem 1.5rem;
          display: flex;
          flex-direction: column;
        }

        .regPopupClose {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 2.25rem;
          height: 2.25rem;
          border: 1px solid rgba(8, 8, 8, 0.12);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.78);
          color: #1a1a1a;
          cursor: pointer;
          font-size: 1.35rem;
          line-height: 1;
          transition: background 140ms ease, border-color 140ms ease;
        }

        .regPopupClose:hover {
          background: #ffffff;
          border-color: rgba(8, 8, 8, 0.28);
        }

        .eyebrowText {
          margin: 0 0 0.95rem;
          font-family: var(--font-barlow);
          font-size: 0.56rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a6a39d;
        }

        .popupTitle {
          margin: 0;
          font-family: var(--font-barlow-condensed);
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.01em;
          color: #080808;
        }

        .supportText {
          margin: 0.85rem 0 1.1rem;
          font-family: var(--font-barlow);
          font-size: 0.84rem;
          font-weight: 300;
          line-height: 1.6;
          color: #6e6e66;
        }

        .benefitRow {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.9rem;
        }

        .benefitRow span {
          border: 1px solid #dfdad4;
          background: #f2f1ee;
          color: #494840;
          padding: 0.35rem 0.55rem;
          font-family: var(--font-barlow);
          font-size: 0.63rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .popupForm {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: auto;
        }

        .popupInput {
          width: 100%;
          height: 50px;
          padding: 0 0.95rem;
          border: 1px solid #d0cdc8;
          background: transparent;
          font-family: var(--font-barlow);
          font-size: 0.84rem;
          font-weight: 300;
          color: #080808;
          outline: none;
          border-radius: 0;
          transition: border-color 170ms ease;
        }

        .popupInput:focus {
          border-color: #080808;
        }

        .popupActionWrap {
          margin-top: 0.1rem;
        }

        .submitButton {
          width: 100%;
          height: 52px;
          border: none;
          background: #080808;
          color: #f8f8f6;
          cursor: pointer;
          font-family: var(--font-barlow);
          font-size: 0.66rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          transition: opacity 180ms ease;
        }

        .submitButton:disabled {
          opacity: 0.52;
          cursor: not-allowed;
        }

        .privacyText {
          margin: 0.65rem 0 0;
          font-family: var(--font-barlow);
          font-size: 0.57rem;
          line-height: 1.45;
          letter-spacing: 0.03em;
          color: #b9b5b0;
        }

        .privacyLink {
          color: #8c8982;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .successWrap {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-top: auto;
          margin-bottom: auto;
        }

        .successTitle {
          font-size: clamp(1.7rem, 4vw, 2.45rem);
        }

        @media (max-width: 768px) {
          .mobileDragHandle {
            display: none;
          }

          .regPopupContent {
            padding: 1rem 1rem calc(1rem + env(safe-area-inset-bottom));
            min-height: calc(min(94dvh, 760px) - 132px - 24px);
            overflow: auto;
            background: #0a0a0a;
          }

          .regPopupClose {
            top: 0.9rem;
            right: 0.95rem;
            width: 2.75rem;
            height: 2.75rem;
            font-size: 1.5rem;
            border-radius: 0;
            border-color: rgba(243, 243, 241, 0.12);
            background: rgba(255, 255, 255, 0.04);
            color: #f3f3f1;
          }

          .eyebrowText {
            margin-bottom: 0.7rem;
            margin-top: 0;
            color: rgba(243, 243, 241, 0.38);
            letter-spacing: 0.18em;
          }

          .popupTitle {
            font-size: clamp(1.7rem, 8vw, 2.45rem);
            line-height: 0.9;
            max-width: calc(100% - 3.25rem);
            color: #f3f3f1;
          }

          .supportText {
            font-size: 0.82rem;
            line-height: 1.55;
            margin-top: 0.7rem;
            margin-bottom: 0.85rem;
            max-width: 34ch;
            color: rgba(243, 243, 241, 0.58);
          }

          .regPopupVisualCaption {
            display: none;
          }

          .benefitRow {
            gap: 0.4rem;
            margin-bottom: 1rem;
          }

          .benefitRow span {
            font-size: 0.54rem;
            padding: 0.34rem 0.48rem;
            border-color: rgba(243, 243, 241, 0.14);
            background: transparent;
            color: rgba(243, 243, 241, 0.7);
          }

          .popupForm {
            gap: 0.62rem;
          }

          .popupInput {
            height: 54px;
            font-size: 16px;
            border-color: rgba(243, 243, 241, 0.14);
            color: #f3f3f1;
            background: rgba(255, 255, 255, 0.02);
          }

          .popupInput::placeholder {
            color: rgba(243, 243, 241, 0.34);
          }

          .popupInput:focus {
            border-color: rgba(175, 198, 214, 0.7);
          }

          .popupActionWrap {
            position: sticky;
            bottom: calc(env(safe-area-inset-bottom) * -1);
            background: linear-gradient(180deg, rgba(10, 10, 10, 0) 0%, #0a0a0a 28%);
            padding-top: 0.9rem;
            margin-top: 0;
          }

          .submitButton {
            height: 56px;
            font-size: 0.62rem;
            background: #f3f3f1;
            color: #0a0a0a;
          }

          .privacyText {
            font-size: 0.55rem;
            margin-top: 0.52rem;
            color: rgba(243, 243, 241, 0.32);
          }

          .privacyLink {
            color: rgba(243, 243, 241, 0.68);
          }

          .successWrap {
            color: #f3f3f1;
          }

          .successTitle {
            color: #f3f3f1;
          }
        }

        @media (max-height: 700px) and (max-width: 768px) {
          .regPopupVisual.isMobile {
            height: 88px;
          }

          .supportText {
            margin-bottom: 0.62rem;
          }

          .benefitRow {
            margin-bottom: 0.65rem;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes popupRiseDesktop {
          from {
            opacity: 0;
            transform: translate(-50%, calc(-50% + 12px));
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @keyframes popupRiseMobile {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
