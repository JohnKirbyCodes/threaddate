/**
 * Utility functions for converting ISO 3166-1 alpha-2 country codes to emoji flags
 * and country names for display purposes.
 */

/**
 * Converts an ISO 3166-1 alpha-2 country code to its corresponding flag emoji.
 *
 * @param countryCode - Two-letter country code (e.g., "US", "GB", "DE")
 * @returns Flag emoji string, or empty string if invalid/null
 *
 * @example
 * getCountryFlagEmoji("US") // Returns "🇺🇸"
 * getCountryFlagEmoji("GB") // Returns "🇬🇧"
 * getCountryFlagEmoji(null) // Returns ""
 */
export function getCountryFlagEmoji(countryCode: string | null | undefined): string {
  if (!countryCode || countryCode.length !== 2) return '';

  // Convert country code to Regional Indicator Symbol codepoints
  // A-Z maps to U+1F1E6 - U+1F1FF (127462 - 127487)
  // Formula: 127397 + charCodeAt(0)
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

/**
 * Converts an ISO 3166-1 alpha-2 country code to its full country name.
 *
 * @param countryCode - Two-letter country code (e.g., "US", "GB", "DE")
 * @returns Full country name, or the code itself if not in the mapping
 *
 * @example
 * getCountryName("US") // Returns "United States"
 * getCountryName("GB") // Returns "United Kingdom"
 * getCountryName("XX") // Returns "XX"
 */
export function getCountryName(countryCode: string | null | undefined): string {
  if (!countryCode) return '';

  const countryNames: Record<string, string> = {
    // North America
    US: 'United States',
    CA: 'Canada',
    MX: 'Mexico',

    // Europe
    GB: 'United Kingdom',
    DE: 'Germany',
    FR: 'France',
    IT: 'Italy',
    ES: 'Spain',
    SE: 'Sweden',
    NO: 'Norway',
    DK: 'Denmark',
    FI: 'Finland',
    NL: 'Netherlands',
    BE: 'Belgium',
    CH: 'Switzerland',
    AT: 'Austria',
    PT: 'Portugal',
    IE: 'Ireland',
    PL: 'Poland',
    CZ: 'Czech Republic',

    // Asia
    JP: 'Japan',
    CN: 'China',
    KR: 'South Korea',
    IN: 'India',
    TH: 'Thailand',
    VN: 'Vietnam',
    ID: 'Indonesia',
    PH: 'Philippines',

    // Oceania
    AU: 'Australia',
    NZ: 'New Zealand',

    // South America
    BR: 'Brazil',
    AR: 'Argentina',
    CL: 'Chile',
    CO: 'Colombia',

    // Africa
    ZA: 'South Africa',
    EG: 'Egypt',

    // Middle East
    IL: 'Israel',
    AE: 'United Arab Emirates',
    TR: 'Turkey',
  };

  const code = countryCode.toUpperCase();
  return countryNames[code] || code;
}
