-- Create a storage bucket for site assets (hero videos, images, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read from site-assets bucket
CREATE POLICY "Anyone can view site assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

-- Allow authenticated admins to upload to site-assets bucket
CREATE POLICY "Admins can upload site assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-assets' 
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow authenticated admins to update site-assets
CREATE POLICY "Admins can update site assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-assets' 
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Allow authenticated admins to delete site-assets
CREATE POLICY "Admins can delete site assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-assets' 
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Insert default site settings if not exists
INSERT INTO public.site_settings (key, value)
VALUES 
  ('hero_video_url', '"/web video .mp4"'),
  ('hero_title', '"DOWSLAKERS"'),
  ('hero_subtitle', '"Fashion Experience 2026"'),
  ('craft_section_title', '"Your Vision, Our Craft"'),
  ('craft_section_description', '"We bring your fashion dreams to life with precision tailoring and authentic African craftsmanship."')
ON CONFLICT (key) DO NOTHING;