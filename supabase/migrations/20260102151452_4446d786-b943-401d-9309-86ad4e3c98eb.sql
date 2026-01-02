-- Create press_mentions table
CREATE TABLE public.press_mentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date TEXT,
  source TEXT NOT NULL,
  source_url TEXT,
  title TEXT NOT NULL,
  article_url TEXT NOT NULL,
  logo_url TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.press_mentions ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Press mentions are viewable by everyone"
  ON public.press_mentions
  FOR SELECT
  USING (true);

-- Admin write access
CREATE POLICY "Admins can manage press mentions"
  ON public.press_mentions
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Index for ordering
CREATE INDEX idx_press_mentions_order ON public.press_mentions(display_order, created_at DESC);