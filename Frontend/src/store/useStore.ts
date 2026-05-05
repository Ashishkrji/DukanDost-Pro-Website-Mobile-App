import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as api from '../services/api';

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
  loyaltyPoints?: number;
  loyaltyTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export interface Vendor {
  id?: string;
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  totalPurchased: number;
  totalPaid: number;
  balance: number;
  isActive?: boolean;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  category: string;
  sku: string;
  barcode?: string;
  stock: number;
  price: number;
  gstRate?: number;
  status: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
  icon?: string;
  unit?: string;
  trackSerialNumbers?: boolean;
  batches?: Array<{ batchNumber: string; expiryDate?: string; stock: number; mrp?: number }>;
}

export interface Invoice {
  id: string;
  _id?: string;
  invoiceNumber?: string;
  customerName: string;
  customerPhone?: string;
  customer?: string; // fallback
  phone?: string;    // fallback
  date: string;
  createdAt?: string;
  dueDate?: string;
  amount: number;
  total?: number;    // for consistency
  gst?: number;
  status: string;
  items?: Array<{ name: string; qty: number; price: number; total: number; productId?: string }>;
  type: 'INVOICE' | 'QUOTATION' | 'ESTIMATE' | 'PROFORMA' | 'CHALLAN' | 'PURCHASE_ORDER' | 'CREDIT_NOTE' | 'DEBIT_NOTE';
  vendorId?: string;
  vendorName?: string;
}

export interface Transaction {
  id?: string;
  _id?: string;
  createdAt: string;
  date?: string;
  customerId: string;
  customerName: string;
  amount: number;
  type: 'Diya' | 'Liya' | 'DIYA' | 'LIYA';
  note?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  attendance: 'Aaya' | 'Nahi Aaya' | 'Pending';
  salary: number;
  phone: string;
  status: 'Active' | 'On Leave';
  _id?: string;
  initials?: string;
  salaryType?: 'Monthly' | 'Daily' | 'Weekly';
  salaryComponents?: { basic: number; hra: number; allowances: number; deductions: number };
}

export interface Warehouse {
  id: string;
  _id?: string;
  name: string;
  location: string;
  isMain: boolean;
}

export interface PaymentInfo {
  id: string;
  _id?: string;
  date: string;
  customer: string;
  mode: 'UPI' | 'Card' | 'Wallet';
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
}

