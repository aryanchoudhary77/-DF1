import { create } from 'zustand';

export interface CartItem {
  product_id: string;
  title: string;
  quantity: int;
  price: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string) => void;
  updateQuantity: (product_id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (newItem) => set((state) => {
    const existing = state.items.find(i => i.product_id === newItem.product_id);
    if (existing) {
      return {
        items: state.items.map(i => 
          i.product_id === newItem.product_id 
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        )
      };
    }
    return { items: [...state.items, newItem] };
  }),
  removeItem: (product_id) => set((state) => ({
    items: state.items.filter(i => i.product_id !== product_id)
  })),
  updateQuantity: (product_id, quantity) => set((state) => ({
    items: state.items.map(i => i.product_id === product_id ? { ...i, quantity } : i)
  })),
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    const items = get().items;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));
