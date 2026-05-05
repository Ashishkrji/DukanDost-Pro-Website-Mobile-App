import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  _id: string;
  fullName: string;
  businessName: string;
  email: string;
  role: string;
  upiId?: string;
  phone?: string;
  address?: string;
  GSTIN?: string;
  plan: 'Starter' | 'Pro' | 'Business';
}

interface SubscriptionDetails {
  endDate: string;
  billingType: 'monthly' | 'yearly';
  cancelAtPeriodEnd: boolean;
}

interface AuthState {
  user: User | null;
  subscriptionDetails: SubscriptionDetails | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setSubscriptionDetails: (details: SubscriptionDetails | null) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  fetchProfile: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const API_URL = '/api';

// Sync token with axios defaults on load
const token = JSON.parse(localStorage.getItem('dukandost-auth') || '{}')?.state?.token;
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      subscriptionDetails: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true, error: null, isLoading: false });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Also sync with api.ts's expected key
        localStorage.setItem('dd_token', token);
      },

      setUser: (user) => set({ user }),

      setSubscriptionDetails: (subscriptionDetails) => set({ subscriptionDetails }),

      logout: () => {
        set({ user: null, subscriptionDetails: null, token: null, isAuthenticated: false, error: null });
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('dd_token');
        axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true }).catch(() => {});
      },

      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),

      fetchProfile: async () => {
        try {
          const res = await axios.get(`${API_URL}/auth/profile`);
          if (res.data?.data?.user) {
            set({ user: res.data.data.user });
          }
        } catch (error) {
          console.error("Failed to fetch latest profile");
        }
      },

      updateUserProfile: async (data: Partial<User>) => {
        try {
          const res = await axios.put(`${API_URL}/auth/profile`, data);
          if (res.data?.data?.user) {
            set({ user: res.data.data.user });
          }
        } catch (error) {
          console.error("Failed to update profile", error);
          throw error;
        }
      },
    }),
    {
      name: 'dukandost-auth',
    }
  )
);
