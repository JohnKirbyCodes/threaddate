"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { BrandCombobox } from "@/components/ui/brand-combobox";
import { IdentifierCard, AddIdentifierButton, type IdentifierData } from "./identifier-card";
import { createBrand } from "@/lib/actions/create-brand";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Shirt, CheckCircle2, AlertCircle, Upload, MapPin, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import { uploadImageToStorage } from "@/lib/utils/upload-image";

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

// Countries of manufacture - includes historical regions common on vintage labels
const ORIGIN_COUNTRIES = [
  // Current major manufacturing countries
  "USA",
  "China",
  "Vietnam",
  "Bangladesh",
  "India",
  "Indonesia",
  "Mexico",
  "Turkey",
  "Italy",
  "Portugal",
  "Japan",
  "South Korea",
  "Taiwan",
  "Thailand",
  "Cambodia",
  "Pakistan",
  "Sri Lanka",
  "Philippines",
  "Malaysia",
  "Myanmar",
  "Honduras",
  "El Salvador",
  "Guatemala",
  "Nicaragua",
  "Dominican Republic",
  "Haiti",
  "Peru",
  "Colombia",
  "Brazil",
  "Morocco",
  "Tunisia",
  "Egypt",
  "Mauritius",
  "Madagascar",
  "Kenya",
  "Ethiopia",
  "Jordan",
  "Romania",
  "Bulgaria",
  "Poland",
  "Czech Republic",
  "Hungary",
  "UK",
  "France",
  "Germany",
  "Spain",
  "Belgium",
  "Netherlands",
  "Ireland",
  "Canada",
  "Australia",
  "New Zealand",
  // Historical regions (common on vintage labels)
  "Hong Kong",
  "Macau",
  "British Hong Kong",
  "USSR",
  "Soviet Union",
  "West Germany",
  "East Germany",
  "Yugoslavia",
  "Czechoslovakia",
  "British India",
  "Republic of China (Taiwan)",
  "Burma (Myanmar)",
  "Ceylon (Sri Lanka)",
  "Rhodesia",
  "South West Africa",
  "Zaire",
  // Other
  "Unknown",
  "Other",
];

interface ClothingFormData {
  name: string;
  type: ClothingType;
  brandId: number;
  era: Era;
  description?: string;
  color?: string;
  size?: string;
  originCountry?: string; // Country of manufacture
  imageUrl?: string; // URL to uploaded photo in Supabase Storage
}

interface ClothingItemWizardProps {
  onBack: () => void;
  onComplete: (data: { clothingItem: ClothingFormData; identifiers: IdentifierData[] }) => Promise<void>;
}

