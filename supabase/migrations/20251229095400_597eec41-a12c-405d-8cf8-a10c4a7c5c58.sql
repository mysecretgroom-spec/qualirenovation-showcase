-- Create table for storing all Houzz projects
CREATE TABLE public.houzz_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  houzz_id TEXT UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  category TEXT,
  year TEXT,
  image_count INTEGER DEFAULT 0,
  houzz_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing project images
CREATE TABLE public.houzz_project_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.houzz_projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_order INTEGER DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_houzz_projects_slug ON public.houzz_projects(slug);
CREATE INDEX idx_houzz_project_images_project_id ON public.houzz_project_images(project_id);

-- Enable RLS but allow public read access (this is a portfolio website)
ALTER TABLE public.houzz_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.houzz_project_images ENABLE ROW LEVEL SECURITY;

-- Public can view all projects
CREATE POLICY "Projects are viewable by everyone" 
ON public.houzz_projects 
FOR SELECT 
USING (true);

-- Public can view all project images
CREATE POLICY "Project images are viewable by everyone" 
ON public.houzz_project_images 
FOR SELECT 
USING (true);

-- For admin operations (insert/update/delete), we use service role key in edge functions
-- No user-facing RLS needed for write operations since this is managed by admin only

-- Create table for storing testimonials
CREATE TABLE public.houzz_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  text TEXT NOT NULL,
  date TEXT,
  project_type TEXT,
  has_photos BOOLEAN DEFAULT false,
  photo_urls TEXT[],
  houzz_user_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for testimonials
ALTER TABLE public.houzz_testimonials ENABLE ROW LEVEL SECURITY;

-- Public can view all testimonials
CREATE POLICY "Testimonials are viewable by everyone" 
ON public.houzz_testimonials 
FOR SELECT 
USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_houzz_projects_updated_at
BEFORE UPDATE ON public.houzz_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();