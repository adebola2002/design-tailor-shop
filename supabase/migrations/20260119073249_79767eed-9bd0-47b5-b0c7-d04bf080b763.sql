-- Create wishlists table for saving favorite products
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint to prevent duplicate wishlist items
ALTER TABLE public.wishlists ADD CONSTRAINT unique_user_product UNIQUE (user_id, product_id);

-- Enable Row Level Security
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own wishlist"
ON public.wishlists
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist"
ON public.wishlists
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist"
ON public.wishlists
FOR DELETE
USING (auth.uid() = user_id);

-- Create site_settings table for hero video and other settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies for site_settings
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));

-- Insert default hero video setting
INSERT INTO public.site_settings (key, value)
VALUES ('hero_video', '{"url": "https://videos.pexels.com/video-files/6699108/6699108-uhd_2560_1440_25fps.mp4"}');