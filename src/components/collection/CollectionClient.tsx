"use client";

import { useState, useEffect, startTransition, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { collections, collectionLabels } from "@/lib/products";
import type { Product } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";

const BRANDS = ["Ballu", "Haier", "Hisense", "Daikin"] as const;

const CATEGORY_LABELS: Record<string, string> = {
  "Настенные":           "Настенные (сплит)",
  "Кассетные":           "Кассетные (мульти)",
  "Канальные":           "Канальные",
  "Напольно-потолочные": "Напольно-потолочные",
};

// ─── Filter Sidebar (reused on desktop + mobile drawer) ────────────────────
function FilterPanel({
  products,
  brands,
  categories,
  onToggleBrand,
  onToggleCategory,
  onReset,
}: {
  products: Product[];
  brands: string[];
  categories: string[];
  onToggleBrand: (b: string) => void;
  onToggleCategory: (c: string) => void;
  onReset: () => void;
}) {
  const countByBrand = (b: string) => products.filter((p) => p.brand === b).length;
  const countByCat = (c: string) => products.filter((p) => p.collection === c).length;
  const activeCount = brands.length + categories.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 1.25rem 1rem",
          borderBottom: "1px solid #e0ddd8",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 600,
            color: "#080808",
          }}
        >
          Фильтры{activeCount > 0 && ` (${activeCount})`}
        </span>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.6rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#a8a8a2",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            Сбросить
          </button>
        )}
      </div>

      {/* Brands */}
      <div style={{ padding: "1.25rem", borderBottom: "1px solid #e0ddd8" }}>
        <p
          style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "0.5875rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#a8a8a2",
            marginBottom: "0.875rem",
          }}
        >
          Бренд
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {BRANDS.map((b) => {
            const count = countByBrand(b);
            const checked = brands.includes(b);
            return (
              <label
                key={b}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  cursor: count > 0 ? "pointer" : "default",
                  opacity: count > 0 ? 1 : 0.35,
                }}
              >
                <span
                  onClick={() => count > 0 && onToggleBrand(b)}
                  style={{
                    width: "14px",
                    height: "14px",
                    border: `1px solid ${checked ? "#080808" : "#c7c7c5"}`,
                    backgroundColor: checked ? "#080808" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s",
                    cursor: count > 0 ? "pointer" : "default",
                  }}
                >
                  {checked && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="#f8f8f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span
                  onClick={() => count > 0 && onToggleBrand(b)}
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.8125rem",
                    fontWeight: checked ? 500 : 300,
                    color: "#080808",
                    flex: 1,
                  }}
                >
                  {b}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.6875rem",
                    color: "#a8a8a2",
                  }}
                >
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: "1.25rem" }}>
        <p
          style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "0.5875rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#a8a8a2",
            marginBottom: "0.875rem",
          }}
        >
          Тип системы
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {collections.map((c) => {
            const count = countByCat(c);
            const checked = categories.includes(c);
            return (
              <label
                key={c}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  cursor: count > 0 ? "pointer" : "default",
                  opacity: count > 0 ? 1 : 0.35,
                }}
              >
                <span
                  onClick={() => count > 0 && onToggleCategory(c)}
                  style={{
                    width: "14px",
                    height: "14px",
                    border: `1px solid ${checked ? "#080808" : "#c7c7c5"}`,
                    backgroundColor: checked ? "#080808" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.15s",
                    cursor: count > 0 ? "pointer" : "default",
                  }}
                >
                  {checked && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3l2 2 4-4" stroke="#f8f8f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span
                  onClick={() => count > 0 && onToggleCategory(c)}
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.8125rem",
                    fontWeight: checked ? 500 : 300,
                    color: "#080808",
                    flex: 1,
                    lineHeight: 1.3,
                  }}
                >
                  {CATEGORY_LABELS[c] ?? c}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.6875rem",
                    color: "#a8a8a2",
                  }}
                >
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function CollectionClient({
  initialProducts,
  initialCollection = "",
  initialBrand = "",
}: {
  initialProducts: Product[];
  initialCollection?: string;
  initialBrand?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hoverState, setHoverState] = useState<{ id: string; index: number } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function handleCardEnter(productId: string) {
    setHoverState({ id: productId, index: 0 });
  }
  function handleCardLeave() {
    setHoverState(null);
  }
  function handleCardMove(e: React.MouseEvent<HTMLAnchorElement>, product: Product) {
    const imgs = product.images?.length > 1 ? product.images : null;
    if (!imgs) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const index = Math.min(Math.floor((relX / rect.width) * imgs.length), imgs.length - 1);
    setHoverState((prev) =>
      prev?.id === product.id && prev?.index === index ? prev : { id: product.id, index }
    );
  }
  const { toggle, isWishlisted } = useWishlist();

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialBrand && BRANDS.includes(initialBrand as never) ? [initialBrand] : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCollection && collections.includes(initialCollection as never) ? [initialCollection] : []
  );

  useEffect(() => {
    const brand = searchParams.get("brand") ?? "";
    const col = searchParams.get("collection") ?? "";
    startTransition(() => {
      setSelectedBrands(brand && BRANDS.includes(brand as never) ? [brand] : []);
      setSelectedCategories(col && collections.includes(col as never) ? [col] : []);
    });
  }, [searchParams]);

  const pushUrl = useCallback(
    (brands: string[], cats: string[]) => {
      const params = new URLSearchParams();
      if (brands.length === 1) params.set("brand", brands[0]);
      if (cats.length === 1) params.set("collection", cats[0]);
      router.push(`/collection${params.size > 0 ? `?${params}` : ""}`, { scroll: false });
    },
    [router]
  );

  function toggleBrand(b: string) {
    const next = selectedBrands.includes(b)
      ? selectedBrands.filter((x) => x !== b)
      : [...selectedBrands, b];
    setSelectedBrands(next);
    pushUrl(next, selectedCategories);
  }

  function toggleCategory(c: string) {
    const next = selectedCategories.includes(c)
      ? selectedCategories.filter((x) => x !== c)
      : [...selectedCategories, c];
    setSelectedCategories(next);
    pushUrl(selectedBrands, next);
  }

  function reset() {
    setSelectedBrands([]);
    setSelectedCategories([]);
    router.push("/collection", { scroll: false });
  }

  const filtered = initialProducts.filter((p) => {
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const catMatch = selectedCategories.length === 0 || selectedCategories.includes(p.collection);
    return brandMatch && catMatch;
  });

  const activeCount = selectedBrands.length + selectedCategories.length;

  return (
    <>
      <div style={{ minHeight: "100svh", backgroundColor: "#f3f3f1", paddingTop: "72px" }}>

        {/* ── Page Header ── */}
        <div
          style={{
            padding: "2rem 1.5rem 1.25rem",
            borderBottom: "1px solid #e0ddd8",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "1rem",
            backgroundColor: "#f3f3f1",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-barlow-condensed)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.01em",
              color: "#080808",
              margin: 0,
            }}
          >
            КАТАЛОГ
          </h1>
          <p
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.75rem",
              fontWeight: 300,
              color: "#6e6e66",
              margin: 0,
              paddingBottom: "0.25rem",
            }}
          >
            {filtered.length}{" "}
            {filtered.length === 1 ? "позиция" : filtered.length < 5 ? "позиции" : "позиций"}
          </p>
        </div>

        {/* ── Mobile filter bar ── */}
        <div
          className="mobile-filter-bar"
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1.25rem",
            borderBottom: "1px solid #e0ddd8",
            backgroundColor: "#f3f3f1",
            position: "sticky",
            top: "72px",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setDrawerOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontFamily: "var(--font-barlow)",
              fontSize: "0.6875rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: activeCount > 0 ? 600 : 400,
              background: activeCount > 0 ? "#080808" : "none",
              border: "1px solid #080808",
              padding: "0.5rem 0.875rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <SlidersHorizontal size={13} color={activeCount > 0 ? "#f3f3f1" : "#080808"} />
            <span style={{ color: activeCount > 0 ? "#f3f3f1" : "#080808" }}>
              Фильтры{activeCount > 0 ? ` · ${activeCount}` : ""}
            </span>
          </button>
          {activeCount > 0 && (
            <button
              onClick={reset}
              style={{
                fontFamily: "var(--font-barlow)",
                fontSize: "0.6875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#a8a8a2",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              Сбросить
            </button>
          )}
        </div>

        {/* ── Body: Sidebar + Grid ── */}
        <div className="collection-body" style={{ display: "flex", alignItems: "flex-start" }}>

          {/* Desktop Sidebar */}
          <aside
            className="collection-sidebar"
            style={{
              width: "220px",
              flexShrink: 0,
              borderRight: "1px solid #e0ddd8",
              position: "sticky",
              top: "72px",
              maxHeight: "calc(100svh - 72px)",
              overflowY: "auto",
              backgroundColor: "#f3f3f1",
            }}
          >
            <FilterPanel
              products={initialProducts}
              brands={selectedBrands}
              categories={selectedCategories}
              onToggleBrand={toggleBrand}
              onToggleCategory={toggleCategory}
              onReset={reset}
            />
          </aside>

          {/* Product Grid */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  padding: "5rem 2rem",
                  textAlign: "center",
                  fontFamily: "var(--font-barlow)",
                  color: "#a8a8a2",
                  fontSize: "0.875rem",
                }}
              >
                <p style={{ marginBottom: "1.5rem" }}>Ничего не найдено</p>
                <button
                  onClick={reset}
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "0.6875rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    background: "none",
                    border: "1px solid #080808",
                    color: "#080808",
                    padding: "0.625rem 1.25rem",
                    cursor: "pointer",
                  }}
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div
                className="collection-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  borderLeft: "1px solid #e0ddd8",
                }}
              >
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    style={{
                      display: "block",
                      textDecoration: "none",
                      borderRight: "1px solid #e0ddd8",
                      borderBottom: "1px solid #e0ddd8",
                    }}
                    onMouseEnter={() => handleCardEnter(product.id)}
                    onMouseLeave={handleCardLeave}
                    onMouseMove={(e) => handleCardMove(e, product)}
                  >
                    {(() => {
                      const imgs = product.images?.length > 1 ? product.images : [product.image];
                      const isHovered = hoverState?.id === product.id;
                      const activeIdx = isHovered ? (hoverState?.index ?? 0) : 0;
                      return (
                    <div
                      style={{
                        position: "relative",
                        overflow: "hidden",
                        backgroundColor: "#ededeb",
                        aspectRatio: "3/4",
                      }}
                    >
                      {imgs.map((src, i) => (
                        <Image
                          key={src + i}
                          src={src}
                          alt={i === 0 ? product.name : ""}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                          style={{
                            objectFit: "cover",
                            filter: "grayscale(10%)",
                            transition: "opacity 0.28s ease, transform 0.65s cubic-bezier(0.25, 0.1, 0.25, 1)",
                            transform: isHovered ? "scale(1.035)" : "scale(1)",
                            opacity: activeIdx === i ? 1 : 0,
                          }}
                        />
                      ))}
                      {/* Dot indicators — only when multiple images + hovered */}
                      {imgs.length > 1 && isHovered && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "0.75rem",
                            left: 0,
                            right: 0,
                            display: "flex",
                            justifyContent: "center",
                            gap: "5px",
                            pointerEvents: "none",
                          }}
                        >
                          {imgs.map((_, i) => (
                            <span
                              key={i}
                              style={{
                                display: "block",
                                height: "2px",
                                width: activeIdx === i ? "18px" : "5px",
                                backgroundColor: "#f8f8f6",
                                opacity: activeIdx === i ? 1 : 0.45,
                                transition: "width 0.2s ease, opacity 0.2s ease",
                                borderRadius: "1px",
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <button
                        onClick={(e) => { e.preventDefault(); toggle(product); }}
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          right: "0.75rem",
                          background: "rgba(248,248,246,0.9)",
                          border: "none",
                          width: "2rem",
                          height: "2rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                        aria-label={isWishlisted(product.id) ? "Убрать из избранного" : "Добавить в избранное"}
                      >
                        <Heart
                          size={14}
                          fill={isWishlisted(product.id) ? "#080808" : "none"}
                          color="#080808"
                          strokeWidth={1.5}
                        />
                      </button>
                      <span
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          left: "0.75rem",
                          fontFamily: "var(--font-barlow)",
                          fontSize: "0.5rem",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: "#f8f8f6",
                          backgroundColor: "rgba(8,8,8,0.6)",
                          padding: "0.2rem 0.4rem",
                          backdropFilter: "blur(4px)",
                          zIndex: 2,
                        }}
                      >
                        {product.brand}
                      </span>
                    </div>
                      );
                    })()}

                    <div style={{ padding: "0.875rem 1rem 1.25rem" }}>
                      <p
                        style={{
                          fontFamily: "var(--font-barlow)",
                          fontSize: "0.625rem",
                          letterSpacing: "0.06em",
                          color: "#a8a8a2",
                          marginBottom: "0.25rem",
                          textTransform: "uppercase",
                        }}
                      >
                        {collectionLabels[product.collection] ?? product.collection}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-barlow)",
                          fontSize: "0.8125rem",
                          fontWeight: 400,
                          color: "#080808",
                          marginBottom: "0.5rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {product.name}
                      </p>
                      <p
                        style={{
                          fontFamily: "var(--font-barlow-condensed)",
                          fontSize: "1rem",
                          fontWeight: 700,
                          letterSpacing: "0.02em",
                          color: "#080808",
                        }}
                      >
                        ₽{product.price.toLocaleString("ru-RU")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {drawerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(8,8,8,0.5)",
              backdropFilter: "blur(2px)",
            }}
          />
          <div
            style={{
              position: "relative",
              backgroundColor: "#f3f3f1",
              maxHeight: "80svh",
              overflowY: "auto",
              borderTop: "1px solid #e0ddd8",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #e0ddd8" }}>
              <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, color: "#080808" }}>
                Фильтры
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}
                aria-label="Закрыть"
              >
                <X size={18} color="#080808" />
              </button>
            </div>
            <FilterPanel
              products={initialProducts}
              brands={selectedBrands}
              categories={selectedCategories}
              onToggleBrand={toggleBrand}
              onToggleCategory={toggleCategory}
              onReset={reset}
            />
            <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid #e0ddd8" }}>
              <button
                onClick={() => setDrawerOpen(false)}
                style={{
                  width: "100%",
                  fontFamily: "var(--font-barlow)",
                  fontSize: "0.6875rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "#f3f3f1",
                  backgroundColor: "#080808",
                  border: "none",
                  padding: "0.875rem",
                  cursor: "pointer",
                }}
              >
                Показать {filtered.length} {filtered.length === 1 ? "позицию" : filtered.length < 5 ? "позиции" : "позиций"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .collection-sidebar { display: none !important; }
          .mobile-filter-bar { display: flex !important; }
          .collection-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .collection-sidebar::-webkit-scrollbar { width: 0; }
      `}</style>
    </>
  );
}
