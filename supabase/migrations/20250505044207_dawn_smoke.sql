/*
  # Create shops table and import data

  1. New Tables
    - `shops`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `address1` (text)
      - `address2` (text)
      - `city` (text)
      - `state` (text)
      - `zip_code` (text)
      - `country` (text)
      - `website` (text)
      - `phone` (text)
      - `email` (text)
      - `date_added` (timestamptz)
      - `date_updated` (timestamptz)
      - `has_cbd` (boolean)
      - `business_type` (text)
      - `has_marijuana` (boolean)
      - `has_kratom` (boolean)
      - `buyer_name` (text)
      - `title` (text)
      - `claimed` (boolean)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on shops table
    - Add policies for public read access
    - Add policies for authenticated users to claim shops
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
  date_added timestamptz,
  date_updated timestamptz,
  has_cbd boolean DEFAULT false,
  business_type text,
  has_marijuana boolean DEFAULT false,
  has_kratom boolean DEFAULT false,
  buyer_name text,
  title text,
  claimed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', 
      coalesce(name, '') || ' ' || 
      coalesce(city, '') || ' ' || 
      coalesce(state, '') || ' ' || 
      coalesce(zip_code, '')
    )
  ) STORED
);

-- Create index for full text search
CREATE INDEX IF NOT EXISTS shops_search_idx ON shops USING GIN (search_vector);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS shops_business_type_idx ON shops (business_type);
CREATE INDEX IF NOT EXISTS shops_state_idx ON shops (state);
CREATE INDEX IF NOT EXISTS shops_has_cbd_idx ON shops (has_cbd);
CREATE INDEX IF NOT EXISTS shops_city_idx ON shops (city);

-- Enable Row Level Security
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON shops
  FOR SELECT
  TO public
  USING (true);

-- Create policy for authenticated users to claim shops
CREATE POLICY "Allow authenticated users to claim shops"
  ON shops
  FOR UPDATE
  TO authenticated
  USING (claimed = false)
  WITH CHECK (
    claimed = true AND 
    (
      OLD.id = id AND 
      OLD.name = name AND 
      OLD.address1 = address1 AND 
      OLD.city = city AND 
      OLD.state = state
    )
  );