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

// --- Submission Tracking ---

/**
 * Track when a user starts a submission flow
 */
export function trackSubmissionStarted(params: {
  flowType: 'identifier' | 'clothing';
  referrer?: string;
}) {
  track('submission_started', {
    flow_type: params.flowType,
    referrer: params.referrer,
  });
}

/**
 * Track when a user completes a step in the submission wizard
 */
export function trackSubmissionStepCompleted(params: {
  flowType: 'identifier' | 'clothing';
  stepNumber: number;
  stepName: string;
}) {
  track('submission_step_completed', {
    flow_type: params.flowType,
    step_number: params.stepNumber,
    step_name: params.stepName,
  });
}

/**
 * Track when an image is successfully uploaded during submission
 */
export function trackSubmissionImageUploaded(params: {
  flowType: 'identifier' | 'clothing';
  imageType: 'clothing' | 'identifier';
}) {
  track('submission_image_uploaded', {
    flow_type: params.flowType,
    image_type: params.imageType,
  });
}

/**
 * Track when a brand is selected during submission
 */
export function trackSubmissionBrandSelected(params: {
  brandSlug: string;
  isNewBrand: boolean;
}) {
  track('submission_brand_selected', {
    brand_slug: params.brandSlug,
    is_new_brand: params.isNewBrand,
  });
}

/**
 * Track when a submission is successfully completed
 */
export function trackSubmissionCompleted(params: {
  flowType: 'identifier' | 'clothing';
  identifierCount: number;
  hasClothingImage: boolean;
}) {
  track('submission_completed', {
    flow_type: params.flowType,
    identifier_count: params.identifierCount,
    has_clothing_image: params.hasClothingImage,
  });
}

/**
 * Track when a user abandons a submission
 */
export function trackSubmissionAbandoned(params: {
  flowType: 'identifier' | 'clothing';
  lastStep: number;
  lastStepName: string;
}) {
  track('submission_abandoned', {
    flow_type: params.flowType,
    last_step: params.lastStep,
    last_step_name: params.lastStepName,
  });
}

// --- Auth Tracking ---

/**
 * Track login attempts and results
 */
export function trackAuthLogin(params: {
  method: 'email' | 'google';
  success: boolean;
  errorType?: string;
  redirectPath?: string;
}) {
  track(params.success ? 'auth_login_success' : 'auth_login_failed', {
    method: params.method,
    error_type: params.errorType,
    redirect_path: params.redirectPath,
  });
}

/**
 * Track signup attempts and results
 */
export function trackAuthSignup(params: {
  method: 'email' | 'google';
  success: boolean;
  errorType?: string;
}) {
  track(params.success ? 'auth_signup_success' : 'auth_signup_failed', {
    method: params.method,
    error_type: params.errorType,
  });
}

/**
 * Track OAuth flow started
 */
export function trackAuthOAuthStarted(params: {
  provider: 'google';
}) {
  track('auth_oauth_started', {
    provider: params.provider,
  });
}

/**
 * Track user logout
 */
export function trackAuthLogout() {
  track('auth_logout', {});
}

// --- Vote Tracking ---

/**
 * Track voting actions on identifiers
 */
export function trackVote(params: {
  tagId: number;
  action: 'cast' | 'removed' | 'changed';
  voteValue?: number;
  previousValue?: number;
  brandSlug?: string;
}) {
  track(`vote_${params.action}`, {
    tag_id: params.tagId,
    vote_value: params.voteValue,
    previous_value: params.previousValue,
    brand_slug: params.brandSlug,
  });
}

/**
 * Track when an unauthenticated user tries to vote
 */
export function trackVoteUnauthenticated(params: {
  tagId: number;
  redirectTriggered: boolean;
}) {
  track('vote_unauthenticated', {
    tag_id: params.tagId,
    redirect_triggered: params.redirectTriggered,
  });
}

// --- Search Tracking ---

/**
 * Track search queries and results
 */
export function trackSearch(params: {
  query: string;
  resultCount: number;
  hasFilters: boolean;
  filters?: Record<string, string>;
}) {
  track('search_results_viewed', {
    query: params.query,
    result_count: params.resultCount,
    has_filters: params.hasFilters,
    filters: params.filters ? JSON.stringify(params.filters) : undefined,
  });
}

/**
 * Track when a search suggestion is selected
 */
export function trackSearchSuggestionSelected(params: {
  query: string;
  selectedBrand: string;
}) {
  track('search_suggestion_selected', {
    query: params.query,
    selected_brand: params.selectedBrand,
  });
}

/**
 * Track when a search result is clicked
 */
export function trackSearchResultClicked(params: {
  resultType: 'tag' | 'brand' | 'clothing';
  position: number;
  query: string;
}) {
  track('search_result_clicked', {
    result_type: params.resultType,
    position: params.position,
    query: params.query,
  });
}

/**
 * Track when a search returns no results
 */
export function trackSearchNoResults(params: {
  query: string;
  filters?: Record<string, string>;
}) {
  track('search_no_results', {
    query: params.query,
    filters: params.filters ? JSON.stringify(params.filters) : undefined,
  });
}

// --- Page View Tracking ---

/**
 * Track tag detail page views
 */
export function trackTagPageView(params: {
  tagId: number;
  brandSlug: string;
  era?: string;
  category: string;
}) {
  track('tag_page_view', {
    tag_id: params.tagId,
    brand_slug: params.brandSlug,
    era: params.era,
    category: params.category,
  });
}

/**
 * Track clothing item page views
 */
export function trackClothingPageView(params: {
  clothingSlug: string;
  brandSlugs: string[];
  era?: string;
}) {
  track('clothing_page_view', {
    clothing_slug: params.clothingSlug,
    brand_slugs: params.brandSlugs.join(','),
    era: params.era,
  });
}

/**
 * Track guide page views
 */
export function trackGuidePageView(params: {
  guideSlug: string;
  brandSlug?: string;
}) {
  track('guide_page_view', {
    guide_slug: params.guideSlug,
    brand_slug: params.brandSlug,
  });
}

/**
 * Track era hub page views
 */
export function trackEraHubPageView(params: {
  era: string;
}) {
  track('era_hub_page_view', {
    era: params.era,
  });
}
