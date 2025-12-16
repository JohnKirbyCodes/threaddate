"use client";

import { useState } from "react";
import Link from "next/link";

const eras = [
  { label: "Pre-40s", value: "1930s" },
  { label: "40s", value: "1940s" },
  { label: "50s", value: "1950s" },
  { label: "60s", value: "1960s" },
  { label: "70s", value: "1970s" },
  { label: "80s", value: "1980s" },
  { label: "90s", value: "1990s" },
  { label: "Y2K", value: "2000s (Y2K)" },
  { label: "Modern", value: "Modern" },
];

export function EraSlider() {
  const [selectedEra, setSelectedEra] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-stone-900">Browse by Era</h2>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {eras.map((era) => (
          <Link
            key={era.value}
            href={`/search?era=${encodeURIComponent(era.value)}`}
            onClick={() => setSelectedEra(era.value)}
          >
            <button
              className={`flex-shrink-0 rounded-full px-6 py-3 text-sm font-medium transition-all ${
                selectedEra === era.value
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
            >
              {era.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
