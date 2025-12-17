"use client";

import { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageCropStepProps {
  onNext: (croppedImage: string) => void;
  initialImage?: string;
}

const ASPECT_RATIOS = [
  { label: "Square (1:1)", value: 1 },
  { label: "Portrait (3:4)", value: 3 / 4 },
  { label: "Landscape (4:3)", value: 4 / 3 },
  { label: "Wide (16:9)", value: 16 / 9 },
  { label: "Free", value: undefined },
] as const;

export function ImageCropStep({ onNext, initialImage }: ImageCropStepProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(initialImage || null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
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

  const handleAspectRatioChange = (newAspect: number | undefined) => {
    setAspectRatio(newAspect);
    // Reset crop when aspect ratio changes
    if (newAspect) {
      setCrop({
        unit: "%",
        width: 90,
        height: 90 / newAspect,
        x: 5,
        y: 5,
      });
    } else {
      setCrop({
        unit: "%",
        width: 90,
        height: 90,
        x: 5,
        y: 5,
      });
    }
  };

  const createCroppedImage = () => {
    if (!imgRef.current || !completedCrop) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas size to cropped area
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    // Draw cropped image
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

    // Convert to base64 (use PNG to preserve transparency)
    const croppedImage = canvas.toDataURL("image/png");
    onNext(croppedImage);
  };

  if (!imageSrc) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            Upload Identifier Photo
          </h2>
          <p className="text-stone-600">
            Take a clear photo of the tag, button, zipper, or other identifier
          </p>
        </div>

        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="h-12 w-12 text-stone-400 mb-4" />
            <p className="mb-2 text-sm text-stone-700">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-stone-500">
              PNG, JPG, or WebP (MAX. 5MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
          />
        </label>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Tips for Best Results:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use natural lighting or a bright lamp</li>
            <li>• Avoid shadows and glare</li>
            <li>• Get close enough to read small text</li>
            <li>• Include the entire identifier in frame</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Crop Your Photo</h2>
        <p className="text-stone-600">
          Drag the corners to adjust your crop area
        </p>
      </div>

      <div className="flex justify-center bg-stone-900 rounded-lg overflow-hidden">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspectRatio}
          className="max-h-[500px]"
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop preview"
            className="max-h-[500px] w-auto"
          />
        </ReactCrop>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700">Aspect Ratio</label>
          <div className="flex flex-wrap gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.label}
                type="button"
                onClick={() => handleAspectRatioChange(ratio.value)}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  aspectRatio === ratio.value
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-stone-700 border-stone-300 hover:border-orange-600"
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Select "Free" to drag corners independently and crop to any shape
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setImageSrc(null)}
          className="flex-1"
        >
          Choose Different Photo
        </Button>
        <Button onClick={createCroppedImage} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}
