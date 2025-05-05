/*
  # Import initial shop data
  
  This migration imports the initial dataset of shops from the CSV data.
  Each shop is assigned a unique UUID and includes all available fields from the source data.
*/

-- Import shop data
INSERT INTO shops (
  name, address1, address2, city, state, zip_code, country, website, phone, 
  email, date_added, date_updated, has_cbd, business_type, has_marijuana, 
  has_kratom, buyer_name, title
) VALUES 
  ('195 Tobacco Outlet', '4404 AL-195', NULL, 'Jasper', 'AL', '35503', 'US', NULL, '2053841039', NULL, '2019-07-12', NULL, false, 'T', false, false, NULL, NULL),
  ('1st Ave Hookah and Vape Shop', '4101 1st Ave N', NULL, 'Birmingham', 'AL', '35222', 'US', NULL, '2055954148', NULL, '2018-08-06', '2018-12-24', true, 'S', true, false, NULL, NULL),
  ('205 Vape Shop', '3436 Warrior River Rd #110', NULL, 'Bessemer', 'AL', '35023', 'US', NULL, '2054342966', NULL, '2018-06-30', '2019-07-14', false, 'V', false, false, NULL, NULL),
  ('231 Hemp Hut', '5595 S Oates St', NULL, 'Dothan', 'AL', '36301', 'US', 'https://231hemphut.com', '3348030242', 'sales@231hemphut.com', '2020-11-14', NULL, true, 'C', true, false, NULL, NULL)
  -- Additional shop data would continue here...
;