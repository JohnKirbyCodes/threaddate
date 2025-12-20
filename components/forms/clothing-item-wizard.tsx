"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { BrandCombobox } from "@/components/ui/brand-combobox";
import { IdentifierCard, AddIdentifierButton, type IdentifierData } from "./identifier-card";
import { createBrand } from "@/lib/actions/create-brand";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shirt, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type ClothingType = Database["public"]["Enums"]["clothing_type_enum"];
type Era = Database["public"]["Enums"]["era_enum"];

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  verified?: boolean | null;
  verification_status?: string | null;
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

const ERAS: Era[] = [
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

interface ClothingFormData {
  name: string;
  type: ClothingType;
  brandId: number;
  era: Era;
  description?: string;
  color?: string;
  size?: string;
}

interface ClothingItemWizardProps {
  onBack: () => void;
  onComplete: (data: { clothingItem: ClothingFormData; identifiers: IdentifierData[] }) => Promise<void>;
}

export function ClothingItemWizard({ onBack, onComplete }: ClothingItemWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Brands data
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  // Step 1: Clothing details
  const [clothingData, setClothingData] = useState<ClothingFormData>({
    name: "",
    type: "T-Shirt",
    brandId: 0,
    era: "1990s",
    description: "",
    color: "",
    size: "",
  });

  // Step 2: Identifiers
  const [identifiers, setIdentifiers] = useState<IdentifierData[]>([
    {
      id: crypto.randomUUID(),
      croppedImage: "",
      category: "Neck Tag",
      era: "1990s",
    },
  ]);

  // Fetch brands
  useEffect(() => {
    async function fetchBrands() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("brands")
          .select("id, name, slug, logo_url, verified, verification_status")
          .order("verified", { ascending: false })
          .order("name", { ascending: true });

        if (error) throw error;
        setBrands(data || []);
      } catch (err) {
        console.error("Error fetching brands:", err);
        toast({
          title: "Error",
          description: "Failed to load brands. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setBrandsLoading(false);
      }
    }

    fetchBrands();
  }, [toast]);

  const handleCreateBrand = async (brandName: string) => {
    const result = await createBrand(brandName);

    if (result.success && result.brandId) {
      // Refetch brands
      const supabase = createClient();
      const { data } = await supabase
        .from("brands")
        .select("id, name, slug, logo_url, verified, verification_status")
        .order("verified", { ascending: false })
        .order("name", { ascending: true });

      if (data) {
        setBrands(data);
      }
      setClothingData({ ...clothingData, brandId: result.brandId });
      toast({
        title: "Brand created!",
        description: `"${brandName}" has been added and is pending verification.`,
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create brand",
        variant: "destructive",
      });
    }
  };

  // Identifier management
  const addIdentifier = () => {
    setIdentifiers([
      ...identifiers,
      {
        id: crypto.randomUUID(),
        croppedImage: "",
        category: "Neck Tag",
        era: clothingData.era, // Inherit era from clothing item
      },
    ]);
  };

  const updateIdentifier = (id: string, data: Partial<IdentifierData>) => {
    setIdentifiers(
      identifiers.map((i) => (i.id === id ? { ...i, ...data } : i))
    );
  };

  const removeIdentifier = (id: string) => {
    if (identifiers.length > 1) {
      setIdentifiers(identifiers.filter((i) => i.id !== id));
    }
  };

  // Validation
  const isStep1Valid = clothingData.name.trim() && clothingData.brandId > 0;
  const isStep2Valid = identifiers.some((i) => i.croppedImage);
  const incompleteIdentifiers = identifiers.filter((i) => !i.croppedImage);

  // Handle step 1 continue - sync era to identifiers
  const handleStep1Continue = () => {
    // Update all identifiers to use the clothing item's era
    setIdentifiers(
      identifiers.map((i) => ({ ...i, era: clothingData.era }))
    );
    setStep(2);
  };

  // Handle final submit
  const handleSubmit = async () => {
    // Filter to only complete identifiers
    const completeIdentifiers = identifiers.filter((i) => i.croppedImage);

    if (completeIdentifiers.length === 0) {
      toast({
        title: "Missing Identifiers",
        description: "Please add at least one identifier with an image.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onComplete({
        clothingItem: clothingData,
        identifiers: completeIdentifiers,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBrand = brands.find((b) => b.id === clothingData.brandId);

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`flex items-center ${s < 3 ? "flex-1" : ""}`}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                  s <= step
                    ? "bg-orange-600 text-white"
                    : "bg-stone-200 text-stone-600"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`mx-2 h-1 flex-1 ${
                    s < step ? "bg-orange-600" : "bg-stone-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-stone-600">
          <span>Item Details</span>
          <span>Identifiers</span>
          <span>Review</span>
        </div>
      </div>

      {/* Step 1: Clothing Details */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Shirt className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              Describe the Clothing Item
            </h2>
            <p className="text-stone-600">
              Tell us about the garment you're documenting
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Brand *
              </label>
              <BrandCombobox
                brands={brands}
                value={clothingData.brandId || undefined}
                onChange={(id) => setClothingData({ ...clothingData, brandId: id })}
                onCreateBrand={handleCreateBrand}
                disabled={brandsLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Type *
                </label>
                <Select
                  value={clothingData.type}
                  onChange={(e) =>
                    setClothingData({
                      ...clothingData,
                      type: e.target.value as ClothingType,
                    })
                  }
                >
                  {CLOTHING_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Era *
                </label>
                <Select
                  value={clothingData.era}
                  onChange={(e) =>
                    setClothingData({
                      ...clothingData,
                      era: e.target.value as Era,
                    })
                  }
                >
                  {ERAS.map((era) => (
                    <option key={era} value={era}>
                      {era}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={clothingData.name}
                onChange={(e) =>
                  setClothingData({ ...clothingData, name: e.target.value })
                }
                placeholder="e.g., Vintage Nike Windbreaker"
                className="w-full rounded-md border border-stone-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
              />
              <p className="mt-1 text-xs text-stone-500">
                Give it a descriptive name for easy identification
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Color <span className="text-stone-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={clothingData.color}
                  onChange={(e) =>
                    setClothingData({ ...clothingData, color: e.target.value })
                  }
                  placeholder="e.g., Navy Blue"
                  className="w-full rounded-md border border-stone-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Size <span className="text-stone-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={clothingData.size}
                  onChange={(e) =>
                    setClothingData({ ...clothingData, size: e.target.value })
                  }
                  placeholder="e.g., Large, XL, 32x30"
                  className="w-full rounded-md border border-stone-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Description <span className="text-stone-400">(optional)</span>
              </label>
              <textarea
                value={clothingData.description}
                onChange={(e) =>
                  setClothingData({ ...clothingData, description: e.target.value })
                }
                placeholder="Any additional details about this item..."
                rows={3}
                className="w-full rounded-md border border-stone-300 px-3 py-2 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleStep1Continue}
              className="flex-1"
              disabled={!isStep1Valid}
            >
              Continue to Identifiers
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Add Identifiers */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              Add Identifiers
            </h2>
            <p className="text-stone-600">
              Document the tags, buttons, and other identifiers on this item
            </p>
          </div>

          {/* Validation warning */}
          {incompleteIdentifiers.length === identifiers.length && (
            <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-4 border border-amber-200">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Add at least one identifier image to continue
              </p>
            </div>
          )}

          {/* Identifier cards */}
          <div className="space-y-4">
            {identifiers.map((identifier, index) => (
              <IdentifierCard
                key={identifier.id}
                identifier={identifier}
                index={index}
                onUpdate={updateIdentifier}
                onRemove={removeIdentifier}
                canRemove={identifiers.length > 1}
                defaultEra={clothingData.era}
              />
            ))}

            <AddIdentifierButton onAdd={addIdentifier} />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="flex-1"
              disabled={!isStep2Valid}
            >
              Review Submission
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              Review Your Submission
            </h2>
            <p className="text-stone-600">
              Make sure everything looks correct before submitting
            </p>
          </div>

          {/* Clothing item summary */}
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <h3 className="font-semibold text-stone-900 mb-4">Clothing Item</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-stone-500">Name:</span>
                <p className="font-medium text-stone-900">{clothingData.name}</p>
              </div>
              <div>
                <span className="text-stone-500">Brand:</span>
                <p className="font-medium text-stone-900">{selectedBrand?.name}</p>
              </div>
              <div>
                <span className="text-stone-500">Type:</span>
                <p className="font-medium text-stone-900">{clothingData.type}</p>
              </div>
              <div>
                <span className="text-stone-500">Era:</span>
                <p className="font-medium text-stone-900">{clothingData.era}</p>
              </div>
              {clothingData.color && (
                <div>
                  <span className="text-stone-500">Color:</span>
                  <p className="font-medium text-stone-900">{clothingData.color}</p>
                </div>
              )}
              {clothingData.size && (
                <div>
                  <span className="text-stone-500">Size:</span>
                  <p className="font-medium text-stone-900">{clothingData.size}</p>
                </div>
              )}
            </div>
            {clothingData.description && (
              <div className="mt-4">
                <span className="text-sm text-stone-500">Description:</span>
                <p className="text-sm text-stone-900">{clothingData.description}</p>
              </div>
            )}
          </div>

          {/* Identifiers summary */}
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <h3 className="font-semibold text-stone-900 mb-4">
              Identifiers ({identifiers.filter((i) => i.croppedImage).length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {identifiers
                .filter((i) => i.croppedImage)
                .map((identifier, index) => (
                  <div key={identifier.id} className="text-center">
                    <img
                      src={identifier.croppedImage}
                      alt={`Identifier ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg mb-2"
                    />
                    <p className="text-xs font-medium text-stone-900">
                      {identifier.category}
                    </p>
                    <p className="text-xs text-stone-500">{identifier.era}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit All"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
