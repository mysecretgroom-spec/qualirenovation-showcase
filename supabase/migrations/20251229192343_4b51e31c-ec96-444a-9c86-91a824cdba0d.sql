-- Create storage bucket for assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to assets
CREATE POLICY "Public read access for assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'assets');

-- Allow authenticated users to upload assets
CREATE POLICY "Authenticated users can upload assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to update assets
CREATE POLICY "Authenticated users can update assets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete assets
CREATE POLICY "Authenticated users can delete assets" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'assets' AND auth.role() = 'authenticated');