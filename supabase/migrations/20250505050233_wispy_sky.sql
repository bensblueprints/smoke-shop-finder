/*
  # Create admin schema and default super admin user

  1. Schema Changes
    - Create role and status enums
    - Create user_roles table
    - Create user_features table
    - Create user_status table
    - Enable RLS on all tables
    - Create admin policies
  
  2. Data
    - Create default super admin user
    - Grant all permissions
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');

-- Create enum for user_account_status to avoid conflict
CREATE TYPE user_account_status AS ENUM ('active', 'suspended', 'pending');

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  role user_role DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_features table
CREATE TABLE IF NOT EXISTS user_features (
  user_id uuid REFERENCES auth.users,
  feature text NOT NULL,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, feature)
);

-- Create user_status table
CREATE TABLE IF NOT EXISTS user_status (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  status user_account_status DEFAULT 'pending',
  suspended_reason text,
  suspended_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_status ENABLE ROW LEVEL SECURITY;

-- Create policies for super admins
CREATE POLICY "Super admins can do everything"
  ON user_roles
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage features"
  ON user_features
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage status"
  ON user_status
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the super admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  NULL,
  '',
  now(),
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Super Admin"}',
  true,
  now(),
  now(),
  NULL,
  NULL,
  NULL,
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  false,
  NULL
);

-- Set up role for the super admin
INSERT INTO user_roles (user_id, role)
SELECT id, 'super_admin'::user_role
FROM auth.users
WHERE email = 'admin@example.com';

-- Activate the user
INSERT INTO user_status (user_id, status)
SELECT id, 'active'::user_account_status
FROM auth.users
WHERE email = 'admin@example.com';

-- Grant all features
INSERT INTO user_features (user_id, feature, enabled)
SELECT 
  id,
  feature,
  true
FROM 
  auth.users
CROSS JOIN (
  VALUES 
    ('claim_shops'),
    ('add_shops'),
    ('edit_shops')
) AS features(feature)
WHERE email = 'admin@example.com';