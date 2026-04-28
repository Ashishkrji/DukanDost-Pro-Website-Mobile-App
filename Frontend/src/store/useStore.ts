import { create } from 'zustand';
import * as api from '../services/api';
import {
  mockCustomers,
  mockTransactions,
  mockProducts,
  mockStaff,
  mockPayments,
  mockInvoices,
  mockVouchers,
  mockCommunityPosts,
  mockOrders,
} from '../lib/mockData';

// ===========================
// Type Definitions
// ===========================

export interface User {
  id: string;
  name: string;
  phone: string;
  businessName: string;
  GSTIN: string;
  email?: string;
  address?: string;
  city?: string;
  upiId?: string;
  avatar?: string;
}

export interface Customer {
  id?: string;
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  gstin?: string;
  balance: number;
  creditLimit?: number;
  initials: string;
  color: string;
  status: 'Udhaar' | 'Up-to-date' | 'Overdue';
  lastTransactionDate: string;
  isActive?: boolean;
}

export interface TransactionNote {
  text: string;
  addedAt?: string;
  addedBy?: string;
}

export interface Transaction {
  id?: string;
  _id?: string;
  createdAt: string;
  date?: string;
  createdAtDate?: string;
  customerId: string;
  customerName: string;
  customerInitials: string;
  customerColor: string;
  amount: number;
  type: 'Diya' | 'Liya' | 'DIYA' | 'LIYA';
  note?: string;
  notes?: TransactionNote[];
  paymentMode?: string;
  invoiceId?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  price: number;
  status: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
  icon?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  attendance: 'Aaya' | 'Nahi Aaya' | 'Pending';
  salary: number;
  phone: string;
  status: 'Active' | 'On Leave';
  imageUrl?: string;
  initials?: string;
}

export interface PaymentInfo {
  id: string;
  _id?: string;
  date: string;
  createdAt?: string;
  customer: string;
  customerInitials: string;
  mode: 'UPI' | 'Card' | 'Wallet';
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
}

export interface Invoice {
  id: string;
  customer: string;
  phone: string;
  date: string;
  dueDate?: string;
  amount: number;
  gst?: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  items?: Array<{ name: string; qty: number; price: number; total: number }>;
}

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'flat';
  minOrder: number;
  maxDiscount: number;
  used: number;
  limit: number;
  expiry: string;
  status: 'Active' | 'Expired' | 'Paused';
  description: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  avatarColor: string;
  location: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  category: string;
  categoryColor: string;
  image?: string | null;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  items: string;
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  time: string;
  date: string;
  address: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

interface AppState {
  user: User;
  customers: Customer[];
  transactions: Transaction[];
  products: Product[];
  staff: Staff[];
  payments: PaymentInfo[];
  invoices: Invoice[];
  vouchers: Voucher[];
  communityPosts: CommunityPost[];
  orders: Order[];
  notifications: Notification[];

  // UI State
  sidebarOpen: boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
  isLoading: boolean;
  upgradePopupOpen: boolean;
  upgradePlanNeeded: 'Pro' | 'Business';
  upgradeFeatureName: string;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notif: Partial<Notification>) => void;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  clearNotifications: () => void;

  // Fetch Actions
  fetchCustomers: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchStaff: () => Promise<void>;
  fetchPayments: () => Promise<void>;
  fetchNotifications: () => Promise<void>;

  // Mutation Actions
  addTransaction: (tx: Partial<Transaction>) => Promise<void>;
  addCustomer: (customer: Partial<Customer>) => Promise<void>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  updateProductStock: (id: string, newStock: number) => Promise<void>;
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateStaffAttendance: (id: string, attendance: Staff['attendance']) => Promise<void>;
  addInvoice: (invoice: Partial<Invoice>) => Promise<void>;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => Promise<void>;
  addVoucher: (voucher: Partial<Voucher>) => Promise<void>;
  toggleVoucherStatus: (id: string) => Promise<void>;
  likePost: (postId: string) => void;
  addOrder: (order: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateUser: (data: Partial<User>) => void;
  openUpgradePopup: (plan: 'Pro' | 'Business', feature?: string) => void;
  closeUpgradePopup: () => void;
}

