"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImageCropStep } from "@/components/forms/image-crop-step";
import { ClassificationStep } from "@/components/forms/classification-step";
import { DetailsStep } from "@/components/forms/details-step";
import { ReviewStep } from "@/components/forms/review-step";
import { submitTag } from "@/lib/actions/submit-tag";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  verified?: boolean | null;
  verification_status?: string | null;
}

export default function SubmitPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [submittedTagId, setSubmittedTagId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  // Fetch brands from Supabase
  useEffect(() => {
    async function fetchBrands() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("brands")
          .select("id, name, slug, logo_url, verified, verification_status")
          .order("verified", { ascending: false }) // Verified first
          .order("name", { ascending: true });

        if (error) throw error;
        setBrands(data || []);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands. Please refresh the page.");
      } finally {
        setBrandsLoading(false);
      }
    }

    fetchBrands();
  }, []);

  const handleImageNext = (croppedImage: string) => {
    setFormData({ ...formData, croppedImage });
    setStep(2);
  };

  const handleClassificationNext = (data: { brandId: number; category: string }) => {
    setFormData({ ...formData, ...data });
    setStep(3);
  };

  const handleBrandCreated = async (newBrandId: number) => {
    // Refetch brands to include the newly created one
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

  const handleDetailsNext = (data: any) => {
    setFormData({ ...formData, ...data });
    setStep(4);
  };

  const handleSubmit = async () => {
    setError(null);

    const result = await submitTag({
      brandId: formData.brandId,
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
      setSubmittedTagId(result.tagId);
    }
  };

  // Success state
  if (submittedTagId) {
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
              Submission Successful!
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
            <Link href={`/tags/${submittedTagId}`}>
              <Button size="lg">View Your Submission</Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setSubmittedTagId(null);
                setFormData({});
                setStep(1);
              }}
            >
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

      {/* Error Display */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

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
            brandsLoading={brandsLoading}
            onNext={handleClassificationNext}
            onBack={() => setStep(1)}
            onBrandCreated={handleBrandCreated}
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
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
