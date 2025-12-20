"use client";

import { Tag, Shirt } from "lucide-react";

export type SubmissionFlow = "identifier" | "clothing" | null;

interface SubmissionTypeSelectorProps {
  onSelect: (flow: SubmissionFlow) => void;
}

export function SubmissionTypeSelector({ onSelect }: SubmissionTypeSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          What would you like to submit?
        </h1>
        <p className="text-stone-600">
          Choose the type of contribution you'd like to make
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Submit an Identifier */}
        <button
          onClick={() => onSelect("identifier")}
          className="group relative flex flex-col items-center gap-4 rounded-xl border-2 border-stone-200 bg-white p-8 text-left transition-all hover:border-orange-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
            <Tag className="h-8 w-8" />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-stone-900 mb-2">
              Submit an Identifier
            </h3>
            <p className="text-sm text-stone-600 mb-4">
              Add a neck tag, care tag, button, zipper, or other identifier to the database
            </p>
            <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
              Quick &bull; 2 min
            </span>
          </div>

          <div className="absolute inset-0 rounded-xl ring-2 ring-orange-500 opacity-0 transition-opacity group-focus:opacity-100" />
        </button>

        {/* Document a Clothing Item */}
        <button
          onClick={() => onSelect("clothing")}
          className="group relative flex flex-col items-center gap-4 rounded-xl border-2 border-stone-200 bg-white p-8 text-left transition-all hover:border-orange-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
            <Shirt className="h-8 w-8" />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-stone-900 mb-2">
              Document a Clothing Item
            </h3>
            <p className="text-sm text-stone-600 mb-4">
              Catalog a complete garment with all its identifiers in one submission
            </p>
            <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
              Detailed &bull; 5 min
            </span>
          </div>

          <div className="absolute inset-0 rounded-xl ring-2 ring-orange-500 opacity-0 transition-opacity group-focus:opacity-100" />
        </button>
      </div>

      <div className="text-center text-sm text-stone-500">
        <p>
          Not sure which to choose?{" "}
          <button
            onClick={() => onSelect("identifier")}
            className="text-orange-600 hover:underline"
          >
            Start with an identifier
          </button>
          {" "}— it's the quickest way to contribute.
        </p>
      </div>
    </div>
  );
}
