-- Add hidden column to testimonials table
ALTER TABLE public.houzz_testimonials 
ADD COLUMN hidden boolean NOT NULL DEFAULT false;

-- Create index for faster filtering
CREATE INDEX idx_houzz_testimonials_hidden ON public.houzz_testimonials(hidden);

-- Add policy for admins to update testimonials
CREATE POLICY "Admins can update testimonials" 
ON public.houzz_testimonials 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));