export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  sku: string | null;
  barcode: string | null;
  quantity: number;
  weight: number | null;
  is_active: boolean;
  is_featured: boolean;
  is_new: boolean;
  category_id: string | null;
  brand_id: string | null;
  images: string[];
  specifications: Record<string, string>;
  tags: string[];
  rating_average: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  brand?: Brand;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: number | null;
  quantity: number;
  options: Record<string, string>;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
  variant?: ProductVariant;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product: Product;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  type: 'shipping' | 'billing' | 'both';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string | null;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  coupon_code: string | null;
  shipping_address: Record<string, unknown>;
  billing_address: Record<string, unknown> | null;
  notes: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_image: string | null;
  variant_info: Record<string, string> | null;
  quantity: number;
  price: number;
  total: number;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  images: string[];
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  user?: Profile;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  applies_to: 'all' | 'products' | 'categories';
  applicable_ids: string[];
  valid_from: string;
  valid_until: string | null;
  created_at: string;
  updated_at: string;
}
