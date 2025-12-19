"use client";

import { useState } from "react";
import { Tag } from "lucide-react";

interface TagImageProps {
  imageUrl: string | null;
  brandName: string;
  category: string;
}

export function TagImage({ imageUrl, brandName, category }: TagImageProps) {
  const [imageError, setImageError] = useState(false);

  if (!imageUrl || imageError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300">
        <Tag className="h-12 w-12 text-stone-400 mb-2" />
        <p className="text-xs text-stone-500 text-center px-4">{category}</p>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={`${brandName} ${category}`}
      className="w-full h-full object-contain transition-transform group-hover:scale-105"
      onError={() => setImageError(true)}
    />
  );
}
