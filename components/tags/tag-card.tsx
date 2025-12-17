"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowUp, CheckCircle2, Clock, XCircle, Tag } from "lucide-react";

interface TagCardProps {
  id: number;
  imageUrl: string;
  brandName: string;
  category: string;
  era: string;
  verificationScore: number | null;
  status: "pending" | "verified" | "rejected" | null;
}

export function TagCard({
  id,
  imageUrl,
  brandName,
  category,
  era,
  verificationScore,
  status,
}: TagCardProps) {
  const statusConfig = {
    verified: {
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    pending: {
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    rejected: {
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  };

  // Default to pending if status is undefined
  const safeStatus = status || "pending";
  const StatusIcon = statusConfig[safeStatus].icon;

  return (
    <Link href={`/tags/${id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-md hover:ring-2 hover:ring-orange-500">
        {/* Image Container */}
        <div className="relative w-full overflow-hidden bg-white aspect-square">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${brandName} ${category}`}
              className="w-full h-full object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling;
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${imageUrl ? 'hidden' : ''} absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-stone-200 to-stone-300`}>
            <Tag className="h-12 w-12 text-stone-400 mb-2" />
            <p className="text-xs text-stone-500 text-center px-4">{category}</p>
          </div>

          {/* Status Badge */}
          <div
            className={`absolute top-2 right-2 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusConfig[safeStatus].bg} ${statusConfig[safeStatus].color}`}
          >
            <StatusIcon className="h-3 w-3" />
            {safeStatus}
          </div>

          {/* Verification Score */}
          {safeStatus === "verified" && verificationScore !== null && verificationScore > 0 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-stone-700 backdrop-blur-sm">
              <ArrowUp className="h-3 w-3 text-green-600" />
              {verificationScore}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-semibold text-stone-900 truncate">{brandName}</h3>
          <div className="mt-1 flex items-center justify-between text-sm text-stone-600">
            <span>{category}</span>
            <span className="text-xs">{era}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
