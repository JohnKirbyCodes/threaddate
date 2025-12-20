"use client";

import { useState, useTransition } from "react";
import { verifyBrand, VerificationAction } from "@/lib/actions/verify-brand";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string | null;
  verification_status: string | null;
}

interface AdminBrandsListProps {
  brands: Brand[];
}

export function AdminBrandsList({ brands: initialBrands }: AdminBrandsListProps) {
  const [brands, setBrands] = useState(initialBrands);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<number | null>(null);

  const handleAction = async (brandId: number, action: VerificationAction) => {
    setProcessingId(brandId);

    startTransition(async () => {
      const result = await verifyBrand(brandId, action);

      if (result.success) {
        setBrands((prev) => prev.filter((b) => b.id !== brandId));
      } else {
        alert(result.error || "Failed to update brand");
      }

      setProcessingId(null);
    });
  };

  if (brands.length === 0) {
    return (
      <div className="text-center py-12 bg-stone-50 rounded-lg border-2 border-dashed border-stone-200">
        <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <p className="text-stone-600">All brands have been reviewed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-stone-500">
        {brands.length} brand{brands.length !== 1 ? "s" : ""} pending review
      </p>

      <div className="grid gap-4">
        {brands.map((brand) => (
          <Card key={brand.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={brand.name}
                    className="h-12 w-12 object-contain rounded"
                  />
                ) : (
                  <div className="h-12 w-12 bg-stone-100 rounded flex items-center justify-center text-stone-400 text-xs">
                    No logo
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-stone-900">{brand.name}</h3>
                  <p className="text-sm text-stone-500">
                    /brands/{brand.slug}
                  </p>
                  {brand.created_at && (
                    <div className="flex items-center gap-2 mt-1 text-xs text-stone-400">
                      <Clock className="h-3 w-3" />
                      {new Date(brand.created_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(brand.id, "reject")}
                  disabled={isPending && processingId === brand.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {isPending && processingId === brand.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleAction(brand.id, "verify")}
                  disabled={isPending && processingId === brand.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isPending && processingId === brand.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verify
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
