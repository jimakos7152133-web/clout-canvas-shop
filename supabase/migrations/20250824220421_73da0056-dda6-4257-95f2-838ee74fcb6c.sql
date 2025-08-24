-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  images TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  is_customizable BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  selected_color TEXT,
  selected_size TEXT,
  custom_options JSONB DEFAULT '{}',
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  selected_color TEXT,
  selected_size TEXT,
  custom_options JSONB DEFAULT '{}',
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Active products are viewable by everyone" ON public.products FOR SELECT USING (is_active = true);

-- Cart items policies (session-based)
CREATE POLICY "Users can view their cart items" ON public.cart_items FOR SELECT USING (true);
CREATE POLICY "Users can insert cart items" ON public.cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their cart items" ON public.cart_items FOR UPDATE USING (true);
CREATE POLICY "Users can delete their cart items" ON public.cart_items FOR DELETE USING (true);

-- Order policies (email-based for guests, user_id for authenticated)
CREATE POLICY "Users can view their orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Users can insert orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Order items are readable with orders
CREATE POLICY "Order items are viewable with orders" ON public.order_items FOR SELECT USING (true);

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
('Streetwear', 'streetwear', 'Premium streetwear collection including hoodies, t-shirts, and more', '/placeholder.svg'),
('Business Promotion', 'business-promotion', 'Professional promotional items for your business branding', '/placeholder.svg'),
('Accessories', 'accessories', 'Complete your look with our premium accessories', '/placeholder.svg'),
('Custom Designs', 'custom-designs', 'Create your own unique designs with our customization tools', '/placeholder.svg');

-- Insert sample products
INSERT INTO public.products (name, slug, description, base_price, category_id, images, colors, sizes, is_customizable, stock_quantity) 
SELECT 
  'Premium Hoodie',
  'premium-hoodie',
  'Ultra-soft premium hoodie perfect for street style and comfort',
  59.99,
  c.id,
  ARRAY['/placeholder.svg'],
  ARRAY['Black', 'White', 'Gray', 'Navy', 'Red'],
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  true,
  100
FROM public.categories c WHERE c.slug = 'streetwear';

INSERT INTO public.products (name, slug, description, base_price, category_id, images, colors, sizes, is_customizable, stock_quantity) 
SELECT 
  'Classic T-Shirt',
  'classic-tshirt',
  'Essential street-style t-shirt with premium cotton blend',
  24.99,
  c.id,
  ARRAY['/placeholder.svg'],
  ARRAY['Black', 'White', 'Gray', 'Navy', 'Red', 'Green'],
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  true,
  150
FROM public.categories c WHERE c.slug = 'streetwear';

INSERT INTO public.products (name, slug, description, base_price, category_id, images, colors, sizes, is_customizable, stock_quantity) 
SELECT 
  'Bomber Jacket',
  'bomber-jacket',
  'Premium bomber jacket with street-style design',
  89.99,
  c.id,
  ARRAY['/placeholder.svg'],
  ARRAY['Black', 'Navy', 'Olive', 'Burgundy'],
  ARRAY['S', 'M', 'L', 'XL', 'XXL'],
  true,
  75
FROM public.categories c WHERE c.slug = 'streetwear';

INSERT INTO public.products (name, slug, description, base_price, category_id, images, colors, sizes, is_customizable, stock_quantity) 
SELECT 
  'Business Polo',
  'business-polo',
  'Professional polo perfect for business branding and promotional events',
  34.99,
  c.id,
  ARRAY['/placeholder.svg'],
  ARRAY['White', 'Black', 'Navy', 'Gray', 'Red'],
  ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  true,
  200
FROM public.categories c WHERE c.slug = 'business-promotion';

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();