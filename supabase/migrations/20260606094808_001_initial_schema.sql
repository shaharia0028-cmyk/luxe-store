-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brands table
CREATE TABLE public.brands (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price DECIMAL(12,2) NOT NULL,
  compare_at_price DECIMAL(12,2),
  cost_price DECIMAL(12,2),
  sku TEXT UNIQUE,
  barcode TEXT,
  quantity INTEGER DEFAULT 0,
  weight DECIMAL(8,2),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product variants (size, color, etc.)
CREATE TABLE public.product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  price DECIMAL(12,2),
  quantity INTEGER DEFAULT 0,
  options JSONB DEFAULT '{}',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart table
CREATE TABLE public.cart (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_id)
);

-- Wishlist table
CREATE TABLE public.wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Addresses table
CREATE TABLE public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'United States',
  is_default BOOLEAN DEFAULT false,
  type TEXT DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing', 'both')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  subtotal DECIMAL(12,2) NOT NULL,
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  coupon_code TEXT,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  notes TEXT,
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  variant_info JSONB,
  quantity INTEGER NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Coupons table
CREATE TABLE public.coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(12,2) NOT NULL,
  min_order_amount DECIMAL(12,2) DEFAULT 0,
  max_discount_amount DECIMAL(12,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  applies_to TEXT DEFAULT 'all' CHECK (applies_to IN ('all', 'products', 'categories')),
  applicable_ids UUID[] DEFAULT '{}',
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table
CREATE TABLE public.settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- RLS Policies for categories (public read)
CREATE POLICY "categories_select" ON public.categories FOR SELECT
  TO public USING (true);
CREATE POLICY "categories_all_admin" ON public.categories FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for brands (public read)
CREATE POLICY "brands_select" ON public.brands FOR SELECT
  TO public USING (true);
CREATE POLICY "brands_all_admin" ON public.brands FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for products (public read active)
CREATE POLICY "products_select" ON public.products FOR SELECT
  TO public USING (is_active = true);
CREATE POLICY "products_all_admin" ON public.products FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for product_variants
CREATE POLICY "variants_select" ON public.product_variants FOR SELECT
  TO public USING (true);
CREATE POLICY "variants_all_admin" ON public.product_variants FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for cart
CREATE POLICY "cart_select_own" ON public.cart FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "cart_insert_own" ON public.cart FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_update_own" ON public.cart FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cart_delete_own" ON public.cart FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for wishlist
CREATE POLICY "wishlist_select_own" ON public.wishlist FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wishlist_insert_own" ON public.wishlist FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlist_delete_own" ON public.wishlist FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for addresses
CREATE POLICY "addresses_select_own" ON public.addresses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "addresses_insert_own" ON public.addresses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_update_own" ON public.addresses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_delete_own" ON public.addresses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_admin_all" ON public.orders FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for order_items
CREATE POLICY "order_items_select_own" ON public.order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND user_id = auth.uid())
  );
