'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingBag, Tag, TrendingUp, Globe, Store } from "lucide-react";
import { trackMarketplaceClick } from "@/lib/analytics";

interface MarketplaceHeroProps {
  brandName: string;
  brandSlug: string;
  amazonUrl?: string;
  ebayUrl?: string;
  poshmarkUrl?: string;
  depopUrl?: string;
  websiteUrl?: string;
  identifierCount: number;
}

export function MarketplaceHero({
  brandName,
  brandSlug,
  amazonUrl,
  ebayUrl,
  poshmarkUrl,
  depopUrl,
  websiteUrl,
  identifierCount,
}: MarketplaceHeroProps) {
  const hasAnyMarketplace = amazonUrl || ebayUrl || poshmarkUrl || depopUrl;

  if (!hasAnyMarketplace && !websiteUrl) {
    return null;
  }

  const handleClick = (marketplace: 'amazon' | 'ebay' | 'poshmark' | 'depop', url: string) => {
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
            Shop {brandName}
          </h2>
        </div>
        {identifierCount > 0 && (
          <p className="text-stone-600 mt-2">
            Browse vintage pieces across {identifierCount} documented era{identifierCount !== 1 ? 's' : ''}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Official Website - Full Width Row */}
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                <Globe className="h-5 w-5 text-stone-600" />
              </div>
              <div>
                <p className="font-medium text-stone-900">Official {brandName} Store</p>
                <p className="text-xs text-stone-500">Shop new arrivals at the official website</p>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-stone-400 group-hover:text-stone-600" />
          </a>
        )}

        {/* Marketplace Cards */}
        {hasAnyMarketplace && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Amazon Card - Priority placement */}
            {amazonUrl && (
              <Card className="group hover:ring-2 ring-amber-500 hover:shadow-md transition-all cursor-pointer border-amber-200 bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <Store className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-900">Amazon</h3>
                      <p className="text-xs text-stone-600 mt-1">New & Official</p>
                    </div>
                    <Button
                      onClick={() => handleClick('amazon', amazonUrl)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white gap-2"
                      size="sm"
                    >
                      Shop Amazon
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
        )}

        {identifierCount > 0 && (
          <p className="text-sm text-stone-600 text-center">
            💡 <span className="font-medium">Tip:</span> Use the era dates from identifiers below to refine your search
          </p>
        )}
      </CardContent>
    </Card>
  );
}
