"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Brand {
  id: number;
  name: string;
  slug: string;
}

interface FilterPanelProps {
  brands: Brand[];
}

const ERAS = [
  "Pre-1900s",
  "1900s",
  "1910s",
  "1920s",
  "1930s",
  "1940s",
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s (Y2K)",
  "2010s",
  "2020s",
  "Modern",
];

const CATEGORIES = [
  "Neck Tag",
  "Care Tag",
  "Button/Snap",
  "Zipper",
  "Tab",
  "Stitching",
  "Print/Graphic",
  "Hardware",
  "Other",
];

const STITCH_TYPES = ["Single", "Double", "Chain", "Other"];

const CLOTHING_TYPES = [
  "T-Shirt",
  "Sweatshirt",
  "Hoodie",
  "Jacket",
  "Coat",
  "Jeans",
  "Pants",
  "Shorts",
  "Dress",
  "Skirt",
  "Hat",
  "Shoes",
  "Boots",
  "Belt",
  "Bag",
  "Other",
];

export function FilterPanel({ brands }: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentBrand = searchParams.get("brand") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentEra = searchParams.get("era") || "";
  const currentStitch = searchParams.get("stitch") || "";
  const currentOrigin = searchParams.get("origin") || "";
  const currentClothingType = searchParams.get("clothingType") || "";

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/search");
  };

  const hasFilters =
    currentBrand || currentCategory || currentEra || currentStitch || currentOrigin || currentClothingType;

  return (
    <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">Filters</h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Brand Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Brand
          </label>
          <Select
            value={currentBrand}
            onChange={(e) => updateFilter("brand", e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Clothing Type Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Clothing Type
          </label>
          <Select
            value={currentClothingType}
            onChange={(e) => updateFilter("clothingType", e.target.value)}
          >
            <option value="">All Types</option>
            {CLOTHING_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Category
          </label>
          <Select
            value={currentCategory}
            onChange={(e) => updateFilter("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </div>

        {/* Era Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Era
          </label>
          <Select
            value={currentEra}
            onChange={(e) => updateFilter("era", e.target.value)}
          >
            <option value="">All Eras</option>
            {ERAS.map((era) => (
              <option key={era} value={era}>
                {era}
              </option>
            ))}
          </Select>
        </div>

        {/* Stitch Type Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Stitch Type
          </label>
          <Select
            value={currentStitch}
            onChange={(e) => updateFilter("stitch", e.target.value)}
          >
            <option value="">All Types</option>
            {STITCH_TYPES.map((stitch) => (
              <option key={stitch} value={stitch}>
                {stitch}
              </option>
            ))}
          </Select>
        </div>

        {/* Origin Filter */}
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Origin Country
          </label>
          <Input
            type="text"
            placeholder="e.g., USA, Japan"
            value={currentOrigin}
            onChange={(e) => updateFilter("origin", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
