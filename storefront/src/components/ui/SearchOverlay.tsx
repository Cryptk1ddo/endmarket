"use client";

import { useState, useEffect, useRef, useCallback, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import { products } from "@/lib/products";
import { searchProducts } from "@/lib/search";
import type { SearchResult } from "@/lib/search";

// Featured products shown when query is empty (static, fast)
const FEATURED = products
  .filter((p) => p.featured)
  .slice(0, 4)
  .map((p) => ({ id: p.id, slug: p.slug, name: p.name, collection: p.collection, price: p.price, image: p.image }));

const SUGGESTION_POOL = products.slice(0, 32).map((product) => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  collection: product.collection,
  price: product.price,
  image: product.image,
  brand: product.brand,
  material: product.material,
  subtitle: product.subtitle,
}));

// Local fallback search (Meilisearch unreachable)
function localSearch(q: string): SearchResult[] {
  const lq = q.toLowerCase();
  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(lq) ||
        p.brand.toLowerCase().includes(lq) ||
        p.subtitle.toLowerCase().includes(lq) ||
        p.description.toLowerCase().includes(lq) ||
        p.collection.toLowerCase().includes(lq) ||
        p.material.toLowerCase().includes(lq)
    )
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      collection: p.collection,
      price: p.price,
      image: p.image,
    }));
}

