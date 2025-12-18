-- Add country_code column to brands table
-- ISO 3166-1 alpha-2 country code (e.g., US, GB, DE, FR, IT, JP)
alter table brands add column country_code text;

-- Add comment explaining the purpose
comment on column brands.country_code is 'ISO 3166-1 alpha-2 country code representing where the brand/company originates from (not where products are made)';

-- Add constraint to ensure valid format (2 uppercase letters)
alter table brands add constraint country_code_format
  check (country_code is null or country_code ~ '^[A-Z]{2}$');
