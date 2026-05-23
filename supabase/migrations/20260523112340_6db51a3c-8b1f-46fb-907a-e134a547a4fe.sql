-- Remove permissive SELECT policies on storage.objects for public buckets.
-- Public bucket URLs (/storage/v1/object/public/...) bypass RLS via the CDN,
-- so dropping these only blocks API-level listing/enumeration of the bucket
-- contents while public URLs continue to work for the website and emails.

DROP POLICY IF EXISTS "Public read access for assets" ON storage.objects;
DROP POLICY IF EXISTS "Email assets are publicly accessible" ON storage.objects;