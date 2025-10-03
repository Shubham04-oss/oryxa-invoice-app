import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('oryxa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('oryxa_token');
      localStorage.removeItem('oryxa_user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH SERVICES
// ============================================

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('oryxa_token', response.data.token);
      localStorage.setItem('oryxa_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('oryxa_token');
    localStorage.removeItem('oryxa_user');
    window.location.href = '/login';
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('oryxa_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('oryxa_token');
  },
};

// ============================================
// INVOICE SERVICES
// ============================================

export const invoiceService = {
  // List invoices with filters
  list: async (params = {}) => {
    const response = await api.get('/invoices', { params });
    return response.data;
  },

  // Get test invoices (no auth)
  listTest: async () => {
    const response = await api.get('/test/invoices');
    return response.data;
  },

  // Get single invoice
  get: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  // Create invoice
  create: async (data) => {
    const response = await api.post('/invoices', data);
    return response.data;
  },

  // Update invoice
  update: async (id, data) => {
    const response = await api.patch(`/invoices/${id}`, data);
    return response.data;
  },

  // Delete invoice
  delete: async (id) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },

  // Send invoice
  send: async (id, data) => {
    const response = await api.post(`/invoices/${id}/send`, data);
    return response.data;
  },

  // Generate PDF
  generatePDF: async (id) => {
    const response = await api.post(`/invoices/${id}/generate-pdf`);
    return response.data;
  },
};

// ============================================
// AUTOMATION SERVICES
// ============================================

export const automationService = {
  // List automations
  list: async () => {
    const response = await api.get('/automations');
    return response.data;
  },

  // Trigger automation
  simulate: async (data) => {
    const response = await api.post('/automations/simulate', data);
    return response.data;
  },
};

// ============================================
// STORAGE SERVICES
// ============================================

export const storageService = {
  // Upload file
  upload: async (file, folder = 'invoices') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const response = await api.post('/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const formatCurrency = (amount = 0, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount ?? 0);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusBadgeClass = (status) => {
  const base = 'badge ';
  const classes = {
    draft: `${base}badge-draft`,
    sent: `${base}badge-sent`,
    paid: `${base}badge-paid`,
    overdue: `${base}badge-overdue`,
    cancelled: `${base}badge-cancelled`,
  };
  return classes[status] || classes.draft;
};

export default api;