function getAutofillText(query: string, candidates: Array<{ name: string; brand?: string; collection?: string }>): string {
  const trimmed = query.trim();
  if (trimmed.length < 2) return "";

  const lower = trimmed.toLowerCase();
  const direct = candidates.find((candidate) => candidate.name.toLowerCase().startsWith(lower));
  if (direct) return direct.name;

  const brandPrefix = candidates.find((candidate) => candidate.brand?.toLowerCase().startsWith(lower));
  if (brandPrefix?.brand) return brandPrefix.brand;

  const collectionPrefix = candidates.find((candidate) => candidate.collection?.toLowerCase().startsWith(lower));
  if (collectionPrefix?.collection) return collectionPrefix.collection;

  return "";
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleItems = query.trim().length >= 2 ? results : FEATURED;
  const autofill = getAutofillText(query, query.trim().length >= 2 ? [...results, ...SUGGESTION_POOL] : SUGGESTION_POOL);

  useEffect(() => {
    if (isOpen) {
      startTransition(() => setActiveIndex(0));
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      startTransition(() => {
        setQuery("");
        setResults([]);
        setIsLoading(false);
        setActiveIndex(0);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen, onClose]);

  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const meili = await searchProducts(q);
    setResults(meili ?? localSearch(q));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length >= 2) startTransition(() => setIsLoading(true));
    debounceRef.current = setTimeout(() => runSearch(query), 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, results]);

  const acceptAutofill = useCallback(() => {
    if (!autofill || autofill.toLowerCase() === query.trim().toLowerCase()) return;
    setQuery(autofill);
  }, [autofill, query]);

  const goToItem = useCallback((item: { slug: string }) => {
    onClose();
    router.push(`/product/${item.slug}`);
  }, [onClose, router]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.key === "Tab" || event.key === "ArrowRight") && autofill && inputRef.current?.selectionStart === query.length) {
      event.preventDefault();
      acceptAutofill();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % Math.max(visibleItems.length, 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + Math.max(visibleItems.length, 1)) % Math.max(visibleItems.length, 1));
      return;
    }

    if (event.key === "Enter") {
      const target = visibleItems[activeIndex] ?? visibleItems[0];
      if (target) {
        event.preventDefault();
        goToItem(target);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 199,
          background: "rgba(10,10,10,0.5)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Поиск по каталогу"
        style={{
          position: "fixed",
          top: "clamp(4.8rem, 10vh, 6.5rem)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 200,
          width: "min(1040px, calc(100vw - 1rem))",
          maxHeight: "min(80vh, 760px)",
          overflow: "hidden",
          border: "1px solid rgba(243,243,241,0.12)",
          background: "rgba(12,12,12,0.97)",
          boxShadow: "0 28px 96px rgba(0,0,0,0.42)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "1rem 1.1rem 0.85rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "0.85rem" }}>
              <h2 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3.2vw, 2.4rem)", lineHeight: 0.92, letterSpacing: "-0.035em", color: "#f3f3f1" }}>
                Поиск
              </h2>
              <button
                onClick={onClose}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.4rem",
                  height: "2.4rem",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(248,248,246,0.72)",
                  cursor: "pointer",
                }}
                aria-label="Закрыть поиск"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", borderBottom: "1px solid rgba(255,255,255,0.12)", paddingBottom: "0.7rem" }}>
              <Search size={18} color={isLoading ? "rgba(175,198,214,0.88)" : "rgba(248,248,246,0.45)"} />

              <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
                {autofill && autofill.toLowerCase() !== query.trim().toLowerCase() && (
                  <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", pointerEvents: "none", fontFamily: "var(--font-barlow-condensed)", fontSize: "clamp(1rem, 2.6vw, 1.5rem)", fontWeight: 300, letterSpacing: "0.03em", color: "rgba(248,248,246,0.2)" }}>
                    <span style={{ opacity: 0 }}>{query}</span>
                    <span>{autofill.slice(query.length)}</span>
                  </div>
                )}

                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Введите модель, бренд или серию"
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    padding: 0,
                    fontFamily: "var(--font-barlow-condensed)",
                    fontSize: "clamp(1rem, 2.6vw, 1.5rem)",
                    fontWeight: 300,
                    letterSpacing: "0.03em",
                    color: "#f8f8f6",
                    caretColor: "#afc6d6",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem", marginTop: "0.7rem" }}>
              <p style={{ margin: 0, fontFamily: "var(--font-barlow)", fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(248,248,246,0.26)" }}>
                {query.trim().length < 2 ? `${FEATURED.length} picks` : `${visibleItems.length} results`}
              </p>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0.2rem 0 0.6rem" }}>
            {query.trim().length > 1 && !isLoading && results.length === 0 && (
              <p style={{ padding: "1.3rem 1.2rem", fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.34)", letterSpacing: "0.04em" }}>
                Нет результатов по запросу «{query}»
              </p>
            )}

            {visibleItems.map((product, index) => {
              const active = index === activeIndex;
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  onMouseEnter={() => setActiveIndex(index)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px minmax(0, 1fr) auto",
                    alignItems: "center",
                    gap: "0.95rem",
                    padding: "0.78rem 1.1rem",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.045)",
                    background: active ? "rgba(255,255,255,0.045)" : "transparent",
                    transition: "background 0.15s",
                  }}
                >
                  {product.image ? (
                    <div style={{ position: "relative", width: "68px", height: "84px", backgroundColor: "#151515", overflow: "hidden" }}>
                      <Image src={product.image} alt={product.name} fill sizes="72px" style={{ objectFit: "cover", filter: "grayscale(18%)" }} unoptimized />
                    </div>
                  ) : (
                    <div style={{ width: "68px", height: "84px", backgroundColor: "#151515" }} />
                  )}

                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: "0 0 0.22rem", fontFamily: "var(--font-barlow)", fontSize: "0.56rem", letterSpacing: "0.16em", textTransform: "uppercase", color: active ? "rgba(175,198,214,0.88)" : "#a8a8a2" }}>
                      {product.collection}
                    </p>
                    <p style={{ margin: "0 0 0.14rem", fontFamily: "var(--font-barlow-condensed)", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.025em", color: "#f8f8f6", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {product.name}
                    </p>
                    {product.price > 0 && (
                      <p style={{ margin: 0, fontFamily: "var(--font-barlow)", fontSize: "0.76rem", fontWeight: 300, color: "rgba(255,255,255,0.42)" }}>
                        ₽{product.price.toLocaleString("ru-RU")}
                      </p>
                    )}
                  </div>

                  <ArrowUpRight size={16} color={active ? "rgba(248,248,246,0.74)" : "rgba(248,248,246,0.2)"} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          [role="dialog"][aria-label="Поиск по каталогу"] {
            width: min(760px, calc(100vw - 1rem)) !important;
          }
        }

        @media (max-width: 640px) {
          [role="dialog"][aria-label="Поиск по каталогу"] {
            top: 4.6rem !important;
            width: calc(100vw - 0.5rem) !important;
            max-height: calc(100dvh - 5rem) !important;
          }

          [role="dialog"][aria-label="Поиск по каталогу"] > div:first-child > div:first-child {
            align-items: flex-start !important;
          }
        }
      `}</style>
    </>
  );
}
