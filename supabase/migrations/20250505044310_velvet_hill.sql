/*
  # Create shops table and import initial data
  
  1. New Tables
    - `shops` table with all fields from CSV data
    - Includes search capabilities and proper indexing
  
  2. Security
    - Enable RLS on shops table
    - Add policies for public read access
    - Add policies for authenticated users to claim shops
  
  3. Data
    - Import initial shop data from CSV
*/

-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address1 text,
  address2 text,
  city text,
  state text,
  zip_code text,
  country text DEFAULT 'US',
  website text,
  phone text,
  email text,
  date_added timestamp with time zone,
  date_updated timestamp with time zone,
  has_cbd boolean DEFAULT false,
  business_type text,
  has_marijuana boolean DEFAULT false,
  has_kratom boolean DEFAULT false,
  buyer_name text,
  title text,
  claimed boolean DEFAULT false,
  claimed_by uuid REFERENCES auth.users,
  claimed_at timestamp with time zone,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(city, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(state, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(zip_code, '')), 'C')
  ) STORED
);

-- Create indexes
CREATE INDEX IF NOT EXISTS shops_search_idx ON shops USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS shops_business_type_idx ON shops (business_type);
CREATE INDEX IF NOT EXISTS shops_city_idx ON shops (city);
CREATE INDEX IF NOT EXISTS shops_state_idx ON shops (state);
CREATE INDEX IF NOT EXISTS shops_claimed_idx ON shops (claimed);

-- Enable RLS
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON shops
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to claim unclaimed shops"
  ON shops
  FOR UPDATE
  TO authenticated
  USING (claimed = false)
  WITH CHECK (
    claimed = true AND
    claimed_by = auth.uid() AND
    claimed_at = now()
  );

-- Import shop data
INSERT INTO shops (
  name, address1, address2, city, state, zip_code, country, website, phone, 
  email, date_added, date_updated, has_cbd, business_type, has_marijuana, 
  has_kratom, buyer_name, title
) VALUES 
  ('195 Tobacco Outlet', '4404 AL-195', NULL, 'Jasper', 'AL', '35503', 'US', NULL, '2053841039', NULL, '2019-07-12', NULL, false, 'T', false, false, NULL, NULL),
  ('1st Ave Hookah and Vape Shop', '4101 1st Ave N', NULL, 'Birmingham', 'AL', '35222', 'US', NULL, '2055954148', NULL, '2018-08-06', '2018-12-24', true, 'S', true, false, NULL, NULL),
  ('205 Vape Shop', '3436 Warrior River Rd #110', NULL, 'Bessemer', 'AL', '35023', 'US', NULL, '2054342966', NULL, '2018-06-30', '2019-07-14', false, 'V', false, false, NULL, NULL),
  ('231 Hemp Hut', '5595 S Oates St', NULL, 'Dothan', 'AL', '36301', 'US', 'https://231hemphut.com', '3348030242', 'sales@231hemphut.com', '2020-11-14', NULL, true, 'C', true, false, NULL, NULL);