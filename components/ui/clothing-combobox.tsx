"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus, CheckCircle2, Clock, Shirt } from "lucide-react";
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
import type { Database } from "@/lib/supabase/types";

type ClothingType = Database["public"]["Enums"]["clothing_type_enum"];

interface ClothingItem {
  id: number;
  name: string;
  slug: string;
  type: ClothingType;
  color?: string | null;
  status?: string | null;
}

interface ClothingComboboxProps {
  clothingItems: ClothingItem[];
  value?: number;
  onChange: (clothingItemId: number | undefined) => void;
  onCreateClothingItem: (name: string, type: ClothingType) => Promise<void>;
  disabled?: boolean;
}

const CLOTHING_TYPES: ClothingType[] = [
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

export function ClothingCombobox({
  clothingItems,
  value,
  onChange,
  onCreateClothingItem,
  disabled,
}: ClothingComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [showTypeSelect, setShowTypeSelect] = React.useState(false);
  const [pendingName, setPendingName] = React.useState("");

  const selectedItem = clothingItems.find((item) => item.id === value);

  // Group items by status
  const verifiedItems = clothingItems.filter((i) => i.status === "verified");
  const pendingItems = clothingItems.filter((i) => i.status !== "verified");

  // Filter based on search
  const filteredVerified = verifiedItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredPending = pendingItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasResults = filteredVerified.length > 0 || filteredPending.length > 0;
  const canCreateNew = searchQuery.trim().length >= 2 && !hasResults;

  const handleStartCreate = () => {
    setPendingName(searchQuery.trim());
    setShowTypeSelect(true);
  };

  const handleCreateWithType = async (type: ClothingType) => {
    if (!pendingName || isCreating) return;

    setIsCreating(true);
    try {
      await onCreateClothingItem(pendingName, type);
      setSearchQuery("");
      setPendingName("");
      setShowTypeSelect(false);
      setOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClear = () => {
    onChange(undefined);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setShowTypeSelect(false);
        setPendingName("");
      }
    }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between"
        >
          {selectedItem ? (
            <span className="flex items-center gap-2">
              <Shirt className="h-4 w-4 text-stone-500" />
              {selectedItem.name}
              {selectedItem.color && (
                <span className="text-stone-500">({selectedItem.color})</span>
              )}
              {selectedItem.status === "verified" ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-yellow-600" />
              )}
            </span>
          ) : (
            <span className="text-stone-500">Select clothing item (optional)...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          {!showTypeSelect ? (
            <>
              <CommandInput
                placeholder="Search clothing items..."
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                {value && (
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleClear}
                      className="text-stone-500"
                    >
                      Clear selection
                    </CommandItem>
                  </CommandGroup>
                )}

                {!hasResults && !canCreateNew && (
                  <CommandEmpty>No clothing items found.</CommandEmpty>
                )}

                {filteredVerified.length > 0 && (
                  <CommandGroup heading="Verified Items">
                    {filteredVerified.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.id.toString()}
                        onSelect={() => {
                          onChange(item.id);
                          setOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === item.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="flex-1">
                          {item.name}
                          {item.color && (
                            <span className="ml-1 text-stone-500">({item.color})</span>
                          )}
                        </span>
                        <span className="text-xs text-stone-400 mr-2">{item.type}</span>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {filteredPending.length > 0 && (
                  <CommandGroup heading="Pending Verification">
                    {filteredPending.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.id.toString()}
                        onSelect={() => {
                          onChange(item.id);
                          setOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === item.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="flex-1">
                          {item.name}
                          {item.color && (
                            <span className="ml-1 text-stone-500">({item.color})</span>
                          )}
                        </span>
                        <span className="text-xs text-stone-400 mr-2">{item.type}</span>
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {canCreateNew && (
                  <CommandGroup>
                    <CommandItem
                      onSelect={handleStartCreate}
                      className="text-orange-600"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create "{searchQuery.trim()}"
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </>
          ) : (
            <>
              <div className="p-2 border-b">
                <p className="text-sm font-medium">Select type for "{pendingName}"</p>
              </div>
              <CommandList>
                <CommandGroup>
                  {CLOTHING_TYPES.map((type) => (
                    <CommandItem
                      key={type}
                      onSelect={() => handleCreateWithType(type)}
                      disabled={isCreating}
                    >
                      {isCreating ? "Creating..." : type}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
