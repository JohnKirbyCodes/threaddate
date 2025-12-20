"use client";

import { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { X, Upload, ChevronDown, ChevronUp, Pencil, Loader2 } from "lucide-react";
import type { Database } from "@/lib/supabase/types";
import { uploadImageToStorage } from "@/lib/utils/upload-image";

type IdentifierCategory = Database["public"]["Enums"]["identifier_category_enum"];
type Era = Database["public"]["Enums"]["era_enum"];
type StitchType = Database["public"]["Enums"]["stitch_enum"];

const CATEGORIES: IdentifierCategory[] = [
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

const STITCH_TYPES: StitchType[] = ["Single", "Double", "Chain", "Other"];

export interface IdentifierData {
  id: string;
  croppedImage: string;
  category: IdentifierCategory;
  era: Era;
  yearStart?: number;
  yearEnd?: number;
  stitchType?: StitchType;
  originCountry?: string;
  submissionNotes?: string;
  // Position on clothing item image (0.0-1.0 percentages)
  positionX?: number;
  positionY?: number;
}

interface IdentifierCardProps {
  identifier: IdentifierData;
  index: number;
  onUpdate: (id: string, data: Partial<IdentifierData>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
  defaultEra?: Era;
}

export function IdentifierCard({
  identifier,
  index,
  onUpdate,
  onRemove,
  canRemove,
  defaultEra,
}: IdentifierCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(!identifier.croppedImage);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !completedCrop) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const base64Image = canvas.toDataURL("image/png");

    // Upload to Supabase Storage
    setIsUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadImageToStorage(base64Image, "identifiers");
      onUpdate(identifier.id, { croppedImage: imageUrl });
      setImageSrc(null);
      setIsEditingImage(false);
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  // Image upload/crop view
  if (isEditingImage || !identifier.croppedImage) {
    if (imageSrc) {
      // Cropping state
      return (
        <div className="rounded-lg border-2 border-orange-300 bg-orange-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-stone-900">
              Crop Identifier #{index + 1}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setImageSrc(null);
                if (identifier.croppedImage) {
                  setIsEditingImage(false);
                }
              }}
            >
              Cancel
            </Button>
          </div>

          <div className="flex justify-center bg-stone-900 rounded-lg overflow-hidden mb-4">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              className="max-h-[300px]"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                className="max-h-[300px] w-auto"
              />
            </ReactCrop>
          </div>

          {uploadError && (
            <div className="mb-2 p-2 rounded bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{uploadError}</p>
            </div>
          )}

          <Button onClick={handleCropComplete} className="w-full" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Apply Crop"
            )}
          </Button>
        </div>
      );
    }

    // Upload state
    return (
      <div className="rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-stone-900">
            Identifier #{index + 1}
          </h4>
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(identifier.id)}
              className="text-stone-500 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <label className="flex flex-col items-center justify-center w-full h-32 border border-stone-300 rounded-lg cursor-pointer bg-white hover:bg-stone-50 transition-colors">
          <Upload className="h-8 w-8 text-stone-400 mb-2" />
          <p className="text-sm text-stone-600">
            Click to upload identifier photo
          </p>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
          />
        </label>

        {/* Cropping Tips */}
        <div className="mt-3 rounded-md bg-blue-50 p-3 border border-blue-100">
          <p className="text-xs font-medium text-blue-800 mb-1">Tips for best results:</p>
          <ul className="text-xs text-blue-700 space-y-0.5">
            <li>• Fill the frame with the identifier</li>
            <li>• Use good lighting, avoid shadows</li>
            <li>• Include all text and details clearly</li>
            <li>• Crop tightly around the identifier</li>
          </ul>
        </div>
      </div>
    );
  }

  // Completed identifier view (collapsed or expanded)
  return (
    <div className="rounded-lg border border-stone-200 bg-white overflow-hidden">
      {/* Header - always visible */}
      <div className="flex items-center gap-4 p-4">
        <div className="relative h-16 w-16 flex-shrink-0">
          <img
            src={identifier.croppedImage}
            alt={`Identifier ${index + 1}`}
            className="h-full w-full object-cover rounded-md"
          />
          <button
            onClick={() => setIsEditingImage(true)}
            className="absolute -top-1 -right-1 rounded-full bg-white shadow-sm border border-stone-200 p-1 hover:bg-stone-50"
          >
            <Pencil className="h-3 w-3 text-stone-500" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <select
              value={identifier.category}
              onChange={(e) =>
                onUpdate(identifier.id, {
                  category: e.target.value as IdentifierCategory,
                })
              }
              className="text-sm font-medium text-stone-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-orange-600"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <select
              value={identifier.era}
              onChange={(e) =>
                onUpdate(identifier.id, { era: e.target.value as Era })
              }
              className="text-sm text-stone-600 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-orange-600"
            >
              {ERAS.map((era) => (
                <option key={era} value={era}>
                  {era}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(identifier.id)}
              className="text-stone-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-stone-400"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="border-t border-stone-100 p-4 space-y-4 bg-stone-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Year Start
              </label>
              <input
                type="number"
                value={identifier.yearStart || ""}
                onChange={(e) =>
                  onUpdate(identifier.id, {
                    yearStart: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="e.g., 1985"
                className="w-full rounded-md border border-stone-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Year End
              </label>
              <input
                type="number"
                value={identifier.yearEnd || ""}
                onChange={(e) =>
                  onUpdate(identifier.id, {
                    yearEnd: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="e.g., 1990"
                className="w-full rounded-md border border-stone-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Stitch Type
              </label>
              <select
                value={identifier.stitchType || ""}
                onChange={(e) =>
                  onUpdate(identifier.id, {
                    stitchType: e.target.value
                      ? (e.target.value as StitchType)
                      : undefined,
                  })
                }
                className="w-full rounded-md border border-stone-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">Not specified</option>
                {STITCH_TYPES.map((stitch) => (
                  <option key={stitch} value={stitch}>
                    {stitch}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Origin Country
              </label>
              <input
                type="text"
                value={identifier.originCountry || ""}
                onChange={(e) =>
                  onUpdate(identifier.id, { originCountry: e.target.value })
                }
                placeholder="e.g., USA, Japan"
                className="w-full rounded-md border border-stone-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">
              Notes
            </label>
            <textarea
              value={identifier.submissionNotes || ""}
              onChange={(e) =>
                onUpdate(identifier.id, { submissionNotes: e.target.value })
              }
              placeholder="Any additional details about this identifier..."
              rows={2}
              className="w-full rounded-md border border-stone-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Component for adding a new identifier
interface AddIdentifierButtonProps {
  onAdd: () => void;
}

export function AddIdentifierButton({ onAdd }: AddIdentifierButtonProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="w-full rounded-lg border-2 border-dashed border-stone-300 p-6 text-center hover:border-orange-500 hover:bg-orange-50 transition-colors"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-600">
          <span className="text-xl">+</span>
        </div>
        <span className="text-sm font-medium text-stone-700">
          Add Another Identifier
        </span>
      </div>
    </button>
  );
}
