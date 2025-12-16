"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ReviewStepProps {
  data: {
    croppedImage: string;
    brandName: string;
    category: string;
    era: string;
    yearStart?: number;
    yearEnd?: number;
    stitchType?: string;
    originCountry?: string;
    submissionNotes?: string;
  };
  onBack: () => void;
  onSubmit: () => Promise<void>;
}

export function ReviewStep({ data, onBack, onSubmit }: ReviewStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit();
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">
          Review Your Submission
        </h2>
        <p className="text-stone-600">
          Make sure everything looks correct before submitting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Preview */}
        <div>
          <h3 className="font-semibold text-stone-900 mb-3">Identifier Photo</h3>
          <div className="rounded-lg overflow-hidden bg-stone-100 max-w-full">
            <img
              src={data.croppedImage}
              alt="Preview"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-stone-900 mb-3">Details</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-stone-600">Brand</dt>
                <dd className="font-medium text-stone-900">{data.brandName}</dd>
              </div>
              <div>
                <dt className="text-stone-600">Category</dt>
                <dd className="font-medium text-stone-900">{data.category}</dd>
              </div>
              <div>
                <dt className="text-stone-600">Era</dt>
                <dd className="font-medium text-stone-900">{data.era}</dd>
              </div>
              {(data.yearStart || data.yearEnd) && (
                <div>
                  <dt className="text-stone-600">Year Range</dt>
                  <dd className="font-medium text-stone-900">
                    {data.yearStart || "?"} - {data.yearEnd || "?"}
                  </dd>
                </div>
              )}
              {data.stitchType && (
                <div>
                  <dt className="text-stone-600">Stitch Type</dt>
                  <dd className="font-medium text-stone-900">{data.stitchType}</dd>
                </div>
              )}
              {data.originCountry && (
                <div>
                  <dt className="text-stone-600">Origin</dt>
                  <dd className="font-medium text-stone-900">
                    {data.originCountry}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {data.submissionNotes && (
            <div>
              <h3 className="font-semibold text-stone-900 mb-2">Notes</h3>
              <p className="text-sm text-stone-700 bg-stone-50 p-3 rounded-md">
                {data.submissionNotes}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Your submission will be marked as "Pending" and
          require community verification before being marked as "Verified".
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Identifier"
          )}
        </Button>
      </div>
    </div>
  );
}
