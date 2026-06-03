"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  startTransition,
  type ReactNode,
} from "react";
import type { Product } from "./products";
import {
  createCart as medusaCreateCart,
  addToCart as medusaAddToCart,
  updateCartItem as medusaUpdateItem,
  removeCartItem as medusaRemoveItem,
  getCart as medusaGetCart,
  getRegionByCountry,
  getProduct,
} from "./medusa";

const STORAGE_KEY = "aw-cart";
const CART_ID_KEY = "aw-cart-id";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  update: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartId: string | null;
}

const CartCtx = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);

  // Refs for stable access inside callbacks without dependency churn
  const itemsRef    = useRef<CartItem[]>([]);
  const cartIdRef   = useRef<string | null>(null);
  const regionId    = useRef<string | null>(null);
  const variantMap  = useRef<Record<string, string>>({}); // slug → variantId
  // variant_id → Medusa line item id
  const lineItemMap = useRef<Record<string, string>>({});

  // Keep refs in sync with state
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { cartIdRef.current = cartId; }, [cartId]);

  // ── Init ─────────────────────────────────────────────────────────────────────
  useEffect(() => {
    startTransition(() => {
      setItems(loadCart());
      setHydrated(true);
    });

    const savedId = localStorage.getItem(CART_ID_KEY);
    if (savedId) {
      setCartId(savedId);
      cartIdRef.current = savedId;
      // Rebuild line-item map from Medusa
      medusaGetCart(savedId)
        .then(cart => {
          if (!cart?.items) return;
          for (const item of (cart.items as { id: string; variant_id: string }[])) {
            if (item.variant_id && item.id) lineItemMap.current[item.variant_id] = item.id;
          }
        })
        .catch(() => {});
    }

    // Fetch Russia region for cart creation
    getRegionByCountry("ru")
      .then(r => { if (r?.id) regionId.current = r.id; })
      .catch(() => {});
  }, []);

  // Persist on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  // ── Medusa helpers (stable, use refs) ────────────────────────────────────────
  const ensureCartId = useCallback(async (): Promise<string | null> => {
    if (cartIdRef.current) return cartIdRef.current;
    if (!regionId.current) return null;
    try {
      const cart = await medusaCreateCart(regionId.current);
      localStorage.setItem(CART_ID_KEY, cart.id);
      cartIdRef.current = cart.id;
      setCartId(cart.id);
      return cart.id;
    } catch {
      return null;
    }
  }, []);

  const resolveVariantId = useCallback(async (product: Product): Promise<string | null> => {
    if (variantMap.current[product.slug]) return variantMap.current[product.slug];
    try {
      const mp = await getProduct(product.slug);
      const vid = (mp as { variants?: { id: string }[] })?.variants?.[0]?.id ?? null;
      if (vid) variantMap.current[product.slug] = vid;
      return vid;
    } catch {
      return null;
    }
  }, []);

  // ── Cart operations ───────────────────────────────────────────────────────────
  const add = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { product, quantity: qty }];
    });
    setIsOpen(true);

    // Background Medusa sync — non-blocking, silent fail
    void (async () => {
      try {
        const cid = await ensureCartId();
        if (!cid) return;
        const vid = await resolveVariantId(product);
        if (!vid) return;
        const cart = await medusaAddToCart(cid, vid, qty);
        const added = (cart?.items as { id: string; variant_id: string }[] | undefined)
          ?.find(i => i.variant_id === vid);
        if (added?.id) lineItemMap.current[vid] = added.id;
      } catch {
        // localStorage is source of truth — fail silently
      }
    })();
  }, [ensureCartId, resolveVariantId]);

  const remove = useCallback((id: string) => {
    const target = itemsRef.current.find(i => i.product.id === id);
    setItems((prev) => prev.filter((i) => i.product.id !== id));

    if (target) {
      void (async () => {
        try {
          const cid = cartIdRef.current;
          if (!cid) return;
          const vid = await resolveVariantId(target.product);
          if (!vid) return;
          const lid = lineItemMap.current[vid];
          if (!lid) return;
          await medusaRemoveItem(cid, lid);
          delete lineItemMap.current[vid];
        } catch { /* silent */ }
      })();
    }
  }, [resolveVariantId]);

  const update = useCallback((id: string, qty: number) => {
    const target = itemsRef.current.find(i => i.product.id === id);
    if (qty < 1) {
      setItems((prev) => prev.filter((i) => i.product.id !== id));
    } else {
      setItems((prev) => prev.map((i) => (i.product.id === id ? { ...i, quantity: qty } : i)));
    }

    if (target) {
      void (async () => {
        try {
          const cid = cartIdRef.current;
          if (!cid) return;
          const vid = await resolveVariantId(target.product);
          if (!vid) return;
          const lid = lineItemMap.current[vid];
          if (!lid) return;
          if (qty < 1) {
            await medusaRemoveItem(cid, lid);
            delete lineItemMap.current[vid];
          } else {
            await medusaUpdateItem(cid, lid, qty);
          }
        } catch { /* silent */ }
      })();
    }
  }, [resolveVariantId]);

  const clear = useCallback(() => {
    setItems([]);
    lineItemMap.current = {};
    // Abandon Medusa cart — fresh one created on next add
    localStorage.removeItem(CART_ID_KEY);
    cartIdRef.current = null;
    setCartId(null);
  }, []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartCtx.Provider
      value={{
        items,
        add,
        remove,
        update,
        clear,
        count,
        total,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        cartId,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
