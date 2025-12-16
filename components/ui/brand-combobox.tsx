"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  verified?: boolean | null;
  verification_status?: string | null;
}

interface BrandComboboxProps {
  brands: Brand[];
  value?: number;
  onChange: (brandId: number) => void;
  onCreateBrand: (brandName: string) => Promise<void>;
  disabled?: boolean;
}

export function BrandCombobox({
  brands,
  value,
  onChange,
  onCreateBrand,
  disabled,
}: BrandComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const selectedBrand = brands.find((brand) => brand.id === value);

  // Group brands by verification status
  const verifiedBrands = brands.filter((b) => b.verified);
  const unverifiedBrands = brands.filter((b) => !b.verified);

  // Filter brands based on search
  const filteredVerified = verifiedBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredUnverified = unverifiedBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasResults = filteredVerified.length > 0 || filteredUnverified.length > 0;
  const canCreateNew = searchQuery.trim().length >= 2 && !hasResults;

  const handleCreateNew = async () => {
    if (!searchQuery.trim() || isCreating) return;

    setIsCreating(true);
    try {
      await onCreateBrand(searchQuery.trim());
      setSearchQuery("");
      setOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          {selectedBrand ? (
            <span className="flex items-center gap-2">
              {selectedBrand.name}
              {selectedBrand.verified ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-600" />
              )}
            </span>
          ) : (
            "Select brand..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search brands..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {!hasResults && !canCreateNew && (
              <CommandEmpty>No brands found.</CommandEmpty>
            )}

            {filteredVerified.length > 0 && (
              <CommandGroup heading="Verified Brands">
                {filteredVerified.map((brand) => (
                  <CommandItem
                    key={brand.id}
                    value={brand.id.toString()}
                    onSelect={() => {
                      onChange(brand.id);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === brand.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="flex-1">{brand.name}</span>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {filteredUnverified.length > 0 && (
              <CommandGroup heading="Pending Verification">
                {filteredUnverified.map((brand) => (
                  <CommandItem
                    key={brand.id}
                    value={brand.id.toString()}
                    onSelect={() => {
                      onChange(brand.id);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === brand.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="flex-1">{brand.name}</span>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {canCreateNew && (
              <CommandGroup>
                <CommandItem
                  onSelect={handleCreateNew}
                  disabled={isCreating}
                  className="text-orange-600"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {isCreating
                    ? "Creating..."
                    : `Create "${searchQuery.trim()}"`}
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
