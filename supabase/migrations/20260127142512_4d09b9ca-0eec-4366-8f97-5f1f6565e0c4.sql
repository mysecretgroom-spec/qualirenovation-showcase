-- Create table for storing renovation simulations/configurations
CREATE TABLE public.renovation_simulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  quote_request_id UUID REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  
  -- Project info
  property_type TEXT,
  surface TEXT,
  construction_period TEXT,
  city TEXT,
  
  -- Conception
  has_architect TEXT,
  modify_layout TEXT,
  
  -- Project types
  project_types TEXT[],
  project_contexts TEXT[],
  has_dpe TEXT,
  
  -- Conditions
  occupy_during_works TEXT,
  constraints TEXT[],
  constraint_details TEXT,
  start_date TEXT,
  start_date_value TEXT,
  end_date_max TEXT,
  
  -- Rooms data (stored as JSONB for flexibility)
  selected_rooms JSONB DEFAULT '[]'::jsonb,
  
  -- Isolation data
  isolation_data JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.renovation_simulations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all simulations"
  ON public.renovation_simulations FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create simulations"
  ON public.renovation_simulations FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update simulations"
  ON public.renovation_simulations FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete simulations"
  ON public.renovation_simulations FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can create a simulation (for the public form)
CREATE POLICY "Anyone can create simulation from form"
  ON public.renovation_simulations FOR INSERT
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_renovation_simulations_updated_at
  BEFORE UPDATE ON public.renovation_simulations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();