CREATE POLICY "order_items_admin_all" ON public.order_items FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for reviews
CREATE POLICY "reviews_select" ON public.reviews FOR SELECT
  TO public USING (is_approved = true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "reviews_admin_all" ON public.reviews FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for coupons
CREATE POLICY "coupons_select" ON public.coupons FOR SELECT
  TO public USING (is_active = true);
CREATE POLICY "coupons_admin_all" ON public.coupons FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for settings
CREATE POLICY "settings_select" ON public.settings FOR SELECT
  TO public USING (true);
CREATE POLICY "settings_admin_all" ON public.settings FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create indexes for performance
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_brand ON public.products(brand_id);
CREATE INDEX idx_products_active ON public.products(is_active);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_new ON public.products(is_new) WHERE is_new = true;
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_brands_slug ON public.brands(slug);
CREATE INDEX idx_cart_user ON public.cart(user_id);
CREATE INDEX idx_wishlist_user ON public.wishlist(user_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_reviews_product ON public.reviews(product_id);
CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);

-- Insert default categories
INSERT INTO public.categories (name, slug, description, image_url, is_featured, sort_order) VALUES
('Electronics', 'electronics', 'Latest gadgets, smartphones, and electronics', 'https://images.pexels.com/photos/3786850/pexels-photo-3786850.jpeg?w=800', true, 1),
('Fashion', 'fashion', 'Trendy clothing and accessories', 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?w=800', true, 2),
('Home & Living', 'home-living', 'Furniture, decor, and home essentials', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=800', true, 3),
('Sports', 'sports', 'Sports equipment and activewear', 'https://images.pexels.com/photos/3621103/pexels-photo-3621103.jpeg?w=800', true, 4),
('Beauty', 'beauty', 'Skincare, makeup, and beauty products', 'https://images.pexels.com/photos/2253820/pexels-photo-2253820.jpeg?w=800', true, 5),
('Books', 'books', 'Bestsellers and literary classics', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=800', true, 6);

-- Insert default brands
INSERT INTO public.brands (name, slug, description, is_featured) VALUES
('TechPro', 'techpro', 'Premium electronics and technology', true),
('StyleCraft', 'stylecraft', 'Contemporary fashion and apparel', true),
('HomeEssentials', 'homeessentials', 'Quality home products', true),
('SportMax', 'sportmax', 'Professional sports equipment', true),
('GlowBeauty', 'glowbeauty', 'Natural beauty products', true),
('LuxeTime', 'luxetime', 'Premium watches and accessories', true);

-- Insert sample products
INSERT INTO public.products (name, slug, description, short_description, price, compare_at_price, sku, quantity, is_featured, is_new, category_id, brand_id, images, rating_average, rating_count) VALUES
('ProMax Ultra Smartphone', 'promax-ultra-smartphone', 'Experience the future of smartphones with our ProMax Ultra. Featuring a stunning 6.7" AMOLED display, 108MP quad camera system, and all-day battery life. Powered by the latest A18 Bionic chip for unprecedented performance.', 'Ultimate flagship smartphone experience', 1199.99, 1299.99, 'TECH-001', 150, true, true, (SELECT id FROM public.categories WHERE slug = 'electronics'), (SELECT id FROM public.brands WHERE slug = 'techpro'), ARRAY['https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?w=800', 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?w=800'], 4.8, 245),
('Designer Leather Jacket', 'designer-leather-jacket', 'Handcrafted from premium Italian leather, this jacket combines timeless style with modern functionality. Features a sleek slim-fit design, quilted lining, and premium hardware.', 'Premium Italian leather jacket', 349.99, 449.99, 'STYLE-001', 45, true, false, (SELECT id FROM public.categories WHERE slug = 'fashion'), (SELECT id FROM public.brands WHERE slug = 'stylecraft'), ARRAY['https://images.pexels.com/photos/1124463/pexels-photo-1124463.jpeg?w=800', 'https://images.pexels.com/photos/1040922/pexels-photo-1040922.jpeg?w=800'], 4.6, 89),
('Smart Home Hub Pro', 'smart-home-hub-pro', 'Control your entire home with voice commands. Compatible with over 10,000 smart devices. Features premium sound quality, 360° speakers, and advanced AI assistant.', 'Central smart home control', 249.99, 299.99, 'HOME-001', 200, true, true, (SELECT id FROM public.categories WHERE slug = 'home-living'), (SELECT id FROM public.brands WHERE slug = 'homeessentials'), ARRAY['https://images.pexels.com/photos/38544/amp-amplifier-audio-38544.jpeg?w=800'], 4.7, 156),
('Elite Running Shoes', 'elite-running-shoes', 'Engineered for serious runners. Features responsive cushioning, breathable mesh upper, and carbon fiber plate for maximum energy return. Crush your personal records.', 'Professional running shoes', 189.99, 229.99, 'SPORT-001', 120, true, true, (SELECT id FROM public.categories WHERE slug = 'sports'), (SELECT id FROM public.brands WHERE slug = 'sportmax'), ARRAY['https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?w=800', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?w=800'], 4.9, 312),
('Premium Skincare Set', 'premium-skincare-set', 'Transform your skin with this complete skincare routine. Includes cleanser, toner, serum, moisturizer, and eye cream. Formulated with natural ingredients and advanced peptides.', 'Complete skincare routine', 129.99, 179.99, 'BEAUTY-001', 85, true, true, (SELECT id FROM public.categories WHERE slug = 'beauty'), (SELECT id FROM public.brands WHERE slug = 'glowbeauty'), ARRAY['https://images.pexels.com/photos/3685534/pexels-photo-3685534.jpeg?w=800'], 4.5, 178),
('Classic Chronograph Watch', 'classic-chronograph-watch', 'Swiss-made automatic chronograph featuring scratch-resistant sapphire crystal, genuine leather strap, and 100m water resistance. A timeless piece for the modern gentleman.', 'Swiss-made automatic watch', 599.99, 799.99, 'LUXE-001', 30, true, false, (SELECT id FROM public.categories WHERE slug = 'fashion'), (SELECT id FROM public.brands WHERE slug = 'luxetime'), ARRAY['https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?w=800', 'https://images.pexels.com/photos/169189/pexels-photo-169189.jpeg?w=800'], 4.9, 67),
('Wireless Noise-Canceling Headphones', 'wireless-nc-headphones', 'Immerse yourself in pure audio bliss. Industry-leading noise cancellation, 40-hour battery life, and premium comfort for extended listening sessions.', 'Premium wireless headphones', 349.99, 399.99, 'TECH-002', 180, true, true, (SELECT id FROM public.categories WHERE slug = 'electronics'), (SELECT id FROM public.brands WHERE slug = 'techpro'), ARRAY['https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?w=800', 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?w=800'], 4.8, 203),
('Modern Minimalist Desk', 'modern-minimalist-desk', 'Solid oak construction with sleek steel legs. Cable management system, adjustable height, and spacious work surface. Perfect for the modern home office.', 'Contemporary office desk', 449.99, 549.99, 'HOME-002', 25, false, true, (SELECT id FROM public.categories WHERE slug = 'home-living'), (SELECT id FROM public.brands WHERE slug = 'homeessentials'), ARRAY['https://images.pexels.com/photos/6582992/pexels-photo-6582992.jpeg?w=800', 'https://images.pexels.com/photos/6582995/pexels-photo-6582995.jpeg?w=800'], 4.7, 45),
('Yoga Pro Mat', 'yoga-pro-mat', 'Professional-grade yoga mat with superior grip, cushioning, and durability. Eco-friendly materials, machine washable, and includes carrying strap.', 'Professional yoga mat', 79.99, 99.99, 'SPORT-002', 300, false, true, (SELECT id FROM public.categories WHERE slug = 'sports'), (SELECT id FROM public.brands WHERE slug = 'sportmax'), ARRAY['https://images.pexels.com/photos/3822150/pexels-photo-3822150.jpeg?w=800'], 4.6, 234),
('Organic Anti-Aging Serum', 'organic-anti-aging-serum', 'Powerful anti-aging formula with retinol, vitamin C, and hyaluronic acid. Clinically proven to reduce fine lines and improve skin texture.', 'Advanced anti-aging treatment', 89.99, 119.99, 'BEAUTY-002', 150, false, true, (SELECT id FROM public.categories WHERE slug = 'beauty'), (SELECT id FROM public.brands WHERE slug = 'glowbeauty'), ARRAY['https://images.pexels.com/photos/3685284/pexels-photo-3685284.jpeg?w=800'], 4.4, 167),
('Bestselling Novel Collection', 'bestselling-novel-collection', 'A curated collection of 5 bestselling novels. Includes contemporary fiction and timeless classics. Beautifully bound hardcover editions.', 'Curated book collection', 59.99, 79.99, 'BOOK-001', 75, false, false, (SELECT id FROM public.categories WHERE slug = 'books'), (SELECT id FROM public.brands WHERE slug = 'homeessentials'), ARRAY['https://images.pexels.com/photos/2908984/pexels-photo-2908984.jpeg?w=800'], 4.8, 98),
('Professional Camera Kit', 'professional-camera-kit', 'Full-frame mirrorless camera with 45MP sensor, 8K video, and advanced autofocus system. Includes versatile 24-70mm lens and accessories.', 'Professional photography kit', 2799.99, 3199.99, 'TECH-003', 15, true, false, (SELECT id FROM public.categories WHERE slug = 'electronics'), (SELECT id FROM public.brands WHERE slug = 'techpro'), ARRAY['https://images.pexels.com/photos/2441455/pexels-photo-2441455.jpeg?w=800', 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?w=800'], 4.9, 34);

-- Insert a test admin user profile (will be linked on signup)
-- Insert settings
INSERT INTO public.settings (key, value) VALUES
('site_name', '"LUXE Store"'),
('site_tagline', '"Premium Shopping Experience"'),
('free_shipping_threshold', '99'),
('currency', '"USD"'),
('tax_rate', '0.08');
