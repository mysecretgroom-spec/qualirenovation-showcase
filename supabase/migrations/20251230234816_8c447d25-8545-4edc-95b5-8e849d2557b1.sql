-- Add postal_code column to quote_requests table
ALTER TABLE public.quote_requests
ADD COLUMN postal_code text;