// ===========================
// Store Implementation
// ===========================

export const useStore = create<AppState>((set, get) => ({
  user: {
    id: '',
    name: '',
    phone: '',
    email: '',
    businessName: '',
    GSTIN: '',
    address: '',
    city: '',
    upiId: '',
  },

  // Initialized with empty arrays to clear dummy data
  customers: [],
  transactions: [],
  products: [],
  staff: [],
  payments: [],
  invoices: [],
  vouchers: [],
  communityPosts: [],
  orders: [],
  notifications: [],

  // UI State
  sidebarOpen: false,
  toastMessage: null,
  toastType: 'success',
  isLoading: false,
  upgradePopupOpen: false,
  upgradePlanNeeded: 'Pro',
  upgradeFeatureName: '',

  // UI Actions
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

  showToast: (message, type = 'success') => {
    set({ toastMessage: message, toastType: type });
    setTimeout(() => set({ toastMessage: null }), 3000);
  },

  hideToast: () => set({ toastMessage: null }),

  setLoading: (isLoading) => set({ isLoading }),

  addNotification: (notif) => set((state) => ({
    notifications: [{
      id: Math.random().toString(36).substring(7),
      title: notif.title || 'New Notification',
      message: notif.message || '',
      time: 'Just now',
      type: notif.type || 'info',
      read: false
    }, ...state.notifications]
  })),

  markNotificationAsRead: async (id) => {
    try {
      await api.markNotificationAsRead(id);
      set((state) => ({
        notifications: state.notifications.map(n => (n.id === id || (n as any)._id === id) ? { ...n, read: true } : n)
      }));
    } catch (err) {
      console.error('Failed to mark notification as read');
    }
  },

  markAllNotificationsAsRead: async () => {
    const { notifications } = get();
    for (const n of notifications) {
      if (!n.read) await api.markNotificationAsRead(n.id || (n as any)._id);
    }
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true }))
    }));
  },

  clearNotifications: () => set({ notifications: [] }),

  fetchNotifications: async () => {
    try {
      const data = await api.getNotifications();
      if (data.success) {
        set({ 
          notifications: data.notifications.map((n: any) => ({
            id: n._id,
            title: n.title,
            message: n.message,
            time: new Date(n.createdAt).toLocaleTimeString(),
            type: n.type,
            read: n.readBy?.includes(get().user.id) || false
          }))
        });
      }
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  },

  // Fetch with API fallback to mock data
  fetchCustomers: async () => {
    try {
      const data = await api.getCustomers();
      if (data && data.length > 0) set({ customers: data });
    } catch {
      // Keep mock data on error
    }
  },

  fetchTransactions: async () => {
    try {
      const data = await api.getTransactions();
      if (data && data.length > 0) set({ transactions: data });
    } catch {
      // Keep mock data on error
    }
  },

  fetchProducts: async () => {
    try {
      const data = await api.getProducts();
      if (data && data.length > 0) set({ products: data });
    } catch {
      // Keep mock data on error
    }
  },

  fetchStaff: async () => {
    try {
      const data = await api.getStaff();
      if (data && data.length > 0) set({ staff: data });
    } catch {
      // Keep mock data on error
    }
  },

  fetchPayments: async () => {
    try {
      const data = await api.getPayments();
      if (data && data.length > 0) set({ payments: data });
    } catch {
      // Keep mock data on error
    }
  },

  // Transactions
  addTransaction: async (txData) => {
    try {
      const newTx = await api.createTransaction(txData);
      set((state) => ({ transactions: [newTx, ...state.transactions] }));
      get().showToast(`Transaction added successfully!`);
    } catch (error) {
      get().showToast(`Failed to save transaction: ${(error as any).message}`, 'error');
    }
  },

  // Customers
  addCustomer: async (customer) => {
    try {
      const newCustomer = await api.createCustomer(customer);
      set((state) => ({ customers: [newCustomer, ...state.customers] }));
      get().showToast('New customer added!');
    } catch (error) {
      get().showToast(`Failed to add customer: ${(error as any).message}`, 'error');
    }
  },

  updateCustomer: async (id, data) => {
    try {
      const updated = await api.updateCustomer(id, data);
      set((state) => ({
        customers: state.customers.map((c) =>
          (c.id === id || c._id === id) ? updated : c
        ),
      }));
    } catch (error) {
      get().showToast(`Failed to update customer: ${(error as any).message}`, 'error');
    }
  },

  // Products
  updateProductStock: async (id, newStock) => {
    try {
      const updated = await api.updateProduct(id, { stock: newStock });
      set((state) => ({
        products: state.products.map((p) => p.id === id ? updated : p),
      }));
      get().showToast('Stock updated!');
    } catch (error) {
      get().showToast(`Failed to update stock: ${(error as any).message}`, 'error');
    }
  },

  addProduct: async (product) => {
    try {
      const newProduct = await api.createProduct(product);
      set((state) => ({ products: [newProduct, ...state.products] }));
      get().showToast('Product added!');
    } catch (error) {
      get().showToast(`Failed to add product: ${(error as any).message}`, 'error');
    }
  },

  // Staff
  updateStaffAttendance: async (id, attendance) => {
    try {
      await api.markAttendance(id, { status: attendance });
      set((state) => ({
        staff: state.staff.map((s) => s.id === id ? { ...s, attendance } : s),
      }));
      get().showToast('Attendance marked!');
    } catch (error) {
      get().showToast(`Failed to mark attendance: ${(error as any).message}`, 'error');
    }
  },

  // Invoices
  addInvoice: async (invoice) => {
    try {
      const newInvoice = await api.createInvoice(invoice);
      set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
      get().showToast('Invoice created!');
    } catch (error) {
      get().showToast(`Failed to create invoice: ${(error as any).message}`, 'error');
    }
  },

  updateInvoiceStatus: async (id, status) => {
    try {
      const updated = await api.updateInvoice(id, { status });
      set((state) => ({
        invoices: state.invoices.map((inv) => inv.id === id ? updated : inv),
      }));
      get().showToast(`Invoice marked as ${status}`);
    } catch (error) {
      get().showToast(`Failed to update invoice: ${(error as any).message}`, 'error');
    }
  },

  // Vouchers
  addVoucher: async (voucher) => {
    try {
      const newVoucher = await api.createVoucher(voucher);
      set((state) => ({ vouchers: [newVoucher, ...state.vouchers] }));
      get().showToast('Voucher created!');
    } catch (error) {
      get().showToast(`Failed to create voucher: ${(error as any).message}`, 'error');
    }
  },

  toggleVoucherStatus: async (id) => {
    try {
      const updated = await api.toggleVoucherStatus(id);
      set((state) => ({
        vouchers: state.vouchers.map((v) => v.id === id ? updated : v),
      }));
    } catch (error) {
      get().showToast(`Failed to toggle status: ${(error as any).message}`, 'error');
    }
  },

  // Community
  likePost: (postId) => {
    set((state) => ({
      communityPosts: state.communityPosts.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ),
    }));
  },

  // Orders
  addOrder: (order) => {
    const newOrder: Order = {
      id: 'ORD-' + Date.now(),
      customer: order.customer || '',
      phone: order.phone || '',
      items: order.items || '1 item',
      amount: order.amount || 0,
      status: 'Pending',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN'),
      address: order.address || '',
    };
    set((state) => ({ orders: [newOrder, ...state.orders] }));
    get().showToast('New order added!');
  },

  updateOrderStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status } : o
      ),
    }));
    get().showToast(`Order ${status.toLowerCase()}!`);
  },

  // User Settings
  updateUser: (data) => {
    set((state) => ({ user: { ...state.user, ...data } }));
    get().showToast('Settings saved!');
  },

  openUpgradePopup: (plan, feature = '') => set({ 
    upgradePopupOpen: true, 
    upgradePlanNeeded: plan,
    upgradeFeatureName: feature 
  }),

  closeUpgradePopup: () => set({ upgradePopupOpen: false }),
}));
