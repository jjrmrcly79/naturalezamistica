import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/types/product";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          let newItems;

          if (existingItem) {
            newItems = state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            newItems = [...state.items, { ...product, quantity: 1 }];
          }

          const total = newItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
          return { items: newItems, total };
        }),

      removeItem: (productId) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== productId);
          const total = newItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
          return { items: newItems, total };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return get().removeItem(productId), state;
          }

          const newItems = state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          );
          const total = newItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);
          return { items: newItems, total };
        }),

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: "cart-storage",
    }
  )
);
