-- Add Wholesaler fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS gst_number TEXT,
ADD COLUMN IF NOT EXISTS address TEXT;

-- UPDATE THE ROLE CONSTRAINT to allow 'wholesaler'
-- First, drop the existing check constraint if it exists (name might vary, but standard is users_role_check)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the new constraint including 'wholesaler'
ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('farmer', 'buyer', 'wholesaler'));

-- Add Bulk Pricing fields to products table
-- We re-purpose 'price_multiple' as the bulk price if needed, 
-- but let's ensure we have a clear minimum quantity field.
ALTER TABLE products
ADD COLUMN IF NOT EXISTS min_bulk_quantity INTEGER;

-- Comment on columns for clarity
COMMENT ON COLUMN products.min_bulk_quantity IS 'Minimum quantity required to unlock price_multiple (bulk price)';
