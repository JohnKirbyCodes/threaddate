/**
 * Affiliate tracking parameters for marketplace links
 */

// eBay Partner Network tracking params
export const EBAY_AFFILIATE_PARAMS = "&mkcid=1&mkrid=711-53200-19255-0&toolid=20023&campid=5339135007&siteid=0&mkevt=1";

/**
 * Add eBay affiliate tracking to a URL
 */
export function addEbayAffiliateTracking(url: string): string {
  if (!url.includes("ebay.com")) return url;
  if (url.includes("campid=")) return url; // Already has tracking
  return url + EBAY_AFFILIATE_PARAMS;
}

/**
 * Build an eBay search URL with affiliate tracking
 */
export function buildEbaySearchUrl(query: string, options?: { category?: number }): string {
  const category = options?.category ?? 11450; // Default: clothing category
  const encodedQuery = encodeURIComponent(query);
  return `https://www.ebay.com/sch/i.html?_nkw=${encodedQuery}&_sacat=${category}${EBAY_AFFILIATE_PARAMS}`;
}
