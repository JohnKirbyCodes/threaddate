"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface DetailsStepProps {
  onNext: (data: {
    era: string;
    yearStart?: number;
    yearEnd?: number;
    stitchType?: string;
    originCountry?: string;
    submissionNotes?: string;
  }) => void;
  onBack: () => void;
  initialData?: {
    era?: string;
    yearStart?: number;
    yearEnd?: number;
    stitchType?: string;
    originCountry?: string;
    submissionNotes?: string;
  };
}

const ERAS = [
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

const STITCH_TYPES = ["Single", "Double", "Chain", "Other"];

export function DetailsStep({ onNext, onBack, initialData }: DetailsStepProps) {
  const [era, setEra] = useState(initialData?.era || "");
  const [yearStart, setYearStart] = useState(initialData?.yearStart || "");
  const [yearEnd, setYearEnd] = useState(initialData?.yearEnd || "");
  const [stitchType, setStitchType] = useState(initialData?.stitchType || "");
  const [originCountry, setOriginCountry] = useState(initialData?.originCountry || "");
  const [submissionNotes, setSubmissionNotes] = useState(
    initialData?.submissionNotes || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (era) {
      onNext({
        era,
        yearStart: yearStart ? Number(yearStart) : undefined,
        yearEnd: yearEnd ? Number(yearEnd) : undefined,
        stitchType: stitchType || undefined,
        originCountry: originCountry || undefined,
        submissionNotes: submissionNotes || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Dating Details</h2>
        <p className="text-stone-600">
          Provide as much dating information as you know
        </p>
      </div>

      <div>
        <label
          htmlFor="era"
          className="block text-sm font-medium text-stone-700 mb-2"
        >
          Era *
        </label>
        <Select
          id="era"
          value={era}
          onChange={(e) => setEra(e.target.value)}
          required
        >
          <option value="">Select an era...</option>
          {ERAS.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="yearStart"
            className="block text-sm font-medium text-stone-700 mb-2"
          >
            Year Start (Optional)
          </label>
          <Input
            id="yearStart"
            type="number"
            min="1800"
            max="2030"
            value={yearStart}
            onChange={(e) => setYearStart(e.target.value)}
            placeholder="1985"
          />
        </div>
        <div>
          <label
            htmlFor="yearEnd"
            className="block text-sm font-medium text-stone-700 mb-2"
          >
            Year End (Optional)
          </label>
          <Input
            id="yearEnd"
            type="number"
            min="1800"
            max="2030"
            value={yearEnd}
            onChange={(e) => setYearEnd(e.target.value)}
            placeholder="1989"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="stitchType"
          className="block text-sm font-medium text-stone-700 mb-2"
        >
          Stitch Type (Optional)
        </label>
        <Select
          id="stitchType"
          value={stitchType}
          onChange={(e) => setStitchType(e.target.value)}
        >
          <option value="">Select stitch type...</option>
          {STITCH_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label
          htmlFor="originCountry"
          className="block text-sm font-medium text-stone-700 mb-2"
        >
          Origin Country (Optional)
        </label>
        <Input
          id="originCountry"
          type="text"
          value={originCountry}
          onChange={(e) => setOriginCountry(e.target.value)}
          placeholder="USA, Japan, China, etc."
        />
      </div>

      <div>
        <label
          htmlFor="submissionNotes"
          className="block text-sm font-medium text-stone-700 mb-2"
        >
          Submission Notes (Optional)
        </label>
        <textarea
          id="submissionNotes"
          value={submissionNotes}
          onChange={(e) => setSubmissionNotes(e.target.value)}
          rows={4}
          maxLength={1000}
          placeholder="Explain your dating logic, cite evidence, or add any relevant information..."
          className="flex w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        />
        <p className="mt-1 text-xs text-stone-500">
          {submissionNotes.length}/1000 characters
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Dating Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Look for copyright dates (© 1985)</li>
          <li>• Check for RN numbers (can be dated via FTC records)</li>
          <li>• Note "Made in" country changes over time</li>
          <li>• Union labels changed in specific years</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={!era}>
          Continue to Review
        </Button>
      </div>
    </form>
  );
}
