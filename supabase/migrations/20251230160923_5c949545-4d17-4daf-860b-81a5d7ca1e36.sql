-- Drop the existing restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON public.houzz_testimonials;

-- Create a proper PERMISSIVE policy for public read access
CREATE POLICY "Testimonials are viewable by everyone" 
ON public.houzz_testimonials 
FOR SELECT 
TO public
USING (true);