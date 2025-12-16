"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { BrandCombobox } from "@/components/ui/brand-combobox";
import { createBrand } from "@/lib/actions/create-brand";
import { useToast } from "@/hooks/use-toast";
import { Clock } from "lucide-react";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  verified?: boolean | null;
  verification_status?: string | null;
}

interface ClassificationStepProps {
  brands: Brand[];
  brandsLoading?: boolean;
  onNext: (data: { brandId: number; category: string }) => void;
  onBack: () => void;
  onBrandCreated: (brandId: number) => Promise<void>;
  initialData?: { brandId?: number; category?: string };
}

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

export function ClassificationStep({
  brands,
  brandsLoading,
  onNext,
  onBack,
  onBrandCreated,
  initialData,
}: ClassificationStepProps) {
  const [brandId, setBrandId] = useState(initialData?.brandId || 0);
  const [category, setCategory] = useState(initialData?.category || "");
  const { toast } = useToast();

  const selectedBrand = brands.find((b) => b.id === brandId);

  const handleCreateBrand = async (brandName: string) => {
    const result = await createBrand(brandName);

    if (result.success && result.brandId) {
      await onBrandCreated(result.brandId);
      setBrandId(result.brandId);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (brandId && category) {
      onNext({ brandId, category });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">
          Classify the Identifier
        </h2>
        <p className="text-stone-600">
          Tell us what brand and type of identifier this is
        </p>
      </div>

      <div>
        <label
          htmlFor="brand"
          className="block text-sm font-medium text-stone-700 mb-2"
        >
          Brand *
        </label>
        <BrandCombobox
          brands={brands}
          value={brandId || undefined}
          onChange={setBrandId}
          onCreateBrand={handleCreateBrand}
          disabled={brandsLoading}
        />
        {selectedBrand && !selectedBrand.verified && (
          <div className="mt-2 flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md border border-yellow-200">
            <Clock className="h-4 w-4" />
            <span>
              This brand is pending verification. Your submission will still be saved.
            </span>
          </div>
        )}
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-stone-700 mb-2"
        >
          Category *
        </label>
        <Select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select a category...</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Select>
      </div>

      <div className="bg-stone-50 p-4 rounded-lg">
        <h3 className="font-semibold text-stone-900 mb-2">Category Guide:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-stone-700">
          <div>
            <strong>Neck Tag:</strong> Sewn into collar
          </div>
          <div>
            <strong>Care Tag:</strong> Washing instructions
          </div>
          <div>
            <strong>Button/Snap:</strong> Fasteners
          </div>
          <div>
            <strong>Zipper:</strong> Zipper pulls and branding
          </div>
          <div>
            <strong>Tab:</strong> Side seam or pocket tabs
          </div>
          <div>
            <strong>Stitching:</strong> Unique stitch patterns
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={!brandId || !category}>
          Continue
        </Button>
      </div>
    </form>
  );
}
