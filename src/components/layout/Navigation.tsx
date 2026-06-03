"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Search, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import SearchOverlay from "@/components/ui/SearchOverlay";

const NAV_LINKS = [
  { label: "Все модели",       href: "/collection",                                 highlight: true  },
  { label: "Ballu",            href: "/collection?brand=Ballu",                    highlight: false },
  { label: "Haier",            href: "/collection?brand=Haier",                    highlight: false },
  { label: "Hisense",          href: "/collection?brand=Hisense",                  highlight: false },
  { label: "Бренды",           href: "/brands",                                    highlight: false },
  { label: "Монтаж",           href: "/installation",                              highlight: false },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, items, total, remove, update, isOpen, openCart, closeCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* ── Main header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 h-[64px] md:h-[72px]">
        <div className="relative flex justify-between items-center h-full px-4 md:px-6 max-w-[1920px] mx-auto">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden -ml-1 p-2.5 text-white/70 hover:text-white transition-colors touch-manipulation"
            aria-label="Открыть меню"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo — centered on mobile/tablet, in-flow on desktop */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 text-xl md:text-2xl uppercase shrink-0 text-white hover:text-white/70 transition-colors"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.28em", lineHeight: 0.9 }}
          >
            ENDMARKET
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center space-x-7 text-[11px] uppercase tracking-[0.18em]">
            {NAV_LINKS.map((link) => {
              const linkPath = link.href.split("?")[0];
              const isActive = pathname === linkPath || (linkPath !== "/" && pathname.startsWith(linkPath));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-colors hover:text-white ${
                    isActive ? "text-white" : link.highlight ? "text-white" : "text-white/65"
                  }`}
                  style={{ fontFamily: "var(--font-body)", fontWeight: isActive || link.highlight ? 600 : 500 }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: phone + icons */}
          <div className="flex items-center gap-1 md:gap-4 shrink-0">
            <div className="flex items-center">
              <Link
                href="/profile"
                className="hidden md:flex p-2.5 text-white hover:text-gray-300 transition-colors touch-manipulation"
                aria-label="Профиль"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-white hover:text-gray-300 transition-colors touch-manipulation"
                aria-label="Поиск"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/wishlist"
                className="relative hidden md:flex p-2.5 text-white hover:text-gray-300 transition-colors touch-manipulation"
                aria-label="Избранное"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#f3f3f1] text-[#0a0a0a] text-[9px] font-bold leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={openCart}
                className="relative p-2.5 text-white hover:text-gray-300 transition-colors touch-manipulation"
                aria-label="Корзина"
              >
                <ShoppingBag className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#f3f3f1] text-[#0a0a0a] text-[9px] font-bold leading-none">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ── */}
      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[59] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      {/* Slide-in panel from left */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-[60] w-[min(320px,85vw)] bg-[#0a0a0a] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] lg:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!menuOpen}
      >
        {/* Menu header */}
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-white/10 shrink-0">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-lg uppercase text-white"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.24em", lineHeight: 0.9 }}
          >
            ENDMARKET
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 -mr-2 text-white/70 hover:text-white transition-colors touch-manipulation"
            aria-label="Закрыть меню"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center px-5 h-[52px] text-sm uppercase border-b border-white/[0.06] transition-colors ${link.highlight ? "text-white" : "text-white/60 hover:text-white"}`}
              style={{ fontFamily: "var(--font-body)", fontWeight: link.highlight ? 600 : 500, letterSpacing: "0.16em" }}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { setMenuOpen(false); openCart(); }}
            className="flex items-center w-full px-5 h-[52px] text-sm uppercase border-b border-white/[0.06] text-white/60 hover:text-white transition-colors touch-manipulation"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.16em" }}
          >
            Корзина{count > 0 ? ` (${count})` : ""}
          </button>
          <Link
            href="/profile"
            onClick={() => setMenuOpen(false)}
            className="flex items-center px-5 h-[52px] text-sm uppercase border-b border-white/[0.06] text-white/60 hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.16em" }}
          >
            Мой профиль
          </Link>
          <Link
            href="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="flex items-center px-5 h-[52px] text-sm uppercase border-b border-white/[0.06] text-white/60 hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.16em" }}
          >
            Избранное{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
          </Link>
        </div>


      </div>

      {/* ── Cart backdrop ── */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* ── Cart drawer ── */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[70] w-[min(480px,100vw)] bg-[#f8f8f6] border-l border-[#e0ddd8] flex flex-col transition-transform duration-[350ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-[64px] md:h-[72px] border-b border-[#e0ddd8] shrink-0">
          <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#080808" }}>
            Корзина{count > 0 ? ` (${count})` : ""}
          </span>
          <button
            onClick={closeCart}
            className="flex items-center gap-1.5 text-[#6e6e66] hover:text-[#080808] transition-colors"
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase" }}
          >
            <X className="w-3.5 h-3.5" /> ЗАКРЫТЬ
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center">
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 300, color: "#6e6e66" }}>
                Ваша корзина пуста
              </p>
              <Link
                href="/collection"
                onClick={closeCart}
                style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#080808", textDecoration: "none", borderBottom: "1px solid #080808", paddingBottom: "2px" }}
              >
                Весь каталог
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="grid gap-4 p-5 border-b border-[#e0ddd8]" style={{ gridTemplateColumns: "80px 1fr" }}>
                <div className="relative bg-[#ededeb]" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    sizes="80px"
                    style={{ objectFit: "cover", filter: "grayscale(15%)" }}
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.0625rem", fontWeight: 700, letterSpacing: "0.04em", color: "#080808", lineHeight: 1.1, marginBottom: "0.25rem" }}>
                      {item.product.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", fontWeight: 300, color: "#6e6e66" }}>
                      {item.product.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button onClick={() => update(item.product.id, item.quantity - 1)} className="w-[30px] h-[30px] border border-[#e0ddd8] bg-none flex items-center justify-center text-[#080808] cursor-pointer">−</button>
                      <span className="w-9 text-center text-sm text-[#080808]">{item.quantity}</span>
                      <button onClick={() => update(item.product.id, item.quantity + 1)} className="w-[30px] h-[30px] border border-[#e0ddd8] bg-none flex items-center justify-center text-[#080808] cursor-pointer">+</button>
                    </div>
                    <div className="text-right">
                      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.875rem", fontWeight: 400, color: "#080808" }}>
                        ₽{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                      <button onClick={() => remove(item.product.id)} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.5625rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#a8a8a2", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: "0.25rem" }}>
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart footer */}
        {items.length > 0 && (
          <div className="border-t border-[#e0ddd8] p-6 shrink-0">
            <div className="flex justify-between items-baseline mb-3">
              <span className="label" style={{ color: "#6e6e66" }}>Итого</span>
              <span style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1.5rem", fontWeight: 700, color: "#080808" }}>
                ₽{total.toLocaleString()}
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", fontWeight: 300, color: "#a8a8a2", marginBottom: "1.25rem", lineHeight: 1.5 }}>
              Оплата через YooKassa. Доставка по России 1–7 дней.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block text-center py-4 mb-3 bg-[#080808] text-[#f8f8f6] transition-colors hover:bg-[#2a2a28]"
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}
            >
              Оформить заказ
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center py-2 text-[#6e6e66] hover:text-[#080808] transition-colors cursor-pointer bg-transparent border-none"
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase" }}
            >
              Продолжить просмотр
            </button>
          </div>
        )}
      </div>

      {/* ── Search Overlay ── */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
