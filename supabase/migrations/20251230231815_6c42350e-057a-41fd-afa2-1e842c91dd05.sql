-- Add address fields to quote_requests table
ALTER TABLE public.quote_requests 
ADD COLUMN address text,
ADD COLUMN latitude double precision,
ADD COLUMN longitude double precision;

-- Update the city column to be nullable since we'll have full address
ALTER TABLE public.quote_requests 
ALTER COLUMN city DROP NOT NULL;