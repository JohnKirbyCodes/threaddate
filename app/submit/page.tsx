"use client";

import { useState, useEffect } from "react";
import { ImageCropStep } from "@/components/forms/image-crop-step";
import { ClassificationStep } from "@/components/forms/classification-step";
import { DetailsStep } from "@/components/forms/details-step";
import { ReviewStep } from "@/components/forms/review-step";
import { SubmissionTypeSelector, type SubmissionFlow } from "@/components/forms/submission-type-selector";
import { ClothingItemWizard } from "@/components/forms/clothing-item-wizard";
import { submitTag } from "@/lib/actions/submit-tag";
import { submitClothingWithIdentifiers } from "@/lib/actions/submit-clothing-with-identifiers";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type ClothingType = Database["public"]["Enums"]["clothing_type_enum"];

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  verified?: boolean | null;
  verification_status?: string | null;
}

interface ClothingItem {
  id: number;
  name: string;
  slug: string;
  type: ClothingType;
  color?: string | null;
  status?: string | null;
}

type SuccessData =
  | { type: "identifier"; tagId: number }
  | { type: "clothing"; clothingItemId: number; clothingItemSlug: string; tagCount: number };

export default function SubmitPage() {
  const [flow, setFlow] = useState<SubmissionFlow>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [clothingItemsLoading, setClothingItemsLoading] = useState(true);

  // Fetch brands and clothing items from Supabase
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      // Fetch brands
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
        setError("Failed to load brands. Please refresh the page.");
      } finally {
        setBrandsLoading(false);
      }

      // Fetch clothing items
      try {
        const { data, error } = await supabase
          .from("clothing_items")
          .select("id, name, slug, type, color, status")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setClothingItems(data || []);
      } catch (err) {
        console.error("Error fetching clothing items:", err);
      } finally {
        setClothingItemsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Identifier flow handlers
  const handleImageNext = (croppedImage: string) => {
    setFormData({ ...formData, croppedImage });
    setStep(2);
  };

  const handleClassificationNext = (data: { brandId: number; category: string; clothingItemId?: number }) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  const handleBrandCreated = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("brands")
      .select("id, name, slug, logo_url, verified, verification_status")
      .order("verified", { ascending: false })
      .order("name", { ascending: true });

    if (data) {
      setBrands(data);
    }
  };

  const handleClothingItemCreated = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("clothing_items")
      .select("id, name, slug, type, color, status")
      .order("created_at", { ascending: false });

    if (data) {
      setClothingItems(data);
    }
  };

  const handleDetailsNext = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(4);
  };

  const handleIdentifierSubmit = async () => {
    setError(null);

    const result = await submitTag({
      brandId: formData.brandId,
      clothingItemId: formData.clothingItemId,
      category: formData.category,
      era: formData.era,
      yearStart: formData.yearStart,
      yearEnd: formData.yearEnd,
      stitchType: formData.stitchType,
      originCountry: formData.originCountry,
      submissionNotes: formData.submissionNotes,
      imageBase64: formData.croppedImage,
    });

    if (result.error) {
      setError(result.error);
    } else if (result.tagId) {
      setSuccessData({ type: "identifier", tagId: result.tagId });
    }
  };

  // Clothing flow handler
  const handleClothingSubmit = async (data: { clothingItem: any; identifiers: any[] }) => {
    setError(null);

    const result = await submitClothingWithIdentifiers(data);

    if (result.error) {
      throw new Error(result.error);
    }

    if (result.success) {
      setSuccessData({
        type: "clothing",
        clothingItemId: result.clothingItemId!,
        clothingItemSlug: result.clothingItemSlug!,
        tagCount: result.tagCount!,
      });
    }
  };

  // Reset to start new submission
  const handleReset = () => {
    setFlow(null);
    setStep(1);
    setFormData({});
    setSuccessData(null);
    setError(null);
  };

  // Success state - Identifier
  if (successData?.type === "identifier") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              Identifier Submitted!
            </h1>
            <p className="text-lg text-stone-600">
              Your identifier has been submitted for community verification
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Your submission is now marked as "Pending"</li>
              <li>• Community members will vote on the accuracy</li>
              <li>• Once verified, it will appear in search results</li>
              <li>• You'll earn reputation points when it's verified</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/tags/${successData.tagId}`}>
              <Button size="lg">View Your Submission</Button>
            </Link>
            <Button size="lg" variant="outline" onClick={handleReset}>
              Submit Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - Clothing Item
  if (successData?.type === "clothing") {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-2">
              Clothing Item Documented!
            </h1>
            <p className="text-lg text-stone-600">
              Your clothing item with {successData.tagCount} identifier{successData.tagCount !== 1 ? "s" : ""} has been submitted
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• Your submission is now marked as "Pending"</li>
              <li>• Community members will verify each identifier</li>
              <li>• All identifiers are linked to your clothing item</li>
              <li>• You'll earn reputation points for each verified identifier</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/clothing/${successData.clothingItemSlug}`}>
              <Button size="lg">View Clothing Item</Button>
            </Link>
            <Button size="lg" variant="outline" onClick={handleReset}>
              Submit Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const brandName = brands.find((b) => b.id === formData.brandId)?.name || "";

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Error Display */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Flow Selector */}
      {flow === null && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <SubmissionTypeSelector onSelect={setFlow} />
        </div>
      )}

      {/* Identifier Flow */}
      {flow === "identifier" && (
        <>
          {/* Back to flow selector (only on step 1) */}
          {step === 1 && (
            <button
              onClick={() => setFlow(null)}
              className="mb-4 flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Choose different submission type
            </button>
          )}

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex items-center ${
                    s < 4 ? "flex-1" : ""
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                      s <= step
                        ? "bg-orange-600 text-white"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
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
              <span>Upload</span>
              <span>Classify</span>
              <span>Details</span>
              <span>Review</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {step === 1 && (
              <ImageCropStep
                onNext={handleImageNext}
                initialImage={formData.croppedImage}
              />
            )}

            {step === 2 && (
              <ClassificationStep
                brands={brands}
                clothingItems={clothingItems}
                brandsLoading={brandsLoading}
                clothingItemsLoading={clothingItemsLoading}
                onNext={handleClassificationNext}
                onBack={() => setStep(1)}
                onBrandCreated={handleBrandCreated}
                onClothingItemCreated={handleClothingItemCreated}
                initialData={formData}
              />
            )}

            {step === 3 && (
              <DetailsStep
                onNext={handleDetailsNext}
                onBack={() => setStep(2)}
                initialData={formData}
              />
            )}

            {step === 4 && (
              <ReviewStep
                data={{ ...formData, brandName }}
                onBack={() => setStep(3)}
                onSubmit={handleIdentifierSubmit}
              />
            )}
          </div>
        </>
      )}

      {/* Clothing Flow */}
      {flow === "clothing" && (
        <div className="bg-white rounded-lg shadow-lg p-8">
          <ClothingItemWizard
            onBack={() => setFlow(null)}
            onComplete={handleClothingSubmit}
          />
        </div>
      )}
    </div>
  );
}
