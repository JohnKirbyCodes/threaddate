'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingBag, Tag, TrendingUp } from "lucide-react";
import { trackMarketplaceClick } from "@/lib/analytics";

interface MarketplaceHeroProps {
  brandName: string;
  brandSlug: string;
  ebayUrl?: string;
  poshmarkUrl?: string;
  depopUrl?: string;
  identifierCount: number;
}

export function MarketplaceHero({
  brandName,
  brandSlug,
  ebayUrl,
  poshmarkUrl,
  depopUrl,
  identifierCount,
}: MarketplaceHeroProps) {
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
      placement: 'hero',
      scrollDepth: scrollPercentage,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-stone-50 border-orange-100">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-orange-600" />
          <h2 className="text-2xl font-bold text-stone-900">
            Shop Vintage {brandName}
          </h2>
        </div>
        <p className="text-stone-600 mt-2">
          Find authenticated pieces from {identifierCount} verified era{identifierCount !== 1 ? 's' : ''}
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* eBay Card */}
          {ebayUrl && (
            <Card className="group hover:ring-2 ring-blue-500 hover:shadow-md transition-all cursor-pointer border-blue-200 bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">eBay</h3>
                    <p className="text-xs text-stone-600 mt-1">Largest Selection</p>
                  </div>
                  <Button
                    onClick={() => handleClick('ebay', ebayUrl)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
                    size="sm"
                  >
                    Browse eBay
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Poshmark Card */}
          {poshmarkUrl && (
            <Card className="group hover:ring-2 ring-rose-500 hover:shadow-md transition-all cursor-pointer border-rose-200 bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                    <Tag className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Poshmark</h3>
                    <p className="text-xs text-stone-600 mt-1">Curated Vintage</p>
                  </div>
                  <Button
                    onClick={() => handleClick('poshmark', poshmarkUrl)}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white gap-2"
                    size="sm"
                  >
                    Shop Poshmark
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Depop Card */}
          {depopUrl && (
            <Card className="group hover:ring-2 ring-red-500 hover:shadow-md transition-all cursor-pointer border-red-200 bg-white">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">Depop</h3>
                    <p className="text-xs text-stone-600 mt-1">Fresh Drops</p>
                  </div>
                  <Button
                    onClick={() => handleClick('depop', depopUrl)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white gap-2"
                    size="sm"
                  >
                    Find on Depop
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <p className="text-sm text-stone-600 mt-4 text-center">
          💡 <span className="font-medium">Tip:</span> Use the era dates from identifiers below to refine your search
        </p>
      </CardContent>
    </Card>
  );
}