export function ClothingItemWizard({ onBack, onComplete }: ClothingItemWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingClothingImage, setIsUploadingClothingImage] = useState(false);
  const [isDraggingClothingImage, setIsDraggingClothingImage] = useState(false);
  const { toast } = useToast();
  const clothingImageRef = useRef<HTMLImageElement>(null);

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
    originCountry: "",
    imageUrl: "",
  });

  // For click-to-place: which identifier is being placed
  const [placingIdentifierId, setPlacingIdentifierId] = useState<string | null>(null);

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

  // Process and upload a clothing image file
  const processClothingImageFile = async (file: File) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingClothingImage(true);

    try {
      // Read file as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Upload to Supabase Storage
      const imageUrl = await uploadImageToStorage(base64, "clothing");
      setClothingData({ ...clothingData, imageUrl });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingClothingImage(false);
    }
  };

  // Handle clothing image upload from file input
  const handleClothingImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processClothingImageFile(file);
  };

  // Drag and drop handlers for clothing image
  const handleClothingDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingClothingImage(true);
  };

  const handleClothingDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingClothingImage(false);
  };

  const handleClothingDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingClothingImage(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processClothingImageFile(file);
    }
  };

  // Handle click-to-place on clothing image
  const handleClothingImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!placingIdentifierId || !clothingImageRef.current) return;

    const rect = clothingImageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Update the identifier with the position
    updateIdentifier(placingIdentifierId, {
      positionX: Math.max(0, Math.min(1, x)),
      positionY: Math.max(0, Math.min(1, y)),
    });

    setPlacingIdentifierId(null);
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
                Country of Manufacture <span className="text-stone-400">(optional)</span>
              </label>
              <Select
                value={clothingData.originCountry}
                onChange={(e) =>
                  setClothingData({ ...clothingData, originCountry: e.target.value })
                }
              >
                <option value="">Select country...</option>
                <optgroup label="Common">
                  {["USA", "China", "Vietnam", "Bangladesh", "India", "Mexico", "Italy", "Japan", "Hong Kong", "Taiwan"].map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Historical (Vintage Labels)">
                  {["USSR", "Soviet Union", "West Germany", "East Germany", "Yugoslavia", "Czechoslovakia", "British Hong Kong", "Ceylon (Sri Lanka)", "Burma (Myanmar)"].map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="All Countries">
                  {ORIGIN_COUNTRIES.filter(c => !["USA", "China", "Vietnam", "Bangladesh", "India", "Mexico", "Italy", "Japan", "Hong Kong", "Taiwan", "USSR", "Soviet Union", "West Germany", "East Germany", "Yugoslavia", "Czechoslovakia", "British Hong Kong", "Ceylon (Sri Lanka)", "Burma (Myanmar)"].includes(c)).map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </optgroup>
              </Select>
              <p className="mt-1 text-xs text-stone-500">
                As shown on care/origin label (includes historical regions)
              </p>
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

            {/* Clothing Image Upload */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Photo of the Item <span className="text-stone-400">(optional but recommended)</span>
              </label>
              {isUploadingClothingImage ? (
                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50">
                  <Loader2 className="h-8 w-8 text-orange-600 animate-spin mb-2" />
                  <p className="text-sm text-orange-600">Uploading image...</p>
                </div>
              ) : clothingData.imageUrl ? (
                <div className="relative">
                  <img
                    src={clothingData.imageUrl}
                    alt="Clothing item"
                    className="w-full max-h-64 object-contain rounded-lg border border-stone-200"
                  />
                  <button
                    type="button"
                    onClick={() => setClothingData({ ...clothingData, imageUrl: "" })}
                    className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 shadow-sm hover:bg-white"
                  >
                    <X className="h-4 w-4 text-stone-600" />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    isDraggingClothingImage
                      ? "border-orange-500 bg-orange-50"
                      : "border-stone-300 bg-stone-50 hover:bg-stone-100"
                  }`}
                  onDragOver={handleClothingDragOver}
                  onDragLeave={handleClothingDragLeave}
                  onDrop={handleClothingDrop}
                >
                  <Upload className={`h-8 w-8 mb-2 ${isDraggingClothingImage ? "text-orange-500" : "text-stone-400"}`} />
                  <p className={`text-sm ${isDraggingClothingImage ? "text-orange-600" : "text-stone-600"}`}>
                    {isDraggingClothingImage ? "Drop image here" : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">Used to mark identifier locations</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleClothingImageUpload}
                  />
                </label>
              )}
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

          {/* Click-to-place on clothing image */}
          {clothingData.imageUrl && (
            <div className="rounded-lg border border-stone-200 bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-stone-900">
                    Mark Identifier Locations
                  </span>
                </div>
                {placingIdentifierId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPlacingIdentifierId(null)}
                    className="text-stone-500"
                  >
                    Cancel
                  </Button>
                )}
              </div>

              {placingIdentifierId ? (
                <p className="text-xs text-orange-600 mb-3">
                  Click on the image where this identifier is located
                </p>
              ) : (
                <p className="text-xs text-stone-500 mb-3">
                  Click &quot;Place on image&quot; next to an identifier, then click the photo
                </p>
              )}

              <div className="relative inline-block">
                <img
                  ref={clothingImageRef}
                  src={clothingData.imageUrl}
                  alt="Clothing item"
                  onClick={handleClothingImageClick}
                  className={`max-h-80 w-auto rounded-lg border border-stone-200 ${
                    placingIdentifierId ? "cursor-crosshair" : ""
                  }`}
                />
                {/* Show placed markers */}
                {identifiers
                  .filter((i) => i.positionX !== undefined && i.positionY !== undefined && i.croppedImage)
                  .map((identifier, idx) => (
                    <div
                      key={identifier.id}
                      className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold shadow-lg border-2 border-white"
                      style={{
                        left: `${(identifier.positionX ?? 0) * 100}%`,
                        top: `${(identifier.positionY ?? 0) * 100}%`,
                      }}
                      title={identifier.category}
                    >
                      {idx + 1}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Identifier cards */}
          <div className="space-y-4">
            {identifiers.map((identifier, index) => (
              <div key={identifier.id} className="space-y-2">
                <IdentifierCard
                  identifier={identifier}
                  index={index}
                  onUpdate={updateIdentifier}
                  onRemove={removeIdentifier}
                  canRemove={identifiers.length > 1}
                  defaultEra={clothingData.era}
                />
                {/* Place on image button - only show when clothing image exists and identifier has image */}
                {clothingData.imageUrl && identifier.croppedImage && (
                  <div className="flex items-center gap-2 pl-2">
                    {identifier.positionX !== undefined ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Position marked
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPlacingIdentifierId(identifier.id)}
                        className={`text-xs flex items-center gap-1 ${
                          placingIdentifierId === identifier.id
                            ? "text-orange-600 font-medium"
                            : "text-stone-500 hover:text-orange-600"
                        }`}
                      >
                        <MapPin className="h-3 w-3" />
                        {placingIdentifierId === identifier.id ? "Click on image above..." : "Place on image"}
                      </button>
                    )}
                  </div>
                )}
              </div>
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

            {/* Show clothing image if uploaded */}
            {clothingData.imageUrl && (
              <div className="mb-4">
                <img
                  src={clothingData.imageUrl}
                  alt="Clothing item"
                  className="w-full max-h-48 object-contain rounded-lg border border-stone-200"
                />
              </div>
            )}

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
              {clothingData.originCountry && (
                <div>
                  <span className="text-stone-500">Made in:</span>
                  <p className="font-medium text-stone-900">{clothingData.originCountry}</p>
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
