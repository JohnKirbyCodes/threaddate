/**
 * Pillar guide content for top brands.
 * These comprehensive guides help users date vintage clothing
 * and serve as authoritative content for SEO/LLM discoverability.
 */

export interface EraGuideSection {
  era: string;
  yearRange: string;
  tagCharacteristics: string[];
  manufacturingLocations: string[];
  keyFeatures: string[];
  tips: string[];
}

export interface BrandGuide {
  slug: string;
  brandName: string;
  brandSlug: string;
  title: string;
  description: string;
  intro: string;
  quickFacts: {
    founded: string;
    headquarters: string;
    knownFor: string;
  };
  eraSections: EraGuideSection[];
  authenticationTips: string[];
  commonFakes: string[];
  valuableEras: string[];
}

export const BRAND_GUIDES: Record<string, BrandGuide> = {
  "how-to-date-vintage-levis": {
    slug: "how-to-date-vintage-levis",
    brandName: "Levi's",
    brandSlug: "levis",
    title: "How to Date Vintage Levi's Clothing",
    description: "Complete guide to dating vintage Levi's jeans, jackets, and shirts by their tags, buttons, and construction details.",
    intro: "Levi Strauss & Co. has been making clothing since 1853, and their tags, buttons, and construction have changed significantly over the decades. This guide will help you identify the era of your vintage Levi's pieces.",
    quickFacts: {
      founded: "1853 in San Francisco",
      headquarters: "San Francisco, California",
      knownFor: "501 jeans, trucker jackets, denim workwear",
    },
    eraSections: [
      {
        era: "1950s",
        yearRange: "1950-1959",
        tagCharacteristics: [
          "Small 'e' in Levi's (lowercase)",
          "Paper patch with leather-look print",
          "Single-needle stitching on pockets",
        ],
        manufacturingLocations: ["USA"],
        keyFeatures: [
          "Hidden rivets (concealed copper rivets)",
          "Big E on red tab (capital E)",
          "Selvedge denim",
        ],
        tips: [
          "Look for 'XX' on the paper patch indicating 501 model",
          "Single-stitch backtabs are earlier than double-stitch",
        ],
      },
      {
        era: "1960s",
        yearRange: "1960-1969",
        tagCharacteristics: [
          "Big E red tab (capital E in LEVI'S)",
          "Paper patch transitions to two-horse design",
          "Care tags begin appearing late 1960s",
        ],
        manufacturingLocations: ["USA"],
        keyFeatures: [
          "Transition from Big E to small e (1971)",
          "Hidden rivets until 1966",
          "Exposed rivets after 1966",
        ],
        tips: [
          "Big E tabs command premium prices",
          "1966-1969 exposed rivets with Big E are highly collectible",
        ],
      },
      {
        era: "1970s",
        yearRange: "1970-1979",
        tagCharacteristics: [
          "Small 'e' red tab (lowercase e after 1971)",
          "Care instructions required by law",
          "Orange tab line introduced (1969)",
        ],
        manufacturingLocations: ["USA", "Mexico"],
        keyFeatures: [
          "Transition to small e red tab",
          "Orange tab for fashion-forward fits",
          "Bell bottoms and flares popular",
        ],
        tips: [
          "Early 1970s small e still valuable",
          "Orange tab pieces gaining collector interest",
        ],
      },
      {
        era: "1980s",
        yearRange: "1980-1989",
        tagCharacteristics: [
          "Small 'e' red tab standard",
          "More detailed care labels",
          "Size tags become more prominent",
        ],
        manufacturingLocations: ["USA", "Mexico", "Hong Kong"],
        keyFeatures: [
          "501 shrink-to-fit popular",
          "Stone wash and acid wash introduced",
          "Vintage 501 reproductions begin",
        ],
        tips: [
          "USA-made 1980s pieces still collectible",
          "Look for original unwashed 501s",
        ],
      },
      {
        era: "1990s",
        yearRange: "1990-1999",
        tagCharacteristics: [
          "Small 'e' red tab",
          "Silver Tab and other sub-lines",
          "More global manufacturing info",
        ],
        manufacturingLocations: ["USA", "Mexico", "China", "Philippines"],
        keyFeatures: [
          "Baggy and relaxed fits dominate",
          "Silver Tab, Red Tab, Orange Tab lines",
          "Hip-hop influenced sizing",
        ],
        tips: [
          "USA-made becoming rarer",
          "Silver Tab gaining vintage status",
        ],
      },
    ],
    authenticationTips: [
      "Check the red tab - should be sewn into the seam, not glued",
      "Verify button stamps match the era",
      "Look for proper back pocket stitching (arcuate design)",
      "Paper patches should show appropriate wear for age",
      "Care labels should match era-appropriate requirements",
    ],
    commonFakes: [
      "Reproduction Big E tabs on newer jeans",
      "Fake paper patches with incorrect fonts",
      "Wrong button stamps for the claimed era",
      "Modern stitching techniques on 'vintage' claims",
    ],
    valuableEras: [
      "1950s and earlier - extremely rare and valuable",
      "1960s Big E - highly collectible",
      "1970s Orange Tab - growing market",
      "USA-made any era - premium over imports",
    ],
  },
  "how-to-date-vintage-nike": {
    slug: "how-to-date-vintage-nike",
    brandName: "Nike",
    brandSlug: "nike",
    title: "How to Date Vintage Nike Clothing",
    description: "Guide to dating vintage Nike apparel using tags, swoosh design, and manufacturing details from the 1970s to today.",
    intro: "Nike was founded in 1971, evolving from Blue Ribbon Sports. Their tags, swoosh design, and construction have changed significantly. This guide helps identify the era of vintage Nike pieces.",
    quickFacts: {
      founded: "1971 (as Nike; 1964 as Blue Ribbon Sports)",
      headquarters: "Beaverton, Oregon",
      knownFor: "Athletic footwear and apparel, swoosh logo",
    },
    eraSections: [
      {
        era: "1970s",
        yearRange: "1971-1979",
        tagCharacteristics: [
          "Orange swoosh tags common",
          "'Blue Ribbon Sports' on early pieces",
          "Simple single-line tags",
        ],
        manufacturingLocations: ["USA", "Japan"],
        keyFeatures: [
          "Block letter NIKE logos",
          "Orange and white color schemes",
          "Simple athletic designs",
        ],
        tips: [
          "Blue Ribbon Sports pieces are extremely rare",
          "1970s USA-made very collectible",
        ],
      },
      {
        era: "1980s",
        yearRange: "1980-1989",
        tagCharacteristics: [
          "Grey tag era begins",
          "Swoosh becomes more stylized",
          "RN numbers on tags",
        ],
        manufacturingLocations: ["USA", "Taiwan", "Korea"],
        keyFeatures: [
          "Air Jordan line launches (1984)",
          "Just Do It campaign (1988)",
          "Bold colors and graphics",
        ],
        tips: [
          "Early Air Jordan apparel highly valuable",
          "USA-made Nike becoming rare",
        ],
      },
      {
        era: "1990s",
        yearRange: "1990-1999",
        tagCharacteristics: [
          "White tag with black swoosh common",
          "Silver tag for premium lines",
          "More detailed care instructions",
        ],
        manufacturingLocations: ["USA (rare)", "China", "Indonesia", "Vietnam"],
        keyFeatures: [
          "Swoosh-only designs (minimal branding)",
          "ACG outdoor line",
          "Basketball-influenced streetwear",
        ],
        tips: [
          "Swoosh-only pieces very collectible",
          "ACG pieces gaining vintage value",
        ],
      },
    ],
    authenticationTips: [
      "Check swoosh proportions - should be consistent with era",
      "Verify tag printing quality and font",
      "Look for proper stitching quality",
      "RN numbers should be verifiable",
    ],
    commonFakes: [
      "Wrong swoosh proportions for claimed era",
      "Poor quality printing on tags",
      "Inconsistent stitching",
      "Incorrect fonts on labels",
    ],
    valuableEras: [
      "1970s Blue Ribbon Sports - extremely rare",
      "1980s Air Jordan - highly collectible",
      "1990s swoosh-only - growing demand",
      "USA-made any era - premium pricing",
    ],
  },
  "how-to-date-vintage-champion": {
    slug: "how-to-date-vintage-champion",
    brandName: "Champion",
    brandSlug: "champion",
    title: "How to Date Vintage Champion Clothing",
    description: "Complete guide to dating vintage Champion apparel using tags, C logos, and reverse weave construction details.",
    intro: "Champion has been making athletic apparel since 1919. Their iconic reverse weave sweatshirts and evolving 'C' logo make dating vintage pieces relatively straightforward once you know what to look for.",
    quickFacts: {
      founded: "1919 in Rochester, New York",
      headquarters: "Winston-Salem, North Carolina",
      knownFor: "Reverse Weave sweatshirts, athletic apparel",
    },
    eraSections: [
      {
        era: "1960s",
        yearRange: "1960-1969",
        tagCharacteristics: [
          "Running man logo",
          "Athletic Products tags",
          "Simple care instructions",
        ],
        manufacturingLocations: ["USA"],
        keyFeatures: [
          "Reverse Weave established",
          "College athletic contracts",
          "Simple block lettering",
        ],
        tips: [
          "Running man logo indicates pre-1970s",
          "USA-made on all legitimate pieces",
        ],
      },
      {
        era: "1970s",
        yearRange: "1970-1979",
        tagCharacteristics: [
          "Transition to 'C' logo",
          "Blue bar tags appear",
          "More detailed care labels",
        ],
        manufacturingLocations: ["USA"],
        keyFeatures: [
          "Classic 'C' logo establishes",
          "Tri-blend fabrics introduced",
          "College and NFL licenses",
        ],
        tips: [
          "Early C logo pieces valuable",
          "Look for original college prints",
        ],
      },
      {
        era: "1980s",
        yearRange: "1980-1989",
        tagCharacteristics: [
          "Tricolor tag (red/white/blue)",
          "C logo becomes iconic",
          "Reverse Weave tags prominent",
        ],
        manufacturingLocations: ["USA"],
        keyFeatures: [
          "Peak of USA manufacturing",
          "NBA and college partnerships",
          "Bold graphic prints",
        ],
        tips: [
          "1980s USA Champion most collectible",
          "Look for authentic sports licensing",
        ],
      },
      {
        era: "1990s",
        yearRange: "1990-1999",
        tagCharacteristics: [
          "Split between USA and import tags",
          "Script Champion logo appears",
          "Licensed apparel tags vary",
        ],
        manufacturingLocations: ["USA", "Mexico", "Honduras"],
        keyFeatures: [
          "NBA authentics popular",
          "College gear mainstream",
          "Script logo for lifestyle line",
        ],
        tips: [
          "USA-made 1990s still valuable",
          "Authentic NBA jerseys collectible",
        ],
      },
    ],
    authenticationTips: [
      "Check reverse weave construction - fabric grain runs horizontally",
      "Verify C logo proportions match era",
      "Look for proper rib knit quality",
      "Sports licenses should have correct league tags",
    ],
    commonFakes: [
      "Fake reverse weave without proper construction",
      "Incorrect C logo sizing",
      "Wrong sports licensing marks",
      "Poor quality materials",
    ],
    valuableEras: [
      "1960s running man logo - very rare",
      "1980s USA-made - peak collectibility",
      "1990s NBA authentics - steady demand",
      "Any USA Reverse Weave - premium value",
    ],
  },
};

export function getGuideBySlug(slug: string): BrandGuide | null {
  return BRAND_GUIDES[slug] || null;
}

export function getAllGuideSlugs(): string[] {
  return Object.keys(BRAND_GUIDES);
}
