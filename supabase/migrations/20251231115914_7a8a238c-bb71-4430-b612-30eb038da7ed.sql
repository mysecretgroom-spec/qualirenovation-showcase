-- Create clients table for managing client files
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  project_description TEXT,
  status TEXT NOT NULL DEFAULT 'prospect',
  budget TEXT,
  surface TEXT,
  notes TEXT,
  quote_request_id UUID REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  google_drive_folder_id TEXT,
  google_drive_folder_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admins can view all clients"
ON public.clients
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create clients"
ON public.clients
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update clients"
ON public.clients
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete clients"
ON public.clients
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_clients_quote_request_id ON public.clients(quote_request_id);