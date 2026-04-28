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

export default api;
