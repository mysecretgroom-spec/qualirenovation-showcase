-- Create client_files table to store file references
CREATE TABLE public.client_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.client_files ENABLE ROW LEVEL SECURITY;

-- RLS policies - only admins can manage files
CREATE POLICY "Admins can view client files"
  ON public.client_files
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can upload client files"
  ON public.client_files
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete client files"
  ON public.client_files
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_client_files_client_id ON public.client_files(client_id);

-- Create storage bucket for client files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('client-files', 'client-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for client files bucket
CREATE POLICY "Admins can view client files storage"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'client-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can upload client files storage"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'client-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete client files storage"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'client-files' AND has_role(auth.uid(), 'admin'::app_role));