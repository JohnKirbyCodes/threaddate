"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  size?: "default" | "large";
}

export function SearchBar({ className, placeholder, size = "default" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to search page with query
      // For now, just navigate to search page
      // In future, could add text search to the database
      router.push(`/search`);
    } else {
      router.push("/search");
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
      <div className="relative">
        <Search className={iconClasses} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || "Search brands, eras, tags..."}
          className={inputClasses}
        />
      </div>
    </form>
  );
}
