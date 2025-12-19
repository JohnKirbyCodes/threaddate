"use client";

import { useState, useEffect } from "react";
import { Search, Grid3x3, List, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { trackBrandListInteraction } from "@/lib/analytics";

interface BrandsFilterBarProps {
  totalBrands: number;
  filteredCount: number;
  onSearchChange: (query: string) => void;
  onSortChange: (sortBy: string) => void;
  onViewModeChange: (viewMode: "grid" | "list") => void;
  viewMode: "grid" | "list";
  sortBy: string;
  searchQuery: string;
}

export function BrandsFilterBar({
  totalBrands,
  filteredCount,
  onSearchChange,
  onSortChange,
  onViewModeChange,
  viewMode,
  sortBy,
  searchQuery,
}: BrandsFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
        if (localSearch) {
          trackBrandListInteraction({
            action: "search",
            value: localSearch,
            resultCount: filteredCount,
          });
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch]);

  const handleSortChange = (value: string) => {
    onSortChange(value);
    trackBrandListInteraction({
      action: "sort",
      value,
      resultCount: filteredCount,
    });
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    onViewModeChange(mode);
    trackBrandListInteraction({
      action: "view_change",
      value: mode,
      resultCount: filteredCount,
    });
  };

  const clearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  return (
    <div className="sticky top-16 z-10 bg-white border-b border-stone-200 py-4 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search Input */}
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <Input
                type="search"
                placeholder="Filter brands..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 pr-10"
              />
              {localSearch && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Controls Group */}
          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
            {/* Sort Dropdown */}
            <Select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-[180px]"
            >
              <option value="name-asc">A-Z</option>
              <option value="name-desc">Z-A</option>
              <option value="year-asc">Oldest First</option>
              <option value="year-desc">Newest First</option>
              <option value="verified">Verified First</option>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleViewModeChange("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Results Count */}
            <span className="text-sm text-stone-600 whitespace-nowrap">
              {filteredCount} {filteredCount === 1 ? "brand" : "brands"}
              {searchQuery && filteredCount !== totalBrands && (
                <span className="text-stone-400"> (filtered)</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
