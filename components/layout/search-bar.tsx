"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import type { BrandSuggestion } from "@/lib/types/search";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  size?: "default" | "large";
}

export function SearchBar({ className, placeholder, size = "default" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<BrandSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoading(true);
      fetch(`/api/search/brands?q=${encodeURIComponent(debouncedQuery)}&limit=5`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
          setOpen(data.length > 0);
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        })
        .finally(() => setIsLoading(false));
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  }, [debouncedQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const handleBrandSelect = (brandName: string) => {
    setQuery(brandName);
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(brandName)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e as any);
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const inputClasses = cn(
    "w-full rounded-full border bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
    size === "large"
      ? "h-14 border-2 border-stone-300 pl-12 pr-4 text-base"
      : "h-10 border border-stone-300 pl-10 pr-4 text-sm"
  );

  const iconClasses = cn(
    "absolute top-1/2 -translate-y-1/2 text-stone-400",
    size === "large" ? "left-4 h-5 w-5" : "left-3 h-4 w-4"
  );

  return (
    <form onSubmit={handleSearch} className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className={iconClasses} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setOpen(true)}
              placeholder={placeholder || "Search brands, eras, tags..."}
              className={inputClasses}
            />
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="p-0"
          align="start"
          style={{ width: "var(--radix-popover-trigger-width)" }}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command shouldFilter={false}>
            <CommandList>
              {isLoading && (
                <CommandEmpty>Searching brands...</CommandEmpty>
              )}

              {!isLoading && suggestions.length === 0 && debouncedQuery.length >= 2 && (
                <CommandEmpty>No brands found</CommandEmpty>
              )}

              {suggestions.length > 0 && (
                <CommandGroup heading="Brands">
                  {suggestions.map((brand) => (
                    <CommandItem
                      key={brand.id}
                      value={brand.name}
                      onSelect={() => handleBrandSelect(brand.name)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-stone-100">
                        {brand.logo_url ? (
                          <img
                            src={brand.logo_url}
                            alt={brand.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Building2 className="h-4 w-4 text-stone-400" />
                        )}
                      </div>

                      <span className="flex-1">{brand.name}</span>

                      {brand.verified && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </form>
  );
}
