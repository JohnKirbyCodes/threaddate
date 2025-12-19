"use client";

import { useEffect, useRef, useState } from "react";
import { Star, Circle } from "lucide-react";
import { trackTimelineInteraction } from "@/lib/analytics";

interface EraNode {
  era: string;
  count: number;
  yearStart: number;
  yearEnd: number;
}

interface BrandTimelineProps {
  brandName: string;
  brandSlug: string;
  foundedYear: number | null;
  eras: EraNode[];
}

export function BrandTimeline({
  brandName,
  brandSlug,
  foundedYear,
  eras,
}: BrandTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [hoveredEra, setHoveredEra] = useState<string | null>(null);

  if (eras.length === 0) {
    return null;
  }

  // Calculate timeline range
  const minYear = foundedYear || Math.min(...eras.map((e) => e.yearStart));
  const maxYear = Math.max(...eras.map((e) => e.yearEnd), new Date().getFullYear());
  const yearRange = maxYear - minYear;

  // Get max count for sizing
  const maxCount = Math.max(...eras.map((e) => e.count));

  const handleEraClick = (era: string) => {
    trackTimelineInteraction({
      brand: brandSlug,
      era,
      action: "click",
    });

    // Scroll to era section
    const eraElement = document.getElementById(`era-${era.replace(/\s+/g, "-")}`);
    if (eraElement) {
      eraElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleEraHover = (era: string | null) => {
    setHoveredEra(era);
    if (era) {
      trackTimelineInteraction({
        brand: brandSlug,
        era,
        action: "hover",
      });
    }
  };

  return (
    <div className="mb-8 bg-white rounded-lg border border-stone-200 shadow-sm p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-stone-900">
          {brandName} Timeline
        </h2>
        <p className="text-sm text-stone-600">
          Click an era to jump to identifiers
        </p>
      </div>

      <div
        ref={timelineRef}
        className="relative overflow-x-auto pb-4"
      >
        <div className="relative min-w-full h-24">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-300" />

          {/* Founded year marker */}
          {foundedYear && (
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{
                left: `${((foundedYear - minYear) / yearRange) * 100}%`,
              }}
            >
              <div className="flex flex-col items-center">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 mb-2" />
                <div className="text-xs font-medium text-stone-700 whitespace-nowrap">
                  Founded {foundedYear}
                </div>
              </div>
            </div>
          )}

          {/* Era nodes */}
          {eras.map((era) => {
            const position = ((era.yearStart - minYear) / yearRange) * 100;
            const size = 20 + (era.count / maxCount) * 20; // 20-40px diameter
            const isHovered = hoveredEra === era.era;

            return (
              <button
                key={era.era}
                className="absolute top-1/2 -translate-y-1/2 group"
                style={{
                  left: `${position}%`,
                }}
                onClick={() => handleEraClick(era.era)}
                onMouseEnter={() => handleEraHover(era.era)}
                onMouseLeave={() => handleEraHover(null)}
              >
                <div className="relative flex flex-col items-center">
                  {/* Node circle */}
                  <div
                    className={`rounded-full transition-all ${
                      isHovered
                        ? "bg-orange-600 ring-4 ring-orange-200"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                    }}
                  >
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent)]" />
                  </div>

                  {/* Era label */}
                  <div
                    className={`mt-2 text-xs font-medium whitespace-nowrap transition-all ${
                      isHovered
                        ? "text-orange-600 scale-110"
                        : "text-stone-700 group-hover:text-orange-600"
                    }`}
                  >
                    {era.era}
                  </div>

                  {/* Hover tooltip */}
                  {isHovered && (
                    <div className="absolute top-full mt-8 bg-stone-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-20">
                      <div className="font-semibold">{era.era}</div>
                      <div className="text-stone-300">
                        {era.yearStart}-{era.yearEnd}
                      </div>
                      <div className="text-stone-300">
                        {era.count} identifier{era.count !== 1 ? "s" : ""}
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-stone-900" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {/* Today marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{
              left: `${((new Date().getFullYear() - minYear) / yearRange) * 100}%`,
            }}
          >
            <div className="flex flex-col items-center">
              <Circle className="h-3 w-3 text-blue-500 fill-blue-500 mb-2" />
              <div className="text-xs font-medium text-stone-700 whitespace-nowrap">
                Today
              </div>
            </div>
          </div>
        </div>

        {/* Year labels */}
        <div className="relative mt-12 flex justify-between text-xs text-stone-500">
          <span>{minYear}</span>
          <span>{maxYear}</span>
        </div>
      </div>
    </div>
  );
}
