/**
 * Generate FAQ items for brand pages.
 * These are structured for both SEO rich snippets and LLM extraction.
 */

interface BrandData {
  name: string;
  foundedYear?: number | null;
  countryCode?: string | null;
  countryName?: string | null;
  tagCount: number;
  eras?: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

export function generateBrandFAQs(brand: BrandData): FAQItem[] {
  const faqs: FAQItem[] = [];

  // Q1: How to identify vintage [Brand]
  faqs.push({
    question: `How do I identify vintage ${brand.name} clothing?`,
    answer: `Look for distinctive identifiers like neck tags, care labels, and buttons. Vintage ${brand.name} pieces typically have different tag styles depending on the era. ${brand.tagCount > 0 ? `ThreadDate has ${brand.tagCount} documented ${brand.name} identifier${brand.tagCount !== 1 ? 's' : ''} to help you date your find.` : `Check back as our community documents more ${brand.name} identifiers.`}`,
  });

  // Q2: How to date vintage [Brand]
  const eraText = brand.eras && brand.eras.length > 0
    ? `Our database covers ${brand.name} identifiers from ${brand.eras.join(', ')}.`
    : '';
  faqs.push({
    question: `How do I date a vintage ${brand.name} tag?`,
    answer: `Compare your tag to documented examples in our database. Key dating factors include tag design, font style, manufacturing location, and care label format. ${eraText} Look for "Made in" country indicators and union labels which changed over decades.`,
  });

  // Q3: Country of origin (if available)
  if (brand.countryName) {
    faqs.push({
      question: `Where is ${brand.name} from?`,
      answer: `${brand.name} is a ${brand.countryName} brand${brand.foundedYear ? `, founded in ${brand.foundedYear}` : ''}. Manufacturing locations have varied over the decades - early vintage pieces are often made in ${brand.countryName}, while later production moved to various countries.`,
    });
  }

  // Q4: Value question
  faqs.push({
    question: `What makes vintage ${brand.name} valuable?`,
    answer: `Vintage ${brand.name} value depends on era, condition, rarity, and authenticity. Earlier pieces (1960s-1980s) are often more valuable. "Made in USA" tags, original labels, and good condition increase value. Use ThreadDate to verify the era before buying or selling.`,
  });

  // Q5: Authentication
  faqs.push({
    question: `How do I authenticate ${brand.name} clothing?`,
    answer: `Check the tag against known examples from the same era. Look for consistent fonts, proper spelling, and era-appropriate manufacturing locations. Compare care symbols, stitching quality, and overall construction. ThreadDate's community-verified identifiers can help confirm authenticity.`,
  });

  return faqs;
}
