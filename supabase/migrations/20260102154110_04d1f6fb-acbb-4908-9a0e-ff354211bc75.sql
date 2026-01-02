-- Add RLS policies for admin INSERT, UPDATE, DELETE on press_mentions
-- (SELECT already exists via "Press mentions are viewable by everyone")

CREATE POLICY "Admins can insert press mentions" 
ON public.press_mentions 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update press mentions" 
ON public.press_mentions 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete press mentions" 
ON public.press_mentions 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));