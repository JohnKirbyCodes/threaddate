'use client';

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { trackMarketplaceClick } from "@/lib/analytics";

interface MarketplaceFooterCTAProps {
  brandName: string;
  brandSlug: string;
  ebayUrl?: string;
  poshmarkUrl?: string;
  depopUrl?: string;
}

export function MarketplaceFooterCTA({
  brandName,
  brandSlug,
  ebayUrl,
  poshmarkUrl,
  depopUrl,
}: MarketplaceFooterCTAProps) {
  const hasAnyMarketplace = ebayUrl || poshmarkUrl || depopUrl;

  if (!hasAnyMarketplace) {
    return null;
  }

  const handleClick = (marketplace: 'ebay' | 'poshmark' | 'depop', url: string) => {
    const scrollPercentage = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    trackMarketplaceClick({
      brand: brandSlug,
      marketplace,
      placement: 'footer',
      scrollDepth: scrollPercentage,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-12 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg p-8 md:p-12 text-white shadow-lg">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Ready to shop?
        </h2>
        <p className="text-lg md:text-xl text-orange-50 mb-6">
          Join thousands of vintage collectors finding {brandName} pieces
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {ebayUrl && (
            <Button
              onClick={() => handleClick('ebay', ebayUrl)}
              variant="outline"
              className="bg-white text-blue-600 hover:bg-blue-50 border-2 border-white hover:border-blue-200 font-semibold gap-2 min-w-[160px]"
              size="lg"
            >
              Shop on eBay
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}

          {poshmarkUrl && (
            <Button
              onClick={() => handleClick('poshmark', poshmarkUrl)}
              variant="outline"
              className="bg-white text-rose-600 hover:bg-rose-50 border-2 border-white hover:border-rose-200 font-semibold gap-2 min-w-[160px]"
              size="lg"
            >
              Shop on Poshmark
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}

          {depopUrl && (
            <Button
              onClick={() => handleClick('depop', depopUrl)}
              variant="outline"
              className="bg-white text-red-600 hover:bg-red-50 border-2 border-white hover:border-red-200 font-semibold gap-2 min-w-[160px]"
              size="lg"
            >
              Find on Depop
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="text-sm text-orange-100 mt-6">
          All marketplace links open in a new tab for easy browsing
        </p>
      </div>
    </div>
  );
}
