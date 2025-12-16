-- Add affiliate marketing link fields to brands table
alter table brands
  add column website_url text,
  add column wikipedia_url text,
  add column ebay_url text,
  add column poshmark_url text,
  add column depop_url text;

-- Add comments for documentation
comment on column brands.website_url is 'Official brand website URL';
comment on column brands.wikipedia_url is 'Wikipedia article URL for brand history';
comment on column brands.ebay_url is 'eBay search/store URL for brand items';
comment on column brands.poshmark_url is 'Poshmark search URL for brand items';
comment on column brands.depop_url is 'Depop search URL for brand items';
