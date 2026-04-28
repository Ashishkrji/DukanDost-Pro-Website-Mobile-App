import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface Admin {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
}

interface AdminAuthState {
  admin: Admin | null;
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  isLoggingIn: boolean;
  adminError: string | null;
  setAdminAuth: (admin: Admin, token: string) => void;
  adminLogout: () => void;
  setAdminError: (error: string | null) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      adminToken: null,
      isAdminAuthenticated: false,
      isLoggingIn: false,
      adminError: null,

      setAdminAuth: (admin, token) => {
        set({ admin, adminToken: token, isAdminAuthenticated: true, adminError: null });
        // Optional: Set specific admin header if needed, or use a custom axios instance
      },

      adminLogout: () => {
        set({ admin: null, adminToken: null, isAdminAuthenticated: false, adminError: null });
      },

      setAdminError: (error) => set({ adminError: error }),
    }),
    {
      name: 'dukandost-admin-auth',
    }
  )
);
