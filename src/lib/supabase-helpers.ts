// Type definitions based on custom backend API
export interface Category {
  id: string;
  name: string;
  slug?: string;
  description: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface SewingStyle {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  images: string[];
  sizes: string[];
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  address: string | null;
  role?: 'customer' | 'admin';
  created_at: string;
}

export interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  [key: string]: string | undefined;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  shipping_address: ShippingAddress | null;
  payment_method: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  size: string | null;
  price: number;
}

export interface SewingOrderDetails {
  id: string;
  order_id: string;
  measurements?: Record<string, string | number>;
  size_option?: string;
  special_instructions?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ========== PRODUCTS ==========
export async function fetchCategories(token?: string) {
  try {
    console.log('Fetching categories from:', `${API_URL}/categories`, 'with token:', !!token);
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_URL}/categories`, { headers });
    if (!response.ok) {
      const errText = await response.text();
      console.error('Categories fetch failed:', response.status, errText);
      throw new Error(`Failed to fetch categories (${response.status}): ${errText}`);
    }
    const data = await response.json();
    console.log('Categories fetched:', data);
    return data as Promise<Category[]>;
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    throw error;
  }
}

export async function fetchProducts(categorySlug?: string) {
  const params = new URLSearchParams();
  if (categorySlug) params.append('category', categorySlug);
  
  const response = await fetch(`${API_URL}/products?${params}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json() as Promise<Product[]>;
}

export async function fetchProduct(id: string) {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json() as Promise<Product>;
}

// ========== SEWING STYLES ==========
export async function fetchSewingStyles() {
  const response = await fetch(`${API_URL}/sewing-styles`);
  if (!response.ok) throw new Error('Failed to fetch sewing styles');
  return response.json() as Promise<SewingStyle[]>;
}

// ========== PROFILE ==========
export async function fetchUserProfile(userId: string, token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json() as Promise<Profile>;
}

export async function updateProfile(userId: string, updates: Partial<Profile>, token: string) {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json() as Promise<Profile>;
}

// ========== ORDERS ==========
export async function fetchUserOrders(userId: string, token: string) {
  const response = await fetch(`${API_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json() as Promise<Order[]>;
}

export async function createOrder(items: OrderItem[], totalAmount: number, shippingAddress: ShippingAddress, token: string) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items,
      total_amount: totalAmount,
      shipping_address: shippingAddress,
      payment_method: 'credit_card',
    }),
  });
  if (!response.ok) throw new Error('Failed to create order');
  return response.json() as Promise<Order>;
}

export async function createOrderItems(items: OrderItem[], token: string) {
  const response = await fetch(`${API_URL}/order-items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(items),
  });
  if (!response.ok) throw new Error('Failed to create order items');
  return response.json();
}

// ========== SEWING ORDER DETAILS ==========
export async function createSewingOrderDetails(details: {
  order_id: string;
  measurements?: Record<string, string | number>;
  size_option?: string;
  special_instructions?: string;
}, token: string) {
  const response = await fetch(`${API_URL}/sewing-order-details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(details),
  });
  
  if (!response.ok) throw new Error('Failed to create sewing order details');
  return response.json() as Promise<SewingOrderDetails>;
}

// ========== NEWSLETTER ==========
export async function subscribeToNewsletter(email: string) {
  const response = await fetch(`${API_URL}/subscribers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    if (error.code === '23505' || error.message?.includes('duplicate')) {
      throw new Error('You are already subscribed!');
    }
    throw new Error(error.error || 'Failed to subscribe');
  }
}

// ========== FILE UPLOAD ==========
export async function uploadProductImage(file: File, token: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading to:', `${API_URL}/upload`);
    console.log('Token present:', !!token);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log('Upload response status:', response.status);

    if (!response.ok) {
      let errorMsg = 'Upload failed';
      try {
        const error = await response.json();
        errorMsg = error.error || error.message || `HTTP ${response.status}`;
      } catch (e) {
        const text = await response.text();
        errorMsg = text || `HTTP ${response.status}`;
      }
      
      if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication failed: ${errorMsg}. Please log in again.`);
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const fileUrl = data.file?.url || data.url;
    if (!fileUrl) {
      throw new Error('No file URL returned from server');
    }
    return `http://localhost:5000${fileUrl}`; // Return full URL
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to upload image';
    console.error('uploadProductImage error:', errorMsg);
    throw new Error(errorMsg);
  }
}

// ========== STATUS HELPERS ==========
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'status-pending',
  processing: 'status-processing',
  shipped: 'status-shipped',
  delivered: 'status-delivered',
  cancelled: 'status-cancelled',
};

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}