export interface Voucher {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'flat';
  status: 'Active' | 'Expired' | 'Paused';
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  likes: number;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  amount: number;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
  isRecurring?: boolean;
  recurrence?: { frequency: string; nextGenerationDate: string; status: string };
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
  vendors: Vendor[];
  warehouses: Warehouse[];
  shops: any[];
  currentShopId: string | null;
  analytics: {
    pl: any;
    recovery: any;
    profitability: any[];
    trends: any[];
  };

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
  fetchInvoices: (type?: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchVendors: () => Promise<void>;
  fetchInventoryHistory: (productId: string) => Promise<any[]>;

  // Mutation Actions
  addTransaction: (tx: Partial<Transaction>) => Promise<void>;
  addCustomer: (customer: Partial<Customer>) => Promise<void>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  updateProductStock: (id: string, newStock: number) => Promise<void>;
  addProduct: (product: Partial<Product>) => Promise<void>;
  addStaff: (staff: Partial<Staff>) => Promise<void>;
  updateStaffAttendance: (id: string, attendance: Staff['attendance']) => Promise<void>;
  addInvoice: (invoice: any) => Promise<void>;
  updateInvoiceStatus: (id: string, status: string) => Promise<void>;
  shareInvoice: (id: string) => Promise<any>;
  convertDocument: (id: string, targetType: string) => Promise<void>;
  addVoucher: (voucher: Partial<Voucher>) => Promise<void>;

  toggleVoucherStatus: (id: string) => Promise<void>;
  likePost: (postId: string) => void;
  addOrder: (order: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateUser: (data: Partial<User>) => void;
  openUpgradePopup: (plan: 'Pro' | 'Business', feature?: string) => void;
  closeUpgradePopup: () => void;

  addVendor: (vendor: Partial<Vendor>) => Promise<void>;
  updateVendor: (id: string, data: Partial<Vendor>) => Promise<void>;
  addInventoryEntry: (data: any) => Promise<void>;

  // Warehouse Actions (M6)
  fetchWarehouses: (shopId: string) => Promise<void>;
  addWarehouse: (data: any) => Promise<void>;
  transferStock: (data: any) => Promise<void>;

  // Payroll Actions (M7)
  processSalary: (data: any) => Promise<void>;
  fetchPayrollHistory: (staffId: string) => Promise<any[]>;

  // Report Actions (M10)
  fetchDayBook: (date: string) => Promise<any>;
  fetchItemProfitReport: () => Promise<any[]>;

  fetchAnalytics: () => Promise<void>;
  fetchShops: () => Promise<void>;
  setCurrentShop: (shopId: string | null) => void;
}

// ===========================
// Store Implementation
// ===========================

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: { id: '', name: '', phone: '', email: '', businessName: '', GSTIN: '', address: '', city: '', upiId: '' },
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
      vendors: [],
      warehouses: [],
      shops: [],
      currentShopId: null,
      analytics: {
        pl: { totalSales: 0, totalPurchases: 0, totalExpenses: 0, netProfit: 0, cashIn: 0, cashOut: 0, totalTax: 0 },
        recovery: { totalOutstanding: 0, customerCount: 0, aging: { '0-15 days': 0, '16-30 days': 0, '31-60 days': 0, '60+ days': 0 } },
        profitability: [],
        trends: []
      },

      sidebarOpen: false,
      toastMessage: null,
      toastType: 'success',
      isLoading: false,
      upgradePopupOpen: false,
      upgradePlanNeeded: 'Pro',
      upgradeFeatureName: '',

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
        } catch (err) { console.error('Failed to mark notification'); }
      },

      markAllNotificationsAsRead: async () => {
        const { notifications } = get();
        for (const n of notifications) if (!n.read) await api.markNotificationAsRead(n.id || (n as any)._id);
        set((state) => ({ notifications: state.notifications.map(n => ({ ...n, read: true })) }));
      },

      clearNotifications: () => set({ notifications: [] }),

      fetchNotifications: async () => {
        try {
          const data = await api.getNotifications();
          if (data.success) {
            set({ 
              notifications: data.notifications.map((n: any) => ({
                id: n._id, title: n.title, message: n.message,
                time: new Date(n.createdAt).toLocaleTimeString(),
                type: n.type, read: n.readBy?.includes(get().user.id) || false
              }))
            });
          }
        } catch (err) { console.error('Failed to fetch notifications'); }
      },

      fetchCustomers: async () => {
        try {
          const data = await api.getCustomers();
          if (data.success) set({ customers: data.customers });
        } catch { }
      },

      fetchTransactions: async () => {
        try {
          const data = await api.getTransactions();
          if (data.success) set({ transactions: data.transactions });
        } catch { }
      },

      fetchProducts: async () => {
        try {
          const data = await api.getProducts();
          if (data.success) set({ products: data.products });
        } catch { }
      },

      fetchStaff: async () => {
        try {
          const data = await api.getStaff();
          if (data.success) set({ staff: data.staff });
        } catch { }
      },

      fetchPayments: async () => {
        try {
          const data = await api.getPayments();
          if (data && data.length > 0) set({ payments: data });
        } catch { }
      },

      fetchInvoices: async (type = 'INVOICE') => {
        try {
          const data = await api.getInvoices({ type });
          set({ invoices: data });
        } catch (err) { console.error('Failed to fetch invoices'); }
      },

      addTransaction: async (txData) => {
        try {
          const newTx = await api.createTransaction(txData);
          set((state) => ({ transactions: [newTx, ...state.transactions] }));
          get().showToast(`Transaction added successfully!`);
        } catch (error) { get().showToast(`Failed to save transaction`, 'error'); }
      },

      addCustomer: async (customer) => {
        try {
          const newCustomer = await api.createCustomer(customer);
          set((state) => ({ customers: [newCustomer, ...state.customers] }));
          get().showToast('New customer added!');
        } catch (error) { get().showToast(`Failed to add customer`, 'error'); }
      },

      updateCustomer: async (id, data) => {
        try {
          const updated = await api.updateCustomer(id, data);
          set((state) => ({
            customers: state.customers.map((c) => (c.id === id || c._id === id) ? updated : c),
          }));
        } catch (error) { get().showToast(`Failed to update customer`, 'error'); }
      },

      updateProductStock: async (id, newStock) => {
        try {
          const updated = await api.updateProduct(id, { stock: newStock });
          set((state) => ({ products: state.products.map((p) => (p.id === id || (p as any)._id === id) ? updated : p) }));
          get().showToast('Stock updated!');
        } catch (error) { get().showToast(`Failed to update stock`, 'error'); }
      },

      addProduct: async (product) => {
        try {
          const newProduct = await api.createProduct(product);
          set((state) => ({ products: [newProduct, ...state.products] }));
          get().showToast('Product added!');
        } catch (error) { get().showToast(`Failed to add product`, 'error'); }
      },

      addStaff: async (staffData) => {
        try {
          const newStaff = await api.createStaff(staffData);
          set((state) => ({ staff: [newStaff, ...state.staff] }));
          get().showToast('Staff member added!');
        } catch (error) { get().showToast(`Failed to add staff`, 'error'); }
      },

      updateStaffAttendance: async (id, attendance) => {
        try {
          await api.markAttendance(id, { status: attendance });
          set((state) => ({ staff: state.staff.map((s) => s.id === id ? { ...s, attendance } : s) }));
          get().showToast('Attendance marked!');
        } catch (error) { get().showToast(`Failed to mark attendance`, 'error'); }
      },

      addInvoice: async (invoice) => {
        try {
          const newInvoice = await api.createInvoice(invoice);
          set((state) => ({ invoices: [newInvoice, ...state.invoices] }));
          get().showToast('Created successfully!');
        } catch (error) { get().showToast(`Failed to create`, 'error'); }
      },

      updateInvoiceStatus: async (id, status) => {
        try {
          const updated = await api.updateInvoice(id, { status });
          set((state) => ({ invoices: state.invoices.map((inv) => (inv.id === id || inv._id === id) ? updated : inv) }));
          get().showToast(`Status updated to ${status}`);
        } catch (error) { get().showToast(`Failed to update`, 'error'); }
      },

      shareInvoice: async (id: string) => {
        try { return await api.shareInvoice(id); } catch (error) { get().showToast('Failed to generate share link', 'error'); return null; }
      },

      convertDocument: async (id: string, targetType: string) => {
        try {
          const newDoc = await api.convertDocument(id, targetType);
          set((state) => ({ invoices: [newDoc, ...state.invoices] }));
          get().showToast(`Converted to ${targetType} successfully!`);
        } catch (error) { get().showToast('Conversion failed', 'error'); }
      },

      addVoucher: async (voucher) => {
        try {
          const newVoucher = await api.createVoucher(voucher);
          set((state) => ({ vouchers: [newVoucher, ...state.vouchers] }));
          get().showToast('Voucher created!');
        } catch (error) { get().showToast(`Failed to create voucher`, 'error'); }
      },

      toggleVoucherStatus: async (id) => {
        try {
          const updated = await api.toggleVoucherStatus(id);
          set((state) => ({ vouchers: state.vouchers.map((v) => v.id === id ? updated : v) }));
        } catch (error) { get().showToast(`Failed to toggle status`, 'error'); }
      },

      likePost: (postId) => {
        set((state) => ({ communityPosts: state.communityPosts.map((p) => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p) }));
      },

      addOrder: (order) => {
        const newOrder: Order = {
          id: 'ORD-' + Date.now(),
          customer: order.customer || '',
          phone: order.phone || '',
          amount: order.amount || 0,
          status: 'Pending',
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        get().showToast('New order added!');
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({ orders: state.orders.map((o) => o.id === id ? { ...o, status } : o) }));
        get().showToast(`Order ${status.toLowerCase()}!`);
      },

      updateUser: (data) => {
        set((state) => ({ user: { ...state.user, ...data } }));
        get().showToast('Settings saved!');
      },

      openUpgradePopup: (plan, feature = '') => set({ upgradePopupOpen: true, upgradePlanNeeded: plan, upgradeFeatureName: feature }),
      closeUpgradePopup: () => set({ upgradePopupOpen: false }),

      fetchVendors: async () => {
        try {
          const data = await api.getVendors();
          if (data.success) set({ vendors: data.vendors });
        } catch (err) { console.error('Failed to fetch vendors'); }
      },

      addVendor: async (vendor) => {
        try {
          const data = await api.createVendor(vendor);
          if (data.success) {
            set((state) => ({ vendors: [data.vendor, ...state.vendors] }));
            get().showToast('New vendor added!');
          }
        } catch (error) { get().showToast(`Failed to add vendor`, 'error'); }
      },

      updateVendor: async (id, data) => {
        try {
          const res = await api.updateVendor(id, data);
          if (res.success) set((state) => ({ vendors: state.vendors.map((v) => (v.id === id || v._id === id) ? res.vendor : v) }));
        } catch (error) { get().showToast(`Failed to update vendor`, 'error'); }
      },

      fetchInventoryHistory: async (productId) => {
        try {
          const data = await api.getInventoryHistory(productId);
          return data.success ? data.history : [];
        } catch (err) { console.error('Failed to fetch history'); return []; }
      },

      addInventoryEntry: async (entryData) => {
        try {
          const data = await api.createInventoryEntry(entryData);
          if (data.success) {
            set((state) => ({
              products: state.products.map((p) => 
                (p.id === entryData.productId || (p as any)._id === entryData.productId) ? { ...p, stock: data.currentStock } : p
              )
            }));
            get().showToast('Inventory updated!');
          }
        } catch (error) { get().showToast(`Failed to add inventory entry`, 'error'); }
      },

      fetchShops: async () => {
        try {
          const data = await api.getShops();
          if (data.success) set({ shops: data.shops });
        } catch (err) { console.error('Failed to fetch shops'); }
      },

      setCurrentShop: (shopId) => {
        set({ currentShopId: shopId });
        get().showToast(`Shop switched!`);
      },

      fetchAnalytics: async () => {
        try {
          const shopId = get().currentShopId;
          const [pl, recovery, profitability, trends] = await Promise.all([
            api.getPLStats(shopId),
            api.getRecoveryStats(shopId),
            api.getProfitabilityStats(shopId),
            api.getTrends()
          ]);
          set({ analytics: { pl: pl.stats, recovery, profitability: profitability.profitability, trends: trends.trends } });
        } catch (error: any) { console.error('Failed to fetch analytics:', error); }
      },

      // Warehouse (M6)
      fetchWarehouses: async (shopId) => {
        try {
          const data = await api.getWarehouses(shopId);
          set({ warehouses: data });
        } catch (err) { }
      },
      addWarehouse: async (data) => {
        try {
          const newWh = await api.createWarehouse(data);
          set((state) => ({ warehouses: [...state.warehouses, newWh] }));
          get().showToast('Warehouse added!');
        } catch (err) { }
      },
      transferStock: async (data) => {
        try {
          await api.transferStock(data);
          get().showToast('Stock transferred successfully!');
          get().fetchProducts();
        } catch (err) { }
      },

      // Payroll (M7)
      processSalary: async (data) => {
        try {
          await api.processSalary(data);
          get().showToast('Salary processed successfully!');
        } catch (err) { }
      },
      fetchPayrollHistory: async (staffId) => {
        try {
          return await api.getPayrollHistory(staffId);
        } catch (err) { return []; }
      },

      // Reports (M10)
      fetchDayBook: async (date) => {
        try {
          return await api.getDayBook(date);
        } catch (err) { return { invoices: [], transactions: [], expenses: [] }; }
      },
      fetchItemProfitReport: async () => {
        try {
          return await api.getItemProfitReport();
        } catch (err) { return []; }
      },
    }),
    {
      name: 'dukandost-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        customers: state.customers,
        products: state.products,
        staff: state.staff,
        vendors: state.vendors,
        currentShopId: state.currentShopId,
        analytics: state.analytics
      }),
    }
  )
);
