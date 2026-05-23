
-- Tighten assets bucket: admin-only writes
DROP POLICY IF EXISTS "Authenticated users can upload assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete assets" ON storage.objects;

CREATE POLICY "Admins can upload assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'assets' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'assets' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'assets' AND has_role(auth.uid(), 'admin'::app_role));

-- Tighten email-assets bucket: admin-only writes
DROP POLICY IF EXISTS "Authenticated users can upload email assets" ON storage.objects;

CREATE POLICY "Admins can upload email assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'email-assets' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update email assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'email-assets' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete email assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'email-assets' AND has_role(auth.uid(), 'admin'::app_role));

-- Explicit deny-by-default write policies on user_roles (prevents privilege escalation)
CREATE POLICY "No client inserts on user_roles"
ON public.user_roles FOR INSERT
WITH CHECK (false);

CREATE POLICY "No client updates on user_roles"
ON public.user_roles FOR UPDATE
USING (false);

CREATE POLICY "No client deletes on user_roles"
ON public.user_roles FOR DELETE
USING (false);
