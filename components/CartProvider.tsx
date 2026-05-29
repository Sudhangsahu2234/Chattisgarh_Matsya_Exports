"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { CartItem, Fish } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addFish: (fish: Fish) => void;
  updateItem: (fishId: string, patch: Partial<Omit<CartItem, "fishId">>) => void;
  removeItem: (fishId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const storageKey = "cg-fish-export-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      setItems(JSON.parse(raw) as CartItem[]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, loaded]);

  const addFish = (fish: Fish) => {
    setItems((current) => {
      const existing = current.find((item) => item.fishId === fish.id);
      if (existing) {
        return current.map((item) =>
          item.fishId === fish.id ? { ...item, quantityKg: item.quantityKg + 10 } : item
        );
      }

      return [...current, { fishId: fish.id, quantityKg: 10, packaging: "chilled" }];
    });
  };

  const updateItem = (fishId: string, patch: Partial<Omit<CartItem, "fishId">>) => {
    setItems((current) =>
      current.map((item) =>
        item.fishId === fishId
          ? {
              ...item,
              ...patch,
              quantityKg: patch.quantityKg ? Math.max(1, Math.round(patch.quantityKg)) : item.quantityKg
            }
          : item
      )
    );
  };

  const removeItem = (fishId: string) => {
    setItems((current) => current.filter((item) => item.fishId !== fishId));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: items.length,
        addFish,
        updateItem,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
