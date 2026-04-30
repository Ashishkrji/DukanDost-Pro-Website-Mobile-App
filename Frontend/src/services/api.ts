import axios from 'axios';

// ── Base client ─────────────────────────────────────────────
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach auth token when ready
api.interceptors.request.use(config => {
  const token = localStorage.getItem('dd_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — graceful fallback
api.interceptors.response.use(
  res => res,
  err => {
    const msg = err?.response?.data?.message || err.message || 'Network error';
    console.warn('[API Error]', msg);
    return Promise.reject(err);
  }
);

// ── Customers ───────────────────────────────────────────────
export const getCustomers = (params?: { search?: string; status?: string }) =>
  api.get('/customers', { params }).then(r => r.data);

export const getCustomerById = (id: string) =>
  api.get(`/customers/${id}`).then(r => r.data);

export const createCustomer = (data: any) =>
  api.post('/customers', data).then(r => r.data);

export const updateCustomer = (id: string, data: any) =>
  api.put(`/customers/${id}`, data).then(r => r.data);

export const deleteCustomer = (id: string) =>
  api.delete(`/customers/${id}`).then(r => r.data);

export const getCustomerCreditScore = (id: string) =>
  api.get(`/customers/${id}/credit-score`).then(r => r.data);

export const getCustomerTransactions = (id: string) =>
  api.get(`/customers/${id}/transactions`).then(r => r.data);

export const bulkRemindCustomers = (customerIds: string[]) =>
  api.post('/customers/bulk/remind', { customerIds }).then(r => r.data);

// ── Transactions ────────────────────────────────────────────
export const getTransactions = (params?: { customerId?: string; type?: string; limit?: number }) =>
  api.get('/transactions', { params }).then(r => r.data);

export const createTransaction = (data: any) =>
  api.post('/transactions', data).then(r => r.data);

export const addTransactionNote = (txnId: string, text: string, addedBy?: string) =>
  api.post(`/transactions/${txnId}/notes`, { text, addedBy }).then(r => r.data);

export const updateTransaction = (id: string, data: any) =>
  api.put(`/transactions/${id}`, data).then(r => r.data);

export const deleteTransaction = (id: string) =>
  api.delete(`/transactions/${id}`).then(r => r.data);

// ── Invoices ────────────────────────────────────────────────
export const getInvoices = (params?: { status?: string; search?: string }) =>
  api.get('/invoices', { params }).then(r => r.data);

export const getInvoiceById = (id: string) =>
  api.get(`/invoices/${id}`).then(r => r.data);

export const createInvoice = (data: any) =>
  api.post('/invoices', data).then(r => r.data);

export const updateInvoice = (id: string, data: any) =>
  api.put(`/invoices/${id}`, data).then(r => r.data);

export const deleteInvoice = (id: string) =>
  api.delete(`/invoices/${id}`).then(r => r.data);

export const shareInvoice = (id: string) =>
  api.get(`/invoices/${id}/share`).then(r => r.data);


// ── Products ────────────────────────────────────────────────
export const getProducts = (params?: { category?: string; status?: string; search?: string }) =>
  api.get('/products', { params }).then(r => r.data);

export const getProductCategories = () =>
  api.get('/products/categories').then(r => r.data);

export const getLowStockAlerts = () =>
  api.get('/products/alerts/low-stock').then(r => r.data);

export const createProduct = (data: any) =>
  api.post('/products', data).then(r => r.data);

export const updateProduct = (id: string, data: any) =>
  api.put(`/products/${id}`, data).then(r => r.data);

export const toggleProductVisibility = (id: string) =>
  api.patch(`/products/${id}/visibility`).then(r => r.data);

export const bulkProductAction = (action: string, ids: string[], data?: any) =>
  api.post('/products/bulk', { action, ids, data }).then(r => r.data);

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`).then(r => r.data);

// ── Payments ────────────────────────────────────────────────
export const getPayments = () =>
  api.get('/payments').then(r => r.data);

export const createRazorpayOrder = (data: { amount: number; customerId: string }) =>
  api.post('/payments/create-order', data).then(r => r.data);

export const verifyRazorpayPayment = (data: any) =>
  api.post('/payments/verify', data).then(r => r.data);

// ── Staff ───────────────────────────────────────────────────
export const getStaff = (params?: { status?: string }) =>
  api.get('/staff', { params }).then(r => r.data);

export const createStaff = (data: any) =>
  api.post('/staff', data).then(r => r.data);

export const updateStaff = (id: string, data: any) =>
  api.put(`/staff/${id}`, data).then(r => r.data);

export const markAttendance = (id: string, data: any) =>
  api.post(`/staff/${id}/attendance`, data).then(r => r.data);

export const markSalaryPaid = (id: string, data: any) =>
  api.post(`/staff/${id}/salary`, data).then(r => r.data);

export const deleteStaff = (id: string) =>
  api.delete(`/staff/${id}`).then(r => r.data);

// ── Vouchers ────────────────────────────────────────────────
export const getVouchers = (params?: { status?: string }) =>
  api.get('/vouchers', { params }).then(r => r.data);

export const validateVoucherCode = (code: string) =>
  api.get(`/vouchers/validate/${code}`).then(r => r.data);

export const createVoucher = (data: any) =>
  api.post('/vouchers', data).then(r => r.data);

export const toggleVoucherStatus = (id: string) =>
  api.patch(`/vouchers/${id}/toggle`).then(r => r.data);

export const deleteVoucher = (id: string) =>
  api.delete(`/vouchers/${id}`).then(r => r.data);

// ── Notifications ───────────────────────────────────────────
export const getNotifications = () =>
  api.get('/notifications').then(r => r.data);

export const markNotificationAsRead = (id: string) =>
  api.patch(`/notifications/${id}/read`).then(r => r.data);

// ── Digital Khata / Ledger ──────────────────────────────────
export const getKhataCustomers = (params?: { search?: string; status?: string }) =>
  api.get('/customers/all', { params }).then(r => r.data);

export const createKhataCustomer = (data: any) =>
  api.post('/customers/create', data).then(r => r.data);

export const getLedgerEntries = (params: { customerId?: string; vendorId?: string }) =>
  api.get('/ledger/history', { params }).then(r => r.data);

export const createLedgerEntry = (data: any) =>
  api.post('/ledger/create', data).then(r => r.data);

// ── Vendors ──────────────────────────────────────────────────
export const getVendors = () =>
  api.get('/vendors/all').then(r => r.data);

export const createVendor = (data: any) =>
  api.post('/vendors/create', data).then(r => r.data);

export const updateVendor = (id: string, data: any) =>
  api.put(`/vendors/update/${id}`, data).then(r => r.data);

export const deleteVendor = (id: string) =>
  api.delete(`/vendors/delete/${id}`).then(r => r.data);

// ── Inventory ────────────────────────────────────────────────
export const getInventoryHistory = (productId: string) =>
  api.get(`/inventory/history/${productId}`).then(r => r.data);

export const createInventoryEntry = (data: { 
  productId: string; 
  type: 'PURCHASE' | 'SALE' | 'ADJUSTMENT' | 'RETURN'; 
  quantity: number; 
  price?: number; 
  vendorId?: string; 
  notes?: string;
}) => api.post('/inventory/entry', data).then(r => r.data);

// ── Analytics ────────────────────────────────────────────────
export const getPLStats = (shopId?: string) => 
  api.get('/analytics/pl', { params: { shopId } }).then(r => r.data);
export const getRecoveryStats = (shopId?: string) => 
  api.get('/analytics/recovery', { params: { shopId } }).then(r => r.data);
export const getProfitabilityStats = (shopId?: string) => 
  api.get('/analytics/profitability', { params: { shopId } }).then(r => r.data);
export const getTrends = (days?: number) => 
  api.get('/analytics/trends', { params: { days } }).then(r => r.data);

// ── Shops ────────────────────────────────────────────────────
export const getShops = () =>
  api.get('/shops').then(r => r.data);

export const createShop = (data: any) =>
  api.post('/shops', data).then(r => r.data);

// ── WhatsApp ─────────────────────────────────────────────────
export const sendWhatsAppReminder = (customerId: string) =>
  api.post('/whatsapp/remind', { customerId }).then(r => r.data);

// ── Campaigns ────────────────────────────────────────────────
export const getCampaigns = () => 
  api.get('/campaigns').then(r => r.data);
export const createCampaign = (data: any) => 
  api.post('/campaigns', data).then(r => r.data);
export const sendCampaign = (id: string) => 
  api.post(`/campaigns/${id}/send`).then(r => r.data);

// ── AI Insights ──────────────────────────────────────────────
export const getBusinessHealth = () => 
  api.get('/ai-insights/health-score').then(r => r.data);

export const aiChat = (messages: any[]) =>
  api.post('/ai/chat', { messages }).then(r => r.data);

export const aiExecute = (action: string, params: any) =>
  api.post('/ai/execute', { action, params }).then(r => r.data);

export default api;
