const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // Auth
  register: async (data: { email: string; password: string; firstName?: string; lastName?: string }): Promise<{ user: unknown; token: string }> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  login: async (data: { email: string; password: string }): Promise<{ user: unknown; token: string }> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  getMe: async (token: string): Promise<unknown> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Products
  getProducts: async (params?: { category?: string; search?: string; limit?: number; offset?: number }): Promise<unknown[]> => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`${API_URL}/products${queryString ? '?' + queryString : ''}`);
    return response.json();
  },

  getProductById: async (id: string): Promise<unknown> => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
  },

  createProduct: async (token: string, data: Record<string, unknown>): Promise<unknown> => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateProduct: async (token: string, id: string, data: Record<string, unknown>): Promise<unknown> => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteProduct: async (token: string, id: string): Promise<unknown> => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Categories
  getCategories: async (token?: string): Promise<unknown[]> => {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${API_URL}/categories`, { headers });
    return response.json();
  },

  getCategoryById: async (id: string): Promise<unknown> => {
    const response = await fetch(`${API_URL}/categories/${id}`);
    return response.json();
  },

  createCategory: async (token: string, data: Record<string, unknown>): Promise<unknown> => {
    const response = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateCategory: async (token: string, id: string, data: Record<string, unknown>): Promise<unknown> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteCategory: async (token: string, id: string): Promise<unknown> => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Sewing Styles
  getSewingStyles: async () => {
    const response = await fetch(`${API_URL}/sewing-styles`);
    return response.json();
  },

  getSewingStyleById: async (id: string) => {
    const response = await fetch(`${API_URL}/sewing-styles/${id}`);
    return response.json();
  },

  createSewingStyle: async (token: string, data: Record<string, unknown>) => {
    const response = await fetch(`${API_URL}/sewing-styles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateSewingStyle: async (token: string, id: string, data: Record<string, unknown>) => {
    const response = await fetch(`${API_URL}/sewing-styles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteSewingStyle: async (token: string, id: string) => {
    const response = await fetch(`${API_URL}/sewing-styles/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Orders
  getOrders: async (token: string) => {
    const response = await fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  getOrderById: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  createOrder: async (token: string, items: Record<string, unknown>[], totalAmount: number, shippingAddress: Record<string, unknown>, paymentMethod: string = 'paystack') => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,
        totalAmount,
        shippingAddress,
        paymentMethod,
      }),
    });
    return response.json();
  },

  // Paystack
  initiatePaystackPayment: async (token: string, orderId: string) => {
    const response = await fetch(`${API_URL}/payments/paystack/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ order_id: orderId }),
    });
    return response.json();
  },

  // Users (Admin)
  getUsers: async (token: string) => {
    const response = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  getUserById: async (token: string, id: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  updateUser: async (token: string, id: string, data: Record<string, unknown>) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteUser: async (token: string, id: string) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // File Upload
  uploadFile: async (token: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return response.json();
  },
};
