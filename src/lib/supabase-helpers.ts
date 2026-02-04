import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

// Type definitions based on Supabase schema
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number | null;
  created_at: string;
}

export interface SewingStyle {
  id: string;
  name: string;
  description: string | null;
  images: string[] | null;
  base_price: number | null;
  category_id: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  images: string[] | null;
  sizes: string[] | null;
  stock_quantity: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  phone_number: string | null;
  delivery_address: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  size: string | null;
  price: number;
  created_at: string;
  product?: Product;
}

export interface SewingOrderDetail {
  id: string;
  order_id: string;
  sewing_style_id: string | null;
  measurements: Json | null;
  size_option: string | null;
  special_instructions: string | null;
  created_at: string;
  sewing_style?: SewingStyle;
}

export interface Order {
  id: string;
  user_id: string;
  order_type: string;
  status: string;
  total_amount: number | null;
  notes: string | null;
  delivery_method: string | null;
  delivery_address: string | null;
  delivery_contact: string | null;
  delivery_days: number | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  sewing_order_details?: SewingOrderDetail[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
}

// ========== ERROR EXTRACTION HELPER ==========
export function extractErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  
  // Handle Supabase PostgrestError
  if (typeof error === 'object') {
    const err = error as Record<string, unknown>;
    if (err.message) return String(err.message);
    if (err.error) return String(err.error);
    if (err.details) return String(err.details);
    if (err.hint) return String(err.hint);
    if (err.code) return `Database error: ${err.code}`;
  }
  
  return 'An unexpected error occurred';
}

// ========== CATEGORIES ==========
export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(extractErrorMessage(error));
  }

  return data || [];
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching category:', error);
    throw new Error(extractErrorMessage(error));
  }

  return data;
}

// ========== PRODUCTS ==========
export async function fetchProducts(categorySlug?: string): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (categorySlug) {
    // First get the category ID
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();

    if (category) {
      query = query.eq('category_id', category.id);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    throw new Error(extractErrorMessage(error));
  }

  return (data || []) as unknown as Product[];
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    throw new Error(extractErrorMessage(error));
  }

  return data as unknown as Product | null;
}

// ========== SEWING STYLES ==========
export async function fetchSewingStyles(): Promise<SewingStyle[]> {
  const { data, error } = await supabase
    .from('sewing_styles')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sewing styles:', error);
    throw new Error(extractErrorMessage(error));
  }

  return (data || []) as unknown as SewingStyle[];
}

// ========== PROFILE ==========
export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    throw new Error(extractErrorMessage(error));
  }

  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating profile:', error);
    throw new Error(extractErrorMessage(error));
  }

  return data;
}

// ========== ORDERS ==========
export async function fetchUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*, product:products(*)),
      sewing_order_details(*, sewing_style:sewing_styles(*))
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    throw new Error(extractErrorMessage(error));
  }

  return (data || []) as unknown as Order[];
}

export async function createOrder(orderData: {
  user_id: string;
  order_type: string;
  total_amount?: number;
  notes?: string;
  delivery_method?: string;
  delivery_address?: string;
  delivery_contact?: string;
}): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw new Error(extractErrorMessage(error));
  }

  return data as Order;
}

export async function createOrderItems(items: {
  order_id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  price: number;
}[]): Promise<void> {
  const { error } = await supabase
    .from('order_items')
    .insert(items);

  if (error) {
    console.error('Error creating order items:', error);
    throw new Error(extractErrorMessage(error));
  }
}

// ========== SEWING ORDER DETAILS ==========
export async function createSewingOrderDetails(details: {
  order_id: string;
  sewing_style_id?: string;
  measurements?: Record<string, unknown>;
  size_option?: string;
  special_instructions?: string;
}): Promise<SewingOrderDetail> {
  const insertData = {
    order_id: details.order_id,
    sewing_style_id: details.sewing_style_id || null,
    measurements: (details.measurements as Json) || null,
    size_option: details.size_option || null,
    special_instructions: details.special_instructions || null,
  };

  const { data, error } = await supabase
    .from('sewing_order_details')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating sewing order details:', error);
    throw new Error(extractErrorMessage(error));
  }

  return data as unknown as SewingOrderDetail;
}

// ========== NEWSLETTER ==========
export async function subscribeToNewsletter(email: string): Promise<void> {
  const { error } = await supabase
    .from('subscribers')
    .insert({ email });

  if (error) {
    if (error.code === '23505') {
      throw new Error('You are already subscribed!');
    }
    console.error('Error subscribing:', error);
    throw new Error(extractErrorMessage(error));
  }
}

// ========== FILE UPLOAD ==========
export async function uploadProductImage(file: File, folder: string = 'products'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading file:', error);
    throw new Error(extractErrorMessage(error));
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function uploadSiteAsset(file: File, folder: string = 'hero'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('site-assets')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading site asset:', error);
    throw new Error(extractErrorMessage(error));
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('site-assets')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// ========== SITE SETTINGS ==========
export async function getSiteSetting(key: string): Promise<Json | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (error) {
    console.error('Error fetching site setting:', error);
    return null;
  }

  return data?.value ?? null;
}

export async function getAllSiteSettings(): Promise<Record<string, Json>> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }

  const settings: Record<string, Json> = {};
  data?.forEach(row => {
    settings[row.key] = row.value;
  });

  return settings;
}

export async function updateSiteSetting(key: string, value: Json): Promise<void> {
  // First check if the setting exists
  const { data: existing } = await supabase
    .from('site_settings')
    .select('id')
    .eq('key', key)
    .maybeSingle();

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from('site_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);

    if (error) {
      console.error('Error updating site setting:', error);
      throw new Error(extractErrorMessage(error));
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from('site_settings')
      .insert({ key, value });

    if (error) {
      console.error('Error inserting site setting:', error);
      throw new Error(extractErrorMessage(error));
    }
  }
}

// ========== STATUS HELPERS ==========
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  processing: 'Processing',
  in_progress: 'In Progress',
  ready: 'Ready',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  in_progress: 'bg-purple-100 text-purple-800 border-purple-200',
  ready: 'bg-green-100 text-green-800 border-green-200',
  shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}