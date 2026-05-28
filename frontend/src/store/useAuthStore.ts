import { create } from 'zustand';
import { storage } from '@/src/utils/storage';

interface User {
  id: string;
  dealer_code: string;
  name: string;
  mobile: string;
  credit_limit: number;
  outstanding_amount: number;
  wallet_balance: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  setAuth: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,
  setAuth: async (token: string, user: User) => {
    await storage.setItem('token', token);
    await storage.setItem('user', user);
    set({ token, user });
  },
  logout: async () => {
    await storage.removeItem('token');
    await storage.removeItem('user');
    set({ token: null, user: null });
  },
  checkAuth: async () => {
    try {
      const token = await storage.getItem('token', null);
      const user = await storage.getItem('user', null);
      if (token && user) {
        set({ token, user, isLoading: false });
      } else {
        set({ token: null, user: null, isLoading: false });
      }
    } catch (e) {
      set({ token: null, user: null, isLoading: false });
    }
  },
}));
