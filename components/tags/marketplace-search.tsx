'use client';

import { ExternalLink, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackMarketplaceClick } from "@/lib/analytics";

interface MarketplaceSearchProps {
  brandName: string;
  brandSlug: string;
  era?: string;
  category?: string;
}

function buildSearchQuery(brandName: string, era?: string): string {
  const parts = ["vintage", brandName];
  if (era && !era.includes("Modern")) {
    parts.push(era);
  }
  return parts.join(" ");
}

function buildEbayUrl(query: string): string {
  return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&_sacat=11450&LH_Complete=1`;
}

function buildPoshmarkUrl(query: string): string {
  return `https://poshmark.com/search?query=${encodeURIComponent(query)}&type=listings`;
}

function buildDepopUrl(query: string): string {
  return `https://www.depop.com/search/?q=${encodeURIComponent(query)}`;
}

function buildEtsyUrl(query: string): string {
  return `https://www.etsy.com/search?q=${encodeURIComponent(query)}&explicit=1&category=clothing`;
}

export function MarketplaceSearch({
  brandName,
  brandSlug,
  era,
  category,
}: MarketplaceSearchProps) {
  const searchQuery = buildSearchQuery(brandName, era);

  const handleClick = (marketplace: string, url: string) => {
    trackMarketplaceClick({
      brand: brandSlug,
      marketplace: marketplace as any,
      placement: 'tag_detail',
      scrollDepth: 0,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const marketplaces = [
    { name: "eBay", url: buildEbayUrl(searchQuery), color: "text-blue-600 hover:bg-blue-50" },
    { name: "Poshmark", url: buildPoshmarkUrl(searchQuery), color: "text-rose-600 hover:bg-rose-50" },
    { name: "Depop", url: buildDepopUrl(searchQuery), color: "text-red-600 hover:bg-red-50" },
    { name: "Etsy", url: buildEtsyUrl(searchQuery), color: "text-orange-600 hover:bg-orange-50" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-orange-600" />
          Shop Similar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-stone-600 mb-3">
          Find vintage {brandName} pieces on:
        </p>
        <div className="space-y-2">
          {marketplaces.map((mp) => (
            <button
              key={mp.name}
              onClick={() => handleClick(mp.name.toLowerCase(), mp.url)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md border border-stone-200 text-sm font-medium transition-colors cursor-pointer ${mp.color}`}
            >
              <span>{mp.name}</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          ))}
        </div>
        <p className="text-xs text-stone-400 mt-3">
          Links open search results in a new tab
        </p>
      </CardContent>
    </Card>
  );
}
