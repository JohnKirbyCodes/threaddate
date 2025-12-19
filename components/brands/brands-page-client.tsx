"use client";

import { useState, useMemo } from "react";
import { BrandsFilterBar } from "./brands-filter-bar";
import { AlphabeticalBrandList } from "./alphabetical-brand-list";
import { AlphabetNav } from "./alphabet-nav";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  founded_year: number | null;
  verified?: boolean;
  description?: string | null;
  tag_count?: number;
}

interface BrandsPageClientProps {
  brands: Brand[];
}

export function BrandsPageClient({ brands }: BrandsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter and sort brands
  const filteredAndSortedBrands = useMemo(() => {
    let result = [...brands];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((brand) =>
        brand.name.toLowerCase().includes(query)
      );
    }

    // Sort brands
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "year-asc":
          return (a.founded_year || 9999) - (b.founded_year || 9999);
        case "year-desc":
          return (b.founded_year || 0) - (a.founded_year || 0);
        case "verified":
          if (a.verified === b.verified) {
            return a.name.localeCompare(b.name);
          }
          return a.verified ? -1 : 1;
        default:
          return 0;
      }
    });

    return result;
  }, [brands, searchQuery, sortBy]);

  // Get available letters for alphabet nav
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    filteredAndSortedBrands.forEach((brand) => {
      letters.add(brand.name.charAt(0).toUpperCase());
    });
    return Array.from(letters).sort();
  }, [filteredAndSortedBrands]);

  return (
    <>
      {/* Filter Bar */}
      <BrandsFilterBar
        totalBrands={brands.length}
        filteredCount={filteredAndSortedBrands.length}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        sortBy={sortBy}
        searchQuery={searchQuery}
      />

      {/* Alphabet Navigation */}
      <AlphabetNav availableLetters={availableLetters} />

      {/* Brand List */}
      <div className="container mx-auto px-4 py-8">
        <AlphabeticalBrandList
          brands={filteredAndSortedBrands}
          viewMode={viewMode}
        />
      </div>
    </>
  );
}
