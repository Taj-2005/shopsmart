"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartState = Record<string, number>;

export type WishlistState = Set<string>;

type ShopContextValue = {
  cart: CartState;
  wishlist: WishlistState;
  cartCount: number;
  wishlistCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (productId: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({});
  const [wishlist, setWishlist] = useState<WishlistState>(new Set());

  const cartCount = useMemo(
    () => Object.values(cart).reduce((s, q) => s + q, 0),
    [cart]
  );
  const wishlistCount = wishlist.size;

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] ?? 0) + quantity,
    }));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setCart((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      return;
    }
    setCart((prev) => ({ ...prev, [productId]: quantity }));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.has(productId),
    [wishlist]
  );

  const moveToCart = useCallback((productId: string) => {
    addToCart(productId, 1);
    setWishlist((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  }, [addToCart]);

  const value = useMemo<ShopContextValue>(
    () => ({
      cart,
      wishlist,
      cartCount,
      wishlistCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleWishlist,
      isInWishlist,
      moveToCart,
    }),
    [
      cart,
      wishlist,
      cartCount,
      wishlistCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleWishlist,
      isInWishlist,
      moveToCart,
    ]
  );

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
