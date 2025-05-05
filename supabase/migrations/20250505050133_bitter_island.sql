/*
  # Create default super admin user
  
  1. New Data
    - Creates a default super admin user
    - Sets up necessary role and permissions
  
  2. Security
    - Password is hashed
    - User is pre-verified
*/

-- Create the super admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
)
VALUES (
  gen_random_uuid(),
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Super Admin"}',
  true
);

-- Set up role for the super admin
INSERT INTO user_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'admin@example.com';

-- Activate the user
INSERT INTO user_status (user_id, status)
SELECT id, 'active'
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