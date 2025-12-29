-- Create import_queue table for batch processing
CREATE TABLE IF NOT EXISTS public.import_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'project', -- 'project' or 'testimonial'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  title TEXT,
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.import_queue ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for admin functionality (in production, add proper auth)
CREATE POLICY "Allow all operations on import_queue" 
ON public.import_queue 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create index for faster status queries
CREATE INDEX idx_import_queue_status ON public.import_queue(status);
CREATE INDEX idx_import_queue_type ON public.import_queue(type);