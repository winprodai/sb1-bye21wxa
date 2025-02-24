/*
  # Admin System Tables

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `selling_price` (decimal)
      - `product_cost` (decimal)
      - `profit_margin` (decimal)
      - `images` (text array)
      - `stats` (jsonb)
      - `specifications` (jsonb)
      - `is_locked` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `customers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `subscription_status` (text)
      - `subscription_tier` (text)
      - `created_at` (timestamp)
      - `last_login` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  selling_price decimal(10,2) NOT NULL,
  product_cost decimal(10,2) NOT NULL,
  profit_margin decimal(10,2) GENERATED ALWAYS AS (selling_price - product_cost) STORED,
  images text[] DEFAULT ARRAY[]::text[],
  stats jsonb DEFAULT '{}'::jsonb,
  specifications jsonb DEFAULT '{}'::jsonb,
  is_locked boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text,
  subscription_status text DEFAULT 'free',
  subscription_tier text DEFAULT 'basic',
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create admin role
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
    CREATE ROLE admin;
  END IF;
END
$$;

-- Admin policies for products
CREATE POLICY "Admin full access to products"
  ON products
  FOR ALL
  TO admin
  USING (true)
  WITH CHECK (true);

-- Admin policies for customers
CREATE POLICY "Admin full access to customers"
  ON customers
  FOR ALL
  TO admin
  USING (true)
  WITH CHECK (true);

-- Authenticated user policies
CREATE POLICY "Users can view unlocked products"
  ON products
  FOR SELECT
  TO authenticated
  USING (NOT is_locked);

CREATE POLICY "Users can view own customer data"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);