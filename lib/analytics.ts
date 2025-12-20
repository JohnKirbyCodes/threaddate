import { track } from '@vercel/analytics';

export interface MarketplaceClickParams {
  brand: string;
  marketplace: 'ebay' | 'poshmark' | 'depop' | 'amazon' | 'etsy';
  placement: 'hero' | 'era-contextual' | 'footer' | 'inline' | 'tag_detail';
  eraContext?: string;
  scrollDepth?: number;
}

export interface TimelineInteractionParams {
  brand: string;
  era: string;
  action: 'click' | 'hover';
}

export interface RelatedBrandClickParams {
  fromBrand: string;
  toBrand: string;
  position: number;
}

/**
 * Track when a user clicks a marketplace link
 */
export function trackMarketplaceClick(params: MarketplaceClickParams) {
  track('marketplace_click', {
    brand: params.brand,
    marketplace: params.marketplace,
    placement: params.placement,
    era_context: params.eraContext,
    scroll_depth: params.scrollDepth,
  });
}

/**
 * Track when a user interacts with the brand timeline
 */
export function trackTimelineInteraction(params: TimelineInteractionParams) {
  track('timeline_interaction', {
    brand: params.brand,
    era: params.era,
    action: params.action,
  });
}

/**
 * Track when a user clicks a related brand
 */
export function trackRelatedBrandClick(params: RelatedBrandClickParams) {
  track('related_brand_click', {
    from_brand: params.fromBrand,
    to_brand: params.toBrand,
    position: params.position,
  });
}

/**
 * Track when a user views a brand page
 */
export function trackBrandPageView(params: {
  brand: string;
  hasMarketplaceLinks: boolean;
  identifierCount: number;
  eraCount: number;
}) {
  track('brand_page_view', {
    brand: params.brand,
    has_marketplace_links: params.hasMarketplaceLinks,
    identifier_count: params.identifierCount,
    era_count: params.eraCount,
  });
}

/**
 * Track when era insights are viewed
 */
export function trackEraInsightsView(params: {
  brand: string;
  mostCommonEra: string;
  highestVerifiedEra: string;
}) {
  track('era_insights_view', {
    brand: params.brand,
    most_common_era: params.mostCommonEra,
    highest_verified_era: params.highestVerifiedEra,
  });
}

/**
 * Track interactions on the brand list page
 */
export function trackBrandListInteraction(params: {
  action: 'search' | 'filter' | 'sort' | 'view_change' | 'letter_nav';
  value?: string;
  resultCount?: number;
}) {
  track('brand_list_interaction', {
    action: params.action,
    value: params.value,
    result_count: params.resultCount,
  });
}

/**
 * Track when a user clicks on a brand card
 */
export function trackBrandCardClick(params: {
  brandSlug: string;
  position: number;
  viewMode: 'grid' | 'list';
  filtered: boolean;
}) {
  track('brand_card_click', {
    brand_slug: params.brandSlug,
    position: params.position,
    view_mode: params.viewMode,
    filtered: params.filtered,
  });
}
