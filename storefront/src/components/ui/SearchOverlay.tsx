"use client";

import { useState, useEffect, useRef, useCallback, startTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Search } from "lucide-react";
import { products } from "@/lib/products";
import { searchProducts } from "@/lib/search";
import type { SearchResult } from "@/lib/search";

// Featured products shown when query is empty (static, fast)
const FEATURED = products
  .filter((p) => p.featured)
  .slice(0, 4)
  .map((p) => ({ id: p.id, slug: p.slug, name: p.name }));

// Local fallback search (Meilisearch unreachable)
function localSearch(q: string): SearchResult[] {
  const lq = q.toLowerCase();
  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(lq) ||
        p.subtitle.toLowerCase().includes(lq) ||
        p.description.toLowerCase().includes(lq) ||
        p.collection.toLowerCase().includes(lq)
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

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      startTransition(() => {
        setQuery("");
        setResults([]);
        setIsLoading(false);
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

  if (!isOpen) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, backgroundColor: "rgba(10,10,10,0.96)", display: "flex", flexDirection: "column" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Search size={20} color={isLoading ? "rgba(175,198,214,0.7)" : "rgba(255,255,255,0.4)"} style={{ transition: "color 0.2s" }} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск объектов..."
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "var(--font-barlow-condensed)", fontSize: "1.5rem", fontWeight: 300, letterSpacing: "0.04em", color: "#f8f8f6", caretColor: "#afc6d6" }}
        />
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center" }}
          aria-label="Закрыть поиск"
        >
          <X size={24} />
        </button>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem 0" }}>
        {query.trim().length > 1 && !isLoading && results.length === 0 && (
          <p style={{ padding: "2rem", fontFamily: "var(--font-barlow)", fontSize: "0.875rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em" }}>
            Нет результатов по запросу «{query}»
          </p>
        )}
        {results.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            onClick={onClose}
            style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 2rem", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {product.image ? (
              <div style={{ position: "relative", width: "52px", height: "68px", flexShrink: 0, backgroundColor: "#1a1a1a", overflow: "hidden" }}>
                <Image src={product.image} alt={product.name} fill sizes="52px" style={{ objectFit: "cover", filter: "grayscale(20%)" }} unoptimized />
              </div>
            ) : (
              <div style={{ width: "52px", height: "68px", flexShrink: 0, backgroundColor: "#1a1a1a" }} />
            )}
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.625rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#a8a8a2", marginBottom: "0.25rem" }}>
                {product.collection}
              </p>
              <p style={{ fontFamily: "var(--font-barlow-condensed)", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.04em", color: "#f8f8f6", marginBottom: "0.125rem" }}>
                {product.name}
              </p>
              {product.price > 0 && (
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8125rem", fontWeight: 300, color: "rgba(255,255,255,0.4)" }}>
                  ₽{product.price.toLocaleString("ru-RU")}
                </p>
              )}
            </div>
          </Link>
        ))}

        {/* Empty state: featured products */}
        {query.trim().length < 2 && (
          <div style={{ padding: "2rem" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: "1rem" }}>
              Популярные модели
            </p>
            {FEATURED.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={onClose}
                style={{ display: "block", padding: "0.5rem 0", fontFamily: "var(--font-barlow-condensed)", fontSize: "1.125rem", fontWeight: 700, letterSpacing: "0.04em", color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f8f8f6")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >
                {product.